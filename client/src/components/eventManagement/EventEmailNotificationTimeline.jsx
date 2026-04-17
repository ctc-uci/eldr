import {
  Box,
  Button,
  Flex,
  HStack,
  Table,
  Text,
} from "@chakra-ui/react";

import {
  LuCalendar,
  LuCheck,
  LuChevronRight,
  LuClock,
  LuMailPlus,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";

const DEFAULT_ROWS = [
  {
    id: "1",
    status: "delivered",
    sendTiming: "Immediately (Upon Sign-up)",
    template: "Confirmation Note",
    actionsDisabled: true,
  },
  {
    id: "2",
    status: "scheduled",
    sendTiming: "2 Weeks Before Event",
    template: "2-Week Reminder",
    actionsDisabled: false,
  },
  {
    id: "3",
    status: "scheduled",
    sendTiming: "1 Week Before Event",
    template: "1-Week Reminder",
    actionsDisabled: false,
  },
  {
    id: "4",
    status: "scheduled",
    sendTiming: "5 Days Before Event",
    template: "5-Day Reminder",
    actionsDisabled: false,
  },
];

const DeliveredIcon = () => (
  <Flex
    w="18px"
    h="18px"
    borderRadius="4px"
    bg="white"
    align="center"
    justify="center"
    flexShrink={0}
  >
    <LuCheck
      size={12}
      strokeWidth={3}
      color="#16A34A"
    />
  </Flex>
);

const ScheduledIcon = () => (
  <Box
    position="relative"
    w="18px"
    h="18px"
    flexShrink={0}
  >
    <LuCalendar
      size={16}
      color="#171717"
      style={{ display: "block" }}
    />
    <Box
      position="absolute"
      bottom="-1px"
      right="-2px"
      bg="#FDE047"
      borderRadius="2px"
      lineHeight={0}
    >
      <LuClock
        size={9}
        color="#171717"
        strokeWidth={2.5}
      />
    </Box>
  </Box>
);

const STATUS_BADGE_W = "128px";
const STATUS_BADGE_H = "28px";

const StatusBadge = ({ status }) => {
  const badgeShellProps = {
    as: "span",
    display: "inline-flex",
    gap: 1.5,
    align: "center",
    justify: "flex-start",
    px: 2.5,
    w: STATUS_BADGE_W,
    minW: STATUS_BADGE_W,
    h: STATUS_BADGE_H,
    minH: STATUS_BADGE_H,
    borderRadius: "4px",
    fontSize: "xs",
    fontWeight: "semibold",
  };

  if (status === "delivered") {
    return (
      <HStack
        {...badgeShellProps}
        bg="#16A34A"
        color="white"
      >
        <DeliveredIcon />
        <Text
          as="span"
          color="white"
          fontSize="xs"
          fontWeight="semibold"
        >
          Delivered
        </Text>
      </HStack>
    );
  }
  return (
    <HStack
      {...badgeShellProps}
      bg="#FDE047"
      color="#171717"
    >
      <ScheduledIcon />
      <Text
        as="span"
        color="#171717"
        fontSize="xs"
        fontWeight="semibold"
      >
        Scheduled
      </Text>
    </HStack>
  );
};

/** UI shell for email timeline; wire to templates API in #130. */
export const EventEmailNotificationTimeline = () => {
  const rows = DEFAULT_ROWS;

  return (
    <Box
      w="100%"
      border="1px solid #E2E8F0"
      borderRadius="lg"
      bg="white"
      p={{ base: 4, md: 6 }}
    >
      <Table.ScrollArea overflowX="auto">
        <Table.Root size="sm" variant="line">
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Send Timing</Table.ColumnHeader>
              <Table.ColumnHeader>Selected Email Template</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.id}>
                <Table.Cell>
                  <StatusBadge status={row.status} />
                </Table.Cell>
                <Table.Cell>
                  <Text
                    fontSize="sm"
                    color="gray.700"
                  >
                    {row.sendTiming}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    variant="outline"
                    size="sm"
                    w="100%"
                    maxW="280px"
                    borderColor="#E2E8F0"
                    color="gray.700"
                    fontWeight="normal"
                    px={3}
                  >
                    <HStack
                      w="100%"
                      justify="space-between"
                      gap={2}
                    >
                      <Text
                        fontSize="sm"
                        textAlign="left"
                        flex={1}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {row.template}
                      </Text>
                      <LuChevronRight
                        size={16}
                        color="#718096"
                        flexShrink={0}
                      />
                    </HStack>
                  </Button>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <HStack
                    gap={1}
                    justify="flex-end"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      color="gray.600"
                      disabled={row.actionsDisabled}
                      opacity={row.actionsDisabled ? 0.4 : 1}
                    >
                      <LuPencil size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      color="red.600"
                      disabled={row.actionsDisabled}
                      opacity={row.actionsDisabled ? 0.4 : 1}
                    >
                      <LuTrash2 size={16} />
                      Delete
                    </Button>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <Flex
        w="100%"
        justify="flex-end"
        mt={8}
      >
        <Button
          variant="outline"
          size="lg"
          borderColor="#E2E8F0"
          color="gray.700"
          px={6}
          gap={2}
          _hover={{ bg: "gray.50" }}
        >
          <LuMailPlus size={18} color="#374151" />
          Add Email Notification
        </Button>
      </Flex>
    </Box>
  );
};
