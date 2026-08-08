import { useEffect, useRef, useState } from "react";

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

import { formatLocationTypeTag, getClinicLocationDisplay } from "./clinicLocationFormat";
import RegStatus from "./regStatus";

import { useNavigate } from "react-router-dom";

export const EventInfo = ({
  event,
  activeTab,
  onRegister,
  onUnregister,
  isMobile,
  registrationPending,
}) => {
  const [open, setOpen] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [scrollState, setScrollState] = useState({ top: true, bottom: false });
  const scrollRef = useRef(null);

  useEffect(() => {
    if (showCopyMessage) {
      const timer = setTimeout(() => {
        setShowCopyMessage(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showCopyMessage]);

  // Re-check scroll state whenever event changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
    checkScroll(el);
  }, [event]);

  const checkScroll = (el) => {
    const atTop = el.scrollTop <= 4;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 4;
    setScrollState({ top: atTop, bottom: atBottom });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll(el);
  };

  const navigate = useNavigate();

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopyMessage(true);
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
        {activeTab === "catalog" ? (
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
              onClick={() => navigate("/event-catalog/all-events")}
            >
              <LuCalendarDays />
              View All Events
            </Button>
          </>
        )}
      </Flex>
    );
  }

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
  const locationTypeTag = formatLocationTypeTag(locationType);

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
      w="full"
      h="full"
      overflow="hidden"
      position="relative"
    >
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        overflowY="auto"
        flex="1"
        scrollbar="hidden"
        py={{ base: 7, md: "50px" }}
        px={{ base: 4, md: 8 }}
        bg = "white"
      >
        {/* Title + share button */}
        <HStack
          justify="space-between"
          align="flex-start"
          mb="20px"
          gap={3}
          minW={0}
        >
          <Text
            fontSize={{ base: "20px", md: "26px" }}
            fontWeight="bold"
            lineHeight={{ base: "28px", md: "44px" }}
            letterSpacing="-2.5%"
            color="#000000"
            wordBreak="break-word"
            minW={0}
            flex="1"
          >
            {event.name}
          </Text>

          {activeTab === "catalog" && (
            <Box position="relative" flexShrink={0}>
              <Box
                position="absolute"
                bottom="100%"
                right={0}
                mb={2}
                bg="#487C9E"
                color="white"
                rounded="md"
                fontWeight={500}
                fontSize="xs"
                px={2}
                py={0.5}
                whiteSpace="nowrap"
                zIndex={10}
                transition="all 0.2s ease-out"
                opacity={showCopyMessage ? 1 : 0}
                transform={showCopyMessage ? "translateY(0)" : "translateY(5px)"}
                pointerEvents="none"
              >
                Link copied!
              </Box>

              <IconButton
                variant="outline"
                colorPalette="gray"
                onClick={handleShare}
              >
                <Share />
              </IconButton>
            </Box>
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
            wordBreak="break-word"
            minW={0}
            w="full"
          >
            <Box flexShrink={0}><CalendarDays /></Box>
            {event.displayDate}
          </Text>
          <Separator w="full" size="xs" />
          <Text
            display="flex"
            alignItems="center"
            gap="18px"
            wordBreak="break-word"
            minW={0}
            w="full"
          >
            <Box flexShrink={0}><CalendarClock /></Box>
            {event.displayTime}
          </Text>
          <Separator w="full" size="xs" />
          <Flex
            alignItems="flex-start"
            gap="18px"
            w="full"
            minW={0}
          >
            <Box flexShrink={0} mt="2px">
              <MapPin />
            </Box>
            <VStack align="flex-start" gap="4px" flex="1" minW={0}>
              <Text lineHeight="1.4" wordBreak="break-word">{localityLine}</Text>
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
                  wordBreak="break-all"
                >
                  Meeting link
                </Text>
              ) : null}
            </VStack>
          </Flex>
          <Separator w="full" size="xs" />
          <Text
            display="flex"
            alignItems="center"
            gap="18px"
            wordBreak="break-word"
            minW={0}
            w="full"
          >
            <Box flexShrink={0}><Users /></Box>
            {event.attendees}/{event.capacity} spots filled
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
            locationTypeTag,
            ...event.languages,
          ]
            .filter(Boolean)
            .map((item, i) => (
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
        <Text whiteSpace="pre-line" wordBreak="break-word">
          {event.description}
        </Text>

        <Box h="24px" />
      </Box>

      {!scrollState.top && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="80px"
          bgGradient="to-b"
          gradientFrom="white"
          gradientTo="transparent"
          pointerEvents="none"
          zIndex={1}
        />
      )}

      {!scrollState.bottom && (
        <Box
          position="absolute"
          bottom="60px"
          left={0}
          right={0}
          height="80px"
          bgGradient="to-b"
          gradientFrom="transparent"
          gradientTo="white"
          pointerEvents="none"
          zIndex={1}
        />
      )}

      <Flex
        flexShrink={0}
        direction="column"
        align="center"
        justify="center"
        zIndex={2}
        bg="white"
        pb={{ base: 5, md: 4 }}
        pt={2}
        px={{ base: 4, md: 8 }}
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
              disabled={registrationPending}
              loading={registrationPending}
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
                  <Dialog.Body px={{ base: 6, md: 4 }}>
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
    </Flex>
  );
};