import {
  Badge,
  Box,
  Circle,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

export const MyEventsList = ({ myEvents, onSelect, selectedEvent }) => {
  const now = new Date();

  const upcoming = myEvents.filter((e) => {
    if (!e.startTime) return true;
    return new Date(e.startTime) >= now;
  });

  const past = myEvents.filter((e) => {
    if (!e.startTime) return false;
    return new Date(e.startTime) < now;
  });

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
      {upcoming.length > 0 && (
        <EventSection
          title="Upcoming Events"
          events={upcoming}
          onSelect={onSelect}
          selectedEvent={selectedEvent}
        />
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <EventSection
          title="Past Events"
          events={past}
          onSelect={onSelect}
          selectedEvent={selectedEvent}
        />
      )}
    </VStack>
  );
};

const EventSection = ({ title, events, onSelect, selectedEvent }) => {
  const isPastSection = title === "Past Events";

  return (
    <Box>
      {isPastSection && (
        <Text
          fontSize="20px"
          fontWeight={400}
          color="#111827"
          px="4px"
          pt="8px"
          pb="12px"
        >
          {title}
        </Text>
      )}

      <VStack
        gap="12px"
        align="stretch"
      >
        {events.map((event) => {
          const isSelected = selectedEvent && selectedEvent.id === event.id;
          return (
            <Flex
              as="button"
              direction="column"
              gap="8px"
              key={event.id}
              borderWidth="1px"
              borderStyle="solid"
              borderColor={isSelected ? "#3B82F6" : "#E5E7EB"}
              outline={isSelected ? "1px solid #3B82F6" : "none"}
              borderRadius="8px"
              bg="white"
              textAlign="left"
              px={{ base: "16px", md: "20px" }}
              py="16px"
              opacity={isPastSection ? 0.6 : 1}
              _hover={{ bg: "#F9FAFB", opacity: isPastSection ? 0.8 : 1 }}
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

              {/* Address */}
              <Text
                fontSize="14px"
                fontWeight={400}
                color="#6B7280"
              >
                {event.location}
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
                    bg="#22C55E"
                  />
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="#111827"
                  >
                    {event.status}
                  </Text>
                </HStack>
                {event.languages.map((l, i) => (
                  <Badge
                    key={i}
                    variant="solid"
                    borderColor="#D1D5DB"
                    color="#27272A"
                    bg="#F4F4F5"
                    px="10px"
                    py="4px"
                  >
                    {l.language}
                  </Badge>
                ))}
                {event.areas.map((a, i) => (
                  <Badge
                    key={i}
                    variant="solid"
                    borderColor="#D1D5DB"
                    color="#27272A"
                    bg="#F4F4F5"
                    px="10px"
                    py="4px"
                  >
                    {a.areasOfInterest}
                  </Badge>
                ))}
              </HStack>
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
};
