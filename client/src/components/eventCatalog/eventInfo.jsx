import { useState } from "react";

import {
  Badge,
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  HStack,
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
  Check,
  MapPin,
  Users,
} from "lucide-react";

export const EventInfo = ({ event, onRegister, onUnregister }) => {
  const [open, setOpen] = useState(false);
  const getAreaLabel = (area) => area.areasOfPractice ?? area.areas_of_practice ?? "";

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

  if (!event) return <Box p={10}>Please select an event to view details!</Box>;

  // Determine if this is a past event using the same logic as MyEventsList
  const getEventEndDateTime = () => {
    const dateObj = event.date ? new Date(event.date) : null;
    if (dateObj && event.endTime) {
      const endObj = new Date(event.endTime);
      return new Date(Date.UTC(
        dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(),
        endObj.getUTCHours(), endObj.getUTCMinutes(), endObj.getUTCSeconds()
      ));
    }
    if (dateObj) {
      return new Date(Date.UTC(
        dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), 23, 59, 59
      ));
    }
    return null;
  };
  const endDateTime = getEventEndDateTime();
  const isPastEvent = endDateTime ? endDateTime < new Date() : false;

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
      <Text
        flexShrink={0}
        fontSize="26px"
        fontWeight="400"
        lineHeight="44px"
        letterSpacing="-2.5%"
        color="#000000"
        mb={{ base: "24px", md: 0 }}
      >
        {event.name}
      </Text>

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
        <Text
          display="flex"
          alignItems="center"
          gap="18px"
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
        {event.languages.map((l, i) => (
          <Badge
            key={i}
            variant="solid"
            bg="#F4F4F5"
            color="#27272A"
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
            bg="#F4F4F5"
            color="#27272A"
            px="10px"
            py="4px"
          >
            {getAreaLabel(a)}
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
        {!isPastEvent && (
          <HStack
            opacity={event.isRegistered ? 1 : 0}
            transition="opacity 0.2s"
            gap={1}
            fontSize="12px"
            mb={2}
          >
            <Check size={16} /> You are attending
          </HStack>
        )}
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
          size="xs"
        >
          <Button
            variant={event.isRegistered ? "surface" : "solid"}
            colorPalette={event.isRegistered ? "red" : "blue"}
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
                  <Dialog.Title>Unregister from this event</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <p>
                    something something guilt trip something something don’t do
                    it pls
                  </p>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
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
