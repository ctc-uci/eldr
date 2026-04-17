import {
  Badge,
  Box,
  Circle,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { formatClinicLocationList } from "./clinicLocationFormat";

export const MyEventsList = ({ myEvents, onSelect, selectedEvent }) => {
  const now = new Date();

  // Helper: combine the calendar day from e.date with the time-of-day from e.endTime.
  // This is necessary because startTime/endTime in the DB can have incorrect date portions.
  const getEventEndDateTime = (e) => {
    const dateObj = e.date ? new Date(e.date) : null;

    if (dateObj && e.endTime) {
      const endObj = new Date(e.endTime);
      // Take year/month/day from e.date (UTC) and hours/minutes from e.endTime (UTC)
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
      // No endTime — treat end-of-day as the cutoff
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

  // Filter and sort Upcoming: chronological (closest to now first)
  const upcoming = myEvents
    .filter((e) => {
      if (!e.startTime) return true;
      return new Date(e.startTime) >= now;
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  // Filter and sort Past: reverse chronological (most recent first)
  const past = myEvents
    .filter((e) => {
      if (!e.startTime) return false;
      return new Date(e.startTime) < now;
    })
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

  return (
    <VStack
      bg="#FAFAFA"
      px="16px"
      py="8px"
      minH="100%"
      gap="12px"
      align="stretch"
    >
      {/* Upcoming Events */}
      <EventSection
        isUpcoming={true}
        events={upcoming}
        onSelect={onSelect}
        selectedEvent={selectedEvent}
      />

      {/* Past Events */}
      <EventSection
        isUpcoming={false}
        events={past}
        onSelect={onSelect}
        selectedEvent={selectedEvent}
      />
    </VStack>
  );
};

const EventSection = ({ isUpcoming, events, onSelect, selectedEvent }) => {
  return (
    <Box>
      <Text
        fontSize="20px"
        fontWeight={400}
        color="#111827"
        px="4px"
        pt="8px"
        pb="12px"
      >
        {isUpcoming ? "Upcoming Events" : "Past Events"}
      </Text>

      {events.length === 0 ? (
        <Flex
          align="center"
          justify="center"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="gray.300"
          borderRadius="lg"
          p={6}
        >
          <Text
            fontStyle="italic"
            color="gray.500"
          >
            {isUpcoming
              ? "No upcoming events to show"
              : "No past events to show"}
          </Text>
        </Flex>
      ) : (
        <VStack
          gap="12px"
          align="stretch"
        >
          {events.map((event) => {
            const isSelected = selectedEvent && selectedEvent.id === event.id;
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
                as="button"
                direction="column"
                gap="8px"
                key={event.id}
                borderWidth="1px"
                borderStyle="solid"
                borderColor={isSelected ? "#3B82F6" : "#E5E7EB"}
                borderRadius="8px"
                bg="white"
                textAlign="left"
                px={{ base: "16px", md: "20px" }}
                py="16px"
                opacity={isUpcoming ? 1 : 0.6}
                _hover={{ bg: "#F9FAFB", opacity: isUpcoming ? 1 : 0.8 }}
                _focus={{ outline: "none" }}
                _focusVisible={{ outline: "none" }}
                boxShadow={isSelected ? "0 0 0 1px #3B82F6" : "none"}
                onClick={() => onSelect(event)}
                transition="all 0.15s ease"
              >
                {/* Date/time row + spots */}
                <Flex
                  justifyContent="space-between"
                  width="100%"
                  align="center"
                >
                  <HStack gap="4px">
                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight={400}
                      color="#6B7280"
                    >
                      {event.displayDate}
                    </Text>
                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight={400}
                      color="#6B7280"
                    >
                      •
                    </Text>
                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight={400}
                      color="#6B7280"
                    >
                      {event.displayTime}
                    </Text>
                  </HStack>
                  <Text
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight={400}
                    color="#6B7280"
                    flexShrink={0}
                  >
                    {event.attendees}/{event.capacity} spots filled
                  </Text>
                </Flex>

                {/* Title */}
                <Text
                  fontSize="18px"
                  fontWeight={600}
                  color="#111827"
                >
                  {event.name}
                </Text>

                {/* Location (city, state zip / online / hybrid) */}
                <Text
                  fontSize="14px"
                  fontWeight={400}
                  color="#6B7280"
                >
                  {formatClinicLocationList(event)}
                </Text>

                {/* Status + Tags */}
                <HStack
                  gap="8px"
                  mt="4px"
                  flexWrap="wrap"
                >
                  <HStack gap="6px">
                    <Circle
                      size="8px"
                      bg={statusColor}
                    />
                    <Text
                      fontSize="14px"
                      fontWeight={500}
                      color="#111827"
                    >
                      {statusLabel}
                    </Text>
                  </HStack>
                  {[
                    event.type,
                    ...event.tags,
                    event.locationType,
                    ...event.languages,
                  ].map((item, i) => (
                    <Badge
                      key={i}
                      variant="solid"
                      borderColor="#D1D5DB"
                      color="#27272A"
                      bg="#F4F4F5"
                      px="10px"
                      py="4px"
                    >
                      {item}
                    </Badge>
                  ))}
                </HStack>
              </Flex>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};
