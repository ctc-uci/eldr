import { Badge, Flex, HStack, Text, VStack } from "@chakra-ui/react";

export const EventsList = ({ events, onSelect, selectedEvent }) => {
  return (
    <VStack
      bg="#FAFAFA"
      px="16px"
      py="8px"
      minH="100%"
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
            _hover={{ bg: "#F9FAFB" }}
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
              {event.address}
            </Text>

            {/* Tags */}
            <HStack
              gap="8px"
              mt="4px"
              flexWrap="wrap"
            >
              {event.languages.map((l, i) => (
                <Badge
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
                  {l.language}
                </Badge>
              ))}
              {event.areas.map((a, i) => (
                <Badge
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
                  {a.areasOfInterest}
                </Badge>
              ))}
            </HStack>
          </Flex>
        );
      })}
    </VStack>
  );
};
