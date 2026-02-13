import { React } from "react";

import { Steps, Flex, HStack, Text, VStack, Badge } from "@chakra-ui/react";

export const EventsList = ( {events, onSelect} ) => {
  return (
    <VStack
      backgroundColor="#D4D4D4"
      p={2}
      minH="100%"
      gap="12px"
      align="stretch"
      textAlign="left"
    >
      {events.map((event) => (
        <Flex
          direction="column"
          minH="160px"
          justify="space-between"
          borderWidth="1px"
          _hover={{ bg: "gray.100" }}
          textAlign="left"
          backgroundColor={"#FFFFFF"}
          p={4}
          asChild><button key={event.title} onClick={() => onSelect(event)}>
            {/* top row of info for button */}
            <Flex
              justifyContent="space-between"
              width="100%"
            >
              <HStack>
                <Text
                  fontSize="16px"
                  fontWeight={400}
                >
                  {event.date}
                </Text>
                <Text
                  fontSize="24px"
                  fontWeight={400}
                >
                  • {/* delimiter between date and time */}
                </Text>
                <Text
                  fontSize="16px"
                  fontWeight={400}
                >
                  {event.time}
                </Text>
              </HStack>
              <Text
                  fontSize="16px"
                  fontWeight={400}
                >
                  {event.spots} spots filled
                </Text>
            </Flex>
            {/* title and address rows */}
            <Text
              fontSize="18px"
              fontWeight={500}>
                {event.title}
            </Text>
            <Text
                  fontSize="16px"
                  fontWeight={400}
                >
                  {event.address}
                </Text>
            <HStack>
              {event.tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    px={3}
                    fontWeight="black">
                    {tag}
                  </Badge>
              ))}
            </HStack>
          </button></Flex>
      ))}
    </VStack>
  );
};
