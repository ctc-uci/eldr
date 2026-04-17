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

import {
  getEventEmailNotifications,
  notifyEventEmailNotificationsChanged,
  removeEventEmailNotification,
} from "./eventEmailNotificationsStorage";

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

const StatusBadge = ({ statusKey }) => {
  const s = STATUS[statusKey];
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
  const [customNotifications, setCustomNotifications] = useState(() =>
    getEventEmailNotifications(eventId)
  );

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

  const handleDelete = (row) => {
    if (!eventId || row.kind !== "custom" || !row.id) return;
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
              const statusKey = row.statusKey;
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
