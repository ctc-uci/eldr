import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";

export const EventInfo = ({ event }) => {
  if (!event) return <Box p={10}>Please select an event to view details!</Box>;

  return (
    <Flex
      direction="column"
      h="100%"
      w="100%"
      position="relative"
    >
      {/* Scrollable */}
      <Box
        flex="1"
        overflowY="auto"
        pb="120px"
      >
        <Flex
          justify="center"
          w="100%"
        >
          <VStack
            direction="column"
            w="100%"
            maxW="720px"
            py={{ base: 2, md: "50px" }}
            px={{ base: 4, md: 8 }}
            gap={2}
            align="flex-start"
          >
            {/* Event title */}
            <Box w="100%">
              <Text
                fontSize="36px"
                fontWeight="500"
                lineHeight="44px"
                letterSpacing="-2.5%"
                color="#000000"
              >
                {event.name}
              </Text>
            </Box>

            {/* Event metadata */}
            <VStack
              align="flex-start"
              gap="8px"
            >
              <Text
                display="flex"
                alignItems="center"
                gap="8px"
              >
                <FaCalendarAlt />
                {event.displayDate}
              </Text>
              <Text
                display="flex"
                alignItems="center"
                gap="8px"
              >
                <FaClock /> {event.displayTime}
              </Text>
              <Text
                display="flex"
                alignItems="center"
                gap="8px"
              >
                <IoLocationSharp /> {event.location}
              </Text>
              <Text
                display="flex"
                alignItems="center"
                gap="8px"
              >
                <IoMdPeople /> {event.attendees} spots filled
              </Text>
            </VStack>

            {/* Event tags */}
            <HStack
              flexWrap="wrap"
              mt={4}
            >
              {event.languages.map((l, i) => (
                <Badge
                  key={i}
                  variant="outline"
                >
                  {l.language}
                </Badge>
              ))}
              {event.areas.map((a, i) => (
                <Badge
                  key={i}
                  variant="outline"
                >
                  {a.areasOfInterest}
                </Badge>
              ))}
            </HStack>

            {/* Event description */}
            <Text>{event.description}</Text>
          </VStack>
        </Flex>
      </Box>

      {/* Gradient overlay - fixed at bottom */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="150px"
        bgGradient="to-b"
        gradientFrom="transparent"
        gradientTo="white"
        pointerEvents="none"
      />

      {/* RSVP Button*/}
      <Flex
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        justify="center"
        py={4}
        zIndex={2}
      >
        <Button
          w="148px"
          h="40px"
          backgroundColor="#ADADAD"
          border="3px solid"
          borderColor="#212121"
          borderRadius="4px 2px 2px 2px"
          px="16px"
          py="8px"
          _hover={{ backgroundColor: "#9A9A9A" }}
        >
          RSVP for Event
        </Button>
      </Flex>
    </Flex>
  );
};
