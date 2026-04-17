import { useState } from "react";

import { Box, Button, Flex, HStack, NativeSelect, Table, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  MailPlus,
  Pencil,
  Trash2,
} from "lucide-react";

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

/** Template key → label, send timing, and status badge */
const EMAIL_TEMPLATE_OPTIONS = {
  confirmation: {
    label: "Confirmation Note",
    timing: "Immediately (Upon Sign-up)",
    statusKey: "delivered",
  },
  twoWeek: {
    label: "2-Week Reminder",
    timing: "2 Weeks Before Event",
    statusKey: "scheduled",
  },
  oneWeek: {
    label: "1-Week Reminder",
    timing: "1 Week Before Event",
    statusKey: "scheduled",
  },
  fiveDay: {
    label: "5-Day Reminder",
    timing: "5 Days Before Event",
    statusKey: "scheduled",
  },
};

/** Sign-up row only: fixed confirmation email */
const SIGNUP_TEMPLATE_KEYS = ["confirmation"];

/** Reminder rows only — Confirmation Note is not available here */
const REMINDER_TEMPLATE_KEYS = ["twoWeek", "oneWeek", "fiveDay"];

const ROWS = [
  { id: "signup", defaultTemplate: "confirmation", actionsDisabled: true },
  { id: "2w", defaultTemplate: "twoWeek", actionsDisabled: false },
  { id: "1w", defaultTemplate: "oneWeek", actionsDisabled: false },
  { id: "5d", defaultTemplate: "fiveDay", actionsDisabled: false },
];

const baseSelectFieldStyle = {
  border: "1px solid #E2E8F0",
  borderRadius: "6px",
  fontSize: "14px",
  height: "40px",
  paddingLeft: "12px",
  paddingRight: "32px",
  color: "#1A202C",
  width: "100%",
  maxWidth: "280px",
};

const getSelectFieldStyle = (readOnly) => ({
  ...baseSelectFieldStyle,
  background: readOnly ? "#F7FAFC" : "white",
  cursor: readOnly ? "not-allowed" : "pointer",
  opacity: readOnly ? 0.92 : 1,
});

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
  const [templateByRow, setTemplateByRow] = useState(() =>
    Object.fromEntries(ROWS.map((r) => [r.id, r.defaultTemplate]))
  );

  const setRowTemplate = (rowId, templateKey) => {
    if (rowId === "signup") return;
    if (templateKey === "confirmation") return;
    setTemplateByRow((prev) => ({ ...prev, [rowId]: templateKey }));
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
            {ROWS.map((row) => {
              const isSignupRow = row.id === "signup";
              const templateKey = templateByRow[row.id];
              const config = EMAIL_TEMPLATE_OPTIONS[templateKey];
              const optionKeys = isSignupRow ? SIGNUP_TEMPLATE_KEYS : REMINDER_TEMPLATE_KEYS;
              return (
                <Table.Row key={row.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell verticalAlign="middle" py={4}>
                    <StatusBadge statusKey={config.statusKey} />
                  </Table.Cell>
                  <Table.Cell color="gray.700" fontSize="sm" verticalAlign="middle" py={4}>
                    {config.timing}
                  </Table.Cell>
                  <Table.Cell verticalAlign="middle" py={4}>
                    <NativeSelect.Root size="md" w="100%" maxW="280px">
                      <NativeSelect.Field
                        value={templateKey}
                        onChange={(e) => setRowTemplate(row.id, e.target.value)}
                        style={getSelectFieldStyle(isSignupRow)}
                        aria-label="Selected email template"
                        disabled={isSignupRow}
                      >
                        {optionKeys.map((key) => (
                          <option key={key} value={key}>
                            {EMAIL_TEMPLATE_OPTIONS[key].label}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      {!isSignupRow ? <NativeSelect.Indicator /> : null}
                    </NativeSelect.Root>
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
