import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  MapPin,
  Users,
} from "lucide-react";

export const EventInfo = ({ event }) => {
  if (!event) return <Box p={10}>Please select an event to view details!</Box>;

  return (
    <Flex
      direction="column"
      py={{ base: 2, md: "50px" }}
      px={{ base: 4, md: 8 }}
      gap={2}
      align="flex-start"
      w="full"
      h="full"
    >
      {/* Event name */}
      <Text
        fontSize="26px"
        fontWeight="400"
        lineHeight="44px"
        letterSpacing="-2.5%"
        color="#000000"
        mb="14px"
      >
        {event.name}
      </Text>

      {/* Event metadata */}
      <VStack
        align="flex-start"
        gap="10px"
        w="full"
        fontSize="16px"
        px="4px"
      >
        <Text
          display="flex"
          alignItems="center"
          gap="16px"
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
          gap="16px"
        >
          <CalendarClock /> {event.displayTime}
        </Text>
        <Separator
          w="full"
          size="xs"
        />
        <Text
          display="flex"
          alignItems="center"
          gap="16px"
        >
          <MapPin /> {event.location}
        </Text>
        <Separator
          w="full"
          size="xs"
        />
        <Text
          display="flex"
          alignItems="center"
          gap="16px"
        >
          <Users /> {event.attendees}/{event.capacity} spots filled
        </Text>
      </VStack>

      {/* Event tags */}
      <HStack
        flexWrap="wrap"
        my={4}
      >
        {event.languages.map((l, i) => (
          <Badge
            key={i}
            variant="solid"
            bg="#F4F4F5"
            color="black"
            fontSize="14px"
          >
            {l.language}
          </Badge>
        ))}
        {event.areas.map((a, i) => (
          <Badge
            key={i}
            variant="solid"
            bg="#F4F4F5"
            color="black"
            fontSize="14px"
          >
            {a.areasOfInterest}
          </Badge>
        ))}
      </HStack>

      {/* Event description */}
      <Box
        w="full"
        overflowY="auto"
        scrollbar="hidden"
      >
        <Text whiteSpace="pre-line">{event.description}</Text>
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

      {/* Register Button */}
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
          variant="solid"
          colorPalette="blue"
          px="18px"
          py="6px"
        >
          <CalendarPlus />
          Register
        </Button>
      </Flex>
    </Flex>
  );
};
