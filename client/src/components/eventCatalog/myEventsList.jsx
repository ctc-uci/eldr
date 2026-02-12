import { React } from "react";

import { Badge, Box, Circle, Flex, HStack, Text, VStack } from "@chakra-ui/react";

export const MyEventsList = ({ events, onSelect, selectedEvent }) => {
  const myEvents = events.filter((e) => e.my_event);
  const upcoming = myEvents.filter((e) => !e.past);
  const past = myEvents.filter((e) => e.past);

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
  return (
    <Box>
      <Text
        fontSize="20px"
        fontWeight={600}
        color="#111827"
        px="4px"
        pt="8px"
        pb="12px"
      >
        {title}
      </Text>
      <VStack gap="12px" align="stretch">
        {events.map((event) => {
          const isSelected = selectedEvent && selectedEvent.id === event.id;
          return (
            <Flex
              as="button"
              direction="column"
              gap="8px"
              key={event.id}
              borderWidth={isSelected ? "2px" : "1px"}
              borderStyle="solid"
              borderColor={isSelected ? "#3B82F6" : "#E5E7EB"}
              borderRadius="8px"
              bg="white"
              textAlign="left"
              px="20px"
              py="16px"
              _hover={{ bg: "#F9FAFB" }}
              onClick={() => onSelect(event)}
              transition="all 0.15s ease"
            >
              {/* Date/time row + spots */}
              <Flex justifyContent="space-between" width="100%" align="center">
                <HStack gap="4px">
                  <Text fontSize="14px" fontWeight={400} color="#6B7280">
                    {event.date}
                  </Text>
                  <Text fontSize="14px" fontWeight={400} color="#6B7280">
                    •
                  </Text>
                  <Text fontSize="14px" fontWeight={400} color="#6B7280">
                    {event.time}
                  </Text>
                </HStack>
                <Text fontSize="14px" fontWeight={400} color="#6B7280">
                  {event.spots} spots filled
                </Text>
              </Flex>

              {/* Title */}
              <Text fontSize="18px" fontWeight={600} color="#111827">
                {event.title}
              </Text>

              {/* Address */}
              <Text fontSize="14px" fontWeight={400} color="#6B7280">
                {event.address}
              </Text>

              {/* Status + Tags */}
              <HStack gap="8px" mt="4px">
                <HStack gap="6px">
                  <Circle size="8px" bg="#22C55E" />
                  <Text fontSize="14px" fontWeight={500} color="#111827">
                    {event.status}
                  </Text>
                </HStack>
                {event.tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    borderColor="#D1D5DB"
                    color="#374151"
                    borderRadius="4px"
                    px="8px"
                    py="2px"
                    fontSize="12px"
                    fontWeight={500}
                    textTransform="none"
                  >
                    {tag}
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
