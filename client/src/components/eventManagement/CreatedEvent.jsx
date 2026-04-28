import { useEffect, useState } from "react";
import { Box, Button, Flex, HStack, Tag, Text, VStack } from "@chakra-ui/react";

import {
  LuCalendar,
  LuClock,
  LuMail,
  LuMapPin,
  LuPencil,
  LuShare,
  LuFolderInput,
  LuUsers,
} from "react-icons/lu";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { toaster } from "@/components/ui/toaster";
import { ConfirmDialog } from "./ConfirmDialog";
import { EmailNotificationTimeline } from "./EmailNotificationTimeline";
import { EventVolunteerList } from "./EventVolunteerList";

export const CreatedEvent = () => {
  const { eventId } = useParams();
  const { state: locationState } = useLocation();
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [eventData, setEventData] = useState(locationState?.eventData ?? null);
  const [activeTab, setActiveTab] = useState("details");
  const [linkCopied, setLinkCopied] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await backend.delete(`/clinics/${eventId}`);
      navigate("/events");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  useEffect(() => {
    if (locationState?.editFeedback === "saved") {
      toaster.success({
        title: "Edits to this event have been saved successfully.",
      });
      window.history.replaceState({}, "");
    } else if (locationState?.editFeedback === "discarded") {
      toaster.error({
        title: "Edits to this event have been discarded.",
      });
      window.history.replaceState({}, "");
    }
  }, [locationState?.editFeedback]);

  useEffect(() => {
    if (eventData) return;
    const fetch = async () => {
      try {
        const [clinicRes, langRes] = await Promise.all([
          backend.get(`/clinics/${eventId}`),
          backend.get(`/clinics/${eventId}/languages`),
        ]);
        setEventData({ ...clinicRes.data, languages: langRes.data });
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [backend, eventId, eventData]);

  const {
    name = "This is an upcoming Clinic Event",
    date,
    startTime,
    endTime,
    capacity = 50,
    attendees = 0,
    type,
    locationType,
    languages = [],
    address,
    city,
    state,
    zip,
    meetingLink,
  } = eventData || {};

  const formatTime = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  };

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      })
    : "";
  const formattedTime =
    startTime && endTime
      ? `${formatTime(startTime)} - ${formatTime(endTime)}`
      : "";

  const capitalizeLocationType = (str) =>
    str
      ? str
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join("-")
      : "";

  const locationStr = (() => {
    const mode = (locationType || "").toLowerCase();
    const inPerson = [address, city, state, zip].filter(Boolean).join(", ");
    if (mode === "online") return meetingLink || "";
    if (mode === "hybrid")
      return [inPerson, meetingLink].filter(Boolean).join(" | ");
    return inPerson;
  })();

  const tabs = [
    { key: "details", label: "Event Details" },
    { key: "volunteers", label: "Volunteer List" },
    { key: "email", label: "Email Notification Timeline" },
  ];

  return (
    <VStack
      w="100%"
      minH="100vh"
      bg="white"
      align="start"
      px={10}
      pt={10}
      pb={10}
      gap={6}
    >
      {/* Breadcrumb */}
      <HStack
        fontSize="lg"
        gap={1}
      >
        <Text
          fontWeight="semibold"
          color="gray.800"
          cursor="pointer"
          onClick={() => navigate("/events")}
        >
          Event Catalog
        </Text>
        <Text color="gray.400">›</Text>
        <Text
          color="blue.600"
        >
          View Event
        </Text>
      </HStack>

      {/* Title + action buttons row */}
      <Flex
        w="100%"
        justify="space-between"
        align="start"
      >
        <VStack
          align="start"
          gap={4}
        >
          {/* Event name */}
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="gray.800"
          >
            {name}
          </Text>

          {/* Date + Time */}
          <HStack gap={6}>
            <HStack
              gap={2}
              color="gray.600"
              fontSize="sm"
            >
              <LuCalendar />
              <Text>{formattedDate}</Text>
            </HStack>
            <HStack
              gap={2}
              color="gray.600"
              fontSize="sm"
            >
              <LuClock />
              <Text>{formattedTime}</Text>
            </HStack>
          </HStack>

          {/* Location + Spots */}
          <HStack gap={6}>
            <HStack
              gap={2}
              color="gray.600"
              fontSize="sm"
            >
              <LuMapPin />
              <Text>{locationStr}</Text>
            </HStack>
            <HStack
              gap={2}
              color="gray.600"
              fontSize="sm"
            >
              <LuUsers />
              <Text>
                {attendees}/{capacity} spots filled
              </Text>
            </HStack>
          </HStack>

          {/* Tags */}
          <HStack
            gap={2}
            mt={1}
          >
            {[type, capitalizeLocationType(locationType), ...languages.map((l) => (typeof l === "string" ? l : l.language))]
              .filter(Boolean)
              .map((tag) => (
                <Tag.Root
                  key={tag}
                  size="md"
                  borderRadius="4px"
                  border="0.5px solid"
                  borderColor="gray.200"
                  bg="gray.100"
                  px={2}
                  py={1}
                >
                  <Tag.Label
                    fontSize="xs"
                    fontWeight="medium"
                  >
                    {tag}
                  </Tag.Label>
                </Tag.Root>
              ))}
          </HStack>
        </VStack>

        {/* Copy link / Delete / Edit buttons */}
        <HStack gap={2} align="center">
          <Box position="relative">
            <Button
              variant="outline"
            border="1px solid #E2E8F0"
              bg="white"
              color="gray.700"
              borderRadius="4px"
              px={3}
              _hover={{ bg: "gray.50" }}
              onClick={handleCopyLink}
            >
              <LuShare />
            </Button>
            {linkCopied && (
              <Box
                position="absolute"
                bottom="calc(100% + 6px)"
                left="50%"
                transform="translateX(-50%)"
                bg="#487C9E"
                color="white"
                fontSize="xs"
                fontWeight="medium"
                px={3}
                py={1}
                borderRadius="4px"
                whiteSpace="nowrap"
                pointerEvents="none"
              >
                Link copied!
              </Box>
            )}
          </Box>

          <Button
            variant="outline"
            border="1px solid"
            borderColor="red.200"
            bg="white"
            color="red.700"
            borderRadius="4px"
            gap={2}
            px={4}
            _hover={{ bg: "red.600", borderColor: "red.600", color: "white" }}
            onClick={() => setDeleteOpen(true)}
          >
            <LuFolderInput />
            Delete Event
          </Button>

          <Button
            bg="#487C9E"
            color="white"
            borderRadius="4px"
            gap={2}
            px={4}
            _hover={{ bg: "#294A5F" }}
            onClick={() => navigate(`/events/${eventId}/edit/header`)}
          >
            <LuPencil />
            Edit Event
          </Button>
        </HStack>
      </Flex>

      {/* Tabs */}
      <VStack w="100%" gap={0}>
        {/* Tab strip */}
        <HStack
          gap={1}
          borderBottom="1px solid"
          borderColor="gray.200"
          w="100%"
          align="end"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Button
                key={tab.key}
                variant="unstyled"
                borderRadius="6px 6px 0 0"
                border={isActive ? "1px solid" : "none"}
                borderColor="gray.200"
                borderBottomColor={isActive ? "white" : undefined}
                mb="-1px"
                color={isActive ? "gray.800" : "gray.600"}
                bg={isActive ? "white" : "transparent"}
                fontWeight={isActive ? "medium" : "normal"}
                px={4}
                py={2.5}
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={2}
                onClick={() => setActiveTab(tab.key)}
                _hover={{ bg: isActive ? "white" : "gray.50", color: isActive ? "gray.800" : "gray.700" }}
                _focusVisible={{ outline: "none", boxShadow: "none" }}
              >
                <LuMail size={16} />
                {tab.label}
              </Button>
            );
          })}
        </HStack>

        {/* Tab content — no top border/radius so it merges with the strip */}
        {activeTab === "details" && (
          <Box w="100%" bg="white" borderLeft="1px solid" borderRight="1px solid" borderBottom="1px solid" borderColor="gray.200" borderRadius="0 0 6px 6px" p={8}>
            <VStack align="start" gap={6}>
              <VStack align="start" gap={2}>
                <Text fontWeight="bold" fontSize="md" color="gray.800">Description</Text>
                <Text fontSize="sm" color="gray.600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
                  massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                  sapien fringilla, mattis ligula consectetur, ultrices mauris.
                  Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
                  massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                  sapien fringilla, mattis ligula consectetur, ultrices mauris.
                  Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
                </Text>
              </VStack>
              <VStack align="start" gap={2}>
                <Text fontWeight="bold" fontSize="md" color="gray.800">Miscellaneous</Text>
                <Text fontSize="sm" color="gray.600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
                  massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                  sapien fringilla, mattis ligula consectetur, ultrices mauris.
                  Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
                </Text>
              </VStack>
            </VStack>
          </Box>
        )}

        {activeTab === "volunteers" && (
          <Box w="100%" bg="white" borderLeft="1px solid" borderRight="1px solid" borderBottom="1px solid" borderColor="gray.200" borderRadius="0 0 6px 6px" p={8}>
            <EventVolunteerList eventId={eventId} />
          </Box>
        )}

        {activeTab === "email" && (
          <Box w="100%" bg="white" borderLeft="1px solid" borderRight="1px solid" borderBottom="1px solid" borderColor="gray.200" borderRadius="0 0 6px 6px" p={8}>
            <EmailNotificationTimeline eventId={eventId} />
          </Box>
        )}
      </VStack>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(e) => { if (!e.open) setDeleteOpen(false); }}
        title="Delete Clinic Event"
        confirmLabel="Yes, Delete"
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </VStack>
  );
};
