import { useCallback, useEffect, useMemo, useState } from "react";

import { Box, Button, Flex, HStack, Table, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  MailPlus,
  Pencil,
  Trash2,
} from "lucide-react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

import {
  getEventEmailNotifications,
  notifyEventEmailNotificationsChanged,
  removeEventEmailNotification,
} from "./eventEmailNotificationsStorage";
import { computeSendInstantMs } from "./eventEmailSchedule";

const STATUS = {
  delivered: {
    label: "Delivered",
    bg: "#22C55E",
    color: "white",
    icon: CheckCircle2,
  },
  scheduled: {
    label: "Scheduled",
    bg: "#FDE047",
    color: "#171923",
    icon: Calendar,
  },
};

const SIGNUP_CONFIG = {
  id: "signup",
  statusKey: "delivered",
  sendTiming: "Immediately (Upon Sign-up)",
  templateLabel: "Confirmation Note",
  actionsDisabled: true,
};

/**
 * Custom rows: Delivered after the send instant. Uses `computeSendInstantMs` (event `date` +
 * local wall time from `startTime`) so "N Minutes Before" matches your clock, not UTC-only parsing.
 */
function displayStatusKeyForCustomRow(row, nowMs, clinic) {
  const amt = typeof row.amount === "number" ? row.amount : Number(row.amount);
  if (
    clinic &&
    row.unit &&
    typeof row.unit === "string" &&
    Number.isFinite(amt) &&
    amt >= 1
  ) {
    try {
      const at = computeSendInstantMs(clinic, amt, row.unit);
      if (!Number.isNaN(at)) {
        return nowMs >= at ? "delivered" : "scheduled";
      }
    } catch {
      /* use fallback below */
    }
  }
  if (typeof row.sendAtIso === "string" && row.sendAtIso.trim() !== "") {
    const at = new Date(row.sendAtIso).getTime();
    if (!Number.isNaN(at) && nowMs >= at) return "delivered";
  }
  return "scheduled";
}

const StatusBadge = ({ statusKey }) => {
  const s = STATUS[statusKey] ?? STATUS.scheduled;
  const Icon = s.icon;
  return (
    <HStack
      display="inline-flex"
      gap={1.5}
      px={2.5}
      py={1}
      rounded="l2"
      bg={s.bg}
      color={s.color}
      fontSize="xs"
      fontWeight="semibold"
      w="128px"
      minW="128px"
      justify="center"
    >
      <Icon size={14} strokeWidth={2.5} flexShrink={0} />
      <Text fontSize="xs" fontWeight="semibold" textAlign="center" whiteSpace="nowrap">
        {s.label}
      </Text>
    </HStack>
  );
};

export const EmailNotificationTimeline = ({ eventId }) => {
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [nowTick, setNowTick] = useState(0);
  const [clinic, setClinic] = useState(null);
  const [customNotifications, setCustomNotifications] = useState(() =>
    getEventEmailNotifications(eventId)
  );

  useEffect(() => {
    if (!eventId) {
      setClinic(null);
      return;
    }
    let cancelled = false;
    backend
      .get(`/clinics/${eventId}`)
      .then((res) => {
        if (cancelled) return;
        setClinic(res.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setClinic(null);
      });
    return () => {
      cancelled = true;
    };
  }, [backend, eventId]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setNowTick((t) => t + 1);
    }, 10000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") setNowTick((t) => t + 1);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const refresh = useCallback(() => {
    setCustomNotifications(getEventEmailNotifications(eventId));
  }, [eventId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onChanged = (e) => {
      if (e?.detail?.eventId != null && String(e.detail.eventId) === String(eventId)) {
        refresh();
      }
    };
    window.addEventListener("eldr-event-email-notifications-changed", onChanged);
    return () => window.removeEventListener("eldr-event-email-notifications-changed", onChanged);
  }, [eventId, refresh]);

  const rows = useMemo(() => {
    const signupRow = { kind: "signup", ...SIGNUP_CONFIG };
    const added = customNotifications.map((n) => ({
      kind: "custom",
      ...n,
      actionsDisabled: false,
    }));
    return [signupRow, ...added];
  }, [customNotifications]);

  const handleDelete = async (row) => {
    if (!eventId || row.kind !== "custom" || !row.id) return;
    const sid = row.scheduledEmailId;
    if (sid != null) {
      try {
        await backend.delete(`/emails/schedule/${sid}`);
      } catch (err) {
        if (err?.response?.status !== 404) {
          console.warn("Could not remove scheduled email from queue:", err);
        }
      }
    }
    removeEventEmailNotification(eventId, row.id);
    notifyEventEmailNotificationsChanged(eventId);
    refresh();
  };

  return (
    <Box w="100%">
      <Box overflowX="auto" w="100%">
        <Table.Root size="md" variant="line" borderWidth="1px" borderColor="gray.200">
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader fontWeight="bold" color="gray.800" py={4}>
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" color="gray.800" py={4}>
                Send Timing
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" color="gray.800" py={4}>
                Selected Email Template
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" color="gray.800" py={4} textAlign="left">
                Actions
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => {
              const statusKey =
                row.kind === "signup"
                  ? row.statusKey
                  : displayStatusKeyForCustomRow(row, Date.now(), clinic);
              const sendTiming =
                row.kind === "signup" ? row.sendTiming : row.sendTimingLabel;
              const templateLabel =
                row.kind === "signup" ? row.templateLabel : row.templateName;
              const rowKey = row.kind === "signup" ? SIGNUP_CONFIG.id : row.id;

              return (
                <Table.Row key={rowKey} _hover={{ bg: "gray.50" }}>
                  <Table.Cell verticalAlign="middle" py={4}>
                    <StatusBadge statusKey={statusKey} />
                  </Table.Cell>
                  <Table.Cell color="gray.700" fontSize="sm" verticalAlign="middle" py={4}>
                    {sendTiming}
                  </Table.Cell>
                  <Table.Cell verticalAlign="middle" py={4}>
                    <Text
                      fontSize="sm"
                      color="gray.700"
                      maxW="280px"
                    >
                      {templateLabel}
                    </Text>
                  </Table.Cell>
                  <Table.Cell verticalAlign="middle" py={4}>
                    <HStack justify="flex-start" gap={2} flexWrap="wrap">
                      <Button
                        type="button"
                        aria-label="Edit notification"
                        variant="outline"
                        size="sm"
                        borderColor="gray.300"
                        bg="white"
                        color="gray.800"
                        fontWeight="normal"
                        gap={2}
                        px={3}
                        h="auto"
                        py={1.5}
                        disabled={row.actionsDisabled}
                        opacity={row.actionsDisabled ? 0.45 : 1}
                        cursor={row.actionsDisabled ? "not-allowed" : "pointer"}
                        _hover={
                          row.actionsDisabled
                            ? {}
                            : { bg: "gray.50" }
                        }
                        onClick={() => {
                          if (row.kind !== "custom" || !eventId || !row.id) return;
                          navigate(
                            `/events/${eventId}/email-notification/edit/${row.id}`
                          );
                        }}
                      >
                        <Pencil size={16} strokeWidth={2} aria-hidden />
                        <Text fontSize="sm">Edit</Text>
                      </Button>
                      <Button
                        type="button"
                        aria-label="Delete notification"
                        variant="outline"
                        size="sm"
                        borderColor="gray.300"
                        bg="white"
                        color="gray.800"
                        fontWeight="normal"
                        gap={2}
                        px={3}
                        h="auto"
                        py={1.5}
                        disabled={row.actionsDisabled}
                        opacity={row.actionsDisabled ? 0.45 : 1}
                        cursor={row.actionsDisabled ? "not-allowed" : "pointer"}
                        _hover={
                          row.actionsDisabled
                            ? {}
                            : { bg: "gray.50" }
                        }
                        onClick={() => handleDelete(row)}
                      >
                        <Trash2 size={16} strokeWidth={2} aria-hidden />
                        <Text fontSize="sm">Delete</Text>
                      </Button>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>

      <Flex justify="flex-end" mt={6}>
        <Button
          variant="outline"
          borderColor="gray.300"
          bg="white"
          color="gray.800"
          gap={2}
          _hover={{ bg: "gray.50" }}
          disabled={!eventId}
          opacity={!eventId ? 0.5 : 1}
          cursor={!eventId ? "not-allowed" : "pointer"}
          onClick={() => {
            if (eventId) navigate(`/events/${eventId}/email-notification/new`);
          }}
        >
          <MailPlus size={18} />
          Add Email Notification
        </Button>
      </Flex>
    </Box>
  );
};
