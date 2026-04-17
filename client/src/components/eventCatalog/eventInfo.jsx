import { useState } from "react";

import {
  Badge,
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  HStack,
  IconButton,
  Portal,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  CalendarX,
  MapPin,
  Share,
  Users,
} from "lucide-react";
import { LuCalendarDays } from "react-icons/lu";

import { getClinicLocationDisplay } from "./clinicLocationFormat";
import RegStatus from "./regStatus";

export const EventInfo = ({
  event,
  activeTab,
  onRegister,
  onUnregister,
  isMobile,
}) => {
  const [open, setOpen] = useState(false);

  const handleRegistration = () => {
    if (event.isRegistered) {
      setOpen(true);
    } else {
      onRegister?.(event.id);
    }
  };

  const confirmUnregister = () => {
    onUnregister?.(event.id);
    setOpen(false);
  };

  if (!event) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="full"
        h="full"
        p={10}
        gap={6}
        textAlign="center"
      >
        {activeTab === "all" ? (
          <Text
            fontSize="lg"
            color="gray.500"
            fontStyle="italic"
          >
            Please select an event to view details!
          </Text>
        ) : (
          <>
            <CalendarX
              size={32}
              color="#a1a1aa"
              strokeWidth={1.5}
            />
            <Text
              fontWeight={600}
              fontSize="lg"
            >
              You aren't registered for any upcoming events yet.
            </Text>
            <Text
              fontSize="sm"
              color="#52525B"
            >
              Browse to find an offering that fits your schedule!
            </Text>
            <Button
              bg="#487C9E"
              p={6}
            >
              <LuCalendarDays />
              View All Events
            </Button>
          </>
        )}
      </Flex>
    );
  }

  // Determine if this is a past event using the same logic as MyEventsList
  const getEventEndDateTime = () => {
    const dateObj = event.date ? new Date(event.date) : null;
    if (dateObj && event.endTime) {
      const endObj = new Date(event.endTime);
      return new Date(
        Date.UTC(
          dateObj.getUTCFullYear(),
          dateObj.getUTCMonth(),
          dateObj.getUTCDate(),
          endObj.getUTCHours(),
          endObj.getUTCMinutes(),
          endObj.getUTCSeconds()
        )
      );
    }
    if (dateObj) {
      return new Date(
        Date.UTC(
          dateObj.getUTCFullYear(),
          dateObj.getUTCMonth(),
          dateObj.getUTCDate(),
          23,
          59,
          59
        )
      );
    }
    return null;
  };
  const endDateTime = getEventEndDateTime();
  const isPastEvent = endDateTime ? endDateTime < new Date() : false;

  const { localityLine, meetingLink } = getClinicLocationDisplay(event);
  const locationType = event.locationType ?? event.location_type;
  const showMeetingLink =
    meetingLink && (locationType === "online" || locationType === "hybrid");

  const isUpcoming = event.startTime
    ? new Date(event.startTime) >= new Date()
    : true;
  let statusLabel = "Registered";
  let statusColor = "#22C55E";

  if (!isUpcoming) {
    if (event.hasAttended) {
      statusLabel = "Attended";
      statusColor = "#22C55E";
    } else {
      statusLabel = "Missed";
      statusColor = "#DC2626";
    }
  }

  return (
    <Flex
      direction="column"
      py={{ base: 2, md: "50px" }}
      px={{ base: 4, md: 8 }}
      w="full"
      h="full"
      justify="space-between"
      flex="1"
      overflow="hidden"
    >
      {/* Event name */}
      <HStack
        justify="space-between"
        mb="20px"
      >
        <Text
          flexShrink={0}
          fontSize="26px"
          fontWeight="bold"
          lineHeight="44px"
          letterSpacing="-2.5%"
          color="#000000"
        >
          {event.name}
        </Text>
        {activeTab === "all" && (
          <IconButton
            variant="outline"
            colorPalette="gray"
          >
            <Share />
          </IconButton>
        )}
      </HStack>

      {/* Event metadata */}
      <VStack
        flexShrink={0}
        align="flex-start"
        gap="12px"
        w="full"
        fontSize="14px"
        px="4px"
      >
        <Text
          display="flex"
          alignItems="center"
          gap="18px"
        >
          <CalendarDays />
          {event.displayDate}
        </Text>
        <Separator
          w="full"
          size="xs"
        />
        <Text
          display="flex"
          alignItems="center"
          gap="18px"
        >
          <CalendarClock /> {event.displayTime}
        </Text>
        <Separator
          w="full"
          size="xs"
        />
        <Flex
          alignItems="flex-start"
          gap="18px"
        >
          <Box
            flexShrink={0}
            mt="2px"
          >
            <MapPin />
          </Box>
          <VStack
            align="flex-start"
            gap="4px"
            flex="1"
          >
            <Text lineHeight="1.4">{localityLine}</Text>
            {showMeetingLink ? (
              <Text
                as="a"
                href={meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                color="#2563EB"
                fontSize="13px"
                fontWeight={500}
                textDecoration="underline"
              >
                Meeting link
              </Text>
            ) : null}
          </VStack>
        </Flex>
        <Separator
          w="full"
          size="xs"
        />
        <Text
          display="flex"
          alignItems="center"
          gap="18px"
        >
          <Users /> {event.attendees}/{event.capacity} spots filled
        </Text>
      </VStack>

      {/* Event tags */}
      <HStack
        flexShrink={0}
        flexWrap="wrap"
        my={6}
        fontSize="12px"
        fontWeight={500}
        gap="10px"
      >
        {activeTab === "my" && (
          <RegStatus
            statusColor={statusColor}
            statusLabel={statusLabel}
          />
        )}
        {[
          event.type,
          ...event.tags,
          event.locationType,
          ...event.languages,
        ].map((item, i) => (
          <Badge
            key={i}
            variant="solid"
            border="1px solid #E4E4E7"
            color="#27272A"
            bg="#F4F4F5"
            px="10px"
            py="4px"
          >
            {item}
          </Badge>
        ))}
      </HStack>

      {/* Event description */}
      <Box
        w="full"
        overflowY="auto"
        scrollbar="hidden"
        flex="1"
        minH={0}
      >
        <Text whiteSpace="pre-line">{event.description}</Text>
      </Box>

      {/* Register Button */}
      <Flex
        flexShrink={0}
        direction="column"
        align="center"
        justify="center"
        alignSelf="center"
        zIndex={2}
        mt={3}
        mb={{ base: 5, md: 1 }}
      >
        {isPastEvent ? (
          <Button
            variant="surface"
            colorPalette={event.hasAttended ? "blue" : "red"}
            px="18px"
            py="6px"
            disabled
            cursor="default"
          >
            {event.hasAttended ? (
              <>
                <CalendarCheck /> Attended
              </>
            ) : (
              <>
                <CalendarX /> Missed
              </>
            )}
          </Button>
        ) : (
          <Dialog.Root
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            placement="center"
            motionPreset="slide-in-bottom"
            size={isMobile ? "xs" : "md"}
          >
            <Button
              variant="solid"
              colorPalette={event.isRegistered ? "red" : "blue"}
              bg={!event.isRegistered && "#487C9E"}
              px="18px"
              py="6px"
              onClick={handleRegistration}
            >
              {event.isRegistered ? (
                <>
                  <CalendarX /> Unregister
                </>
              ) : (
                <>
                  <CalendarPlus /> Register
                </>
              )}
            </Button>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Unregister from event?</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <p>
                      At Community Counsel, your role is vital for providing
                      justice for your neighbors. Are you sure you need to
                      unregister?
                    </p>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Keep my spot</Button>
                    </Dialog.ActionTrigger>
                    <Button
                      colorPalette="red"
                      onClick={confirmUnregister}
                    >
                      Unregister
                    </Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        )}
      </Flex>

      {/* Gradient overlay - fixed at bottom */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="40%"
        bgGradient="to-b"
        gradientFrom="transparent"
        gradientTo="white"
        pointerEvents="none"
      />
    </Flex>
  );
};
