import { useEffect, useState } from "react";
import { Box, Button, Flex, HStack, IconButton, Separator, Tag, Text, VStack } from "@chakra-ui/react";

import {
  LuArrowUpFromLine,
  LuArchive,
  LuCalendar,
  LuClock,
  LuMail,
  LuMapPin,
  LuPencil,
  LuUsers,
} from "react-icons/lu";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

export const CreatedEvent = () => {
  const { eventId } = useParams();
  const { state: locationState } = useLocation();
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [eventData, setEventData] = useState(locationState?.eventData ?? null);

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

  const [activeTab, setActiveTab] = useState("details");

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
          color="gray.700"
        >
          Event Catalog
        </Text>
        <Text color="gray.400">›</Text>
        <Text
          color="blue.500"
          cursor="pointer"
          onClick={() => navigate("/events")}
        >
          View Event
        </Text>
      </HStack>

      {/* Header row */}
      <Flex
        w="100%"
        justify="space-between"
        align="start"
        gap={8}
      >
        <VStack
          align="start"
          gap={3}
          flex={1}
        >
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color="#1A202C"
          >
            {name}
          </Text>

          <HStack
            gap={6}
            color="gray.700"
            fontSize="sm"
          >
            <HStack
              gap={2}
            >
              <LuCalendar />
              <Text>{formattedDate}</Text>
            </HStack>
            <HStack
              gap={2}
            >
              <LuClock />
              <Text>{formattedTime}</Text>
            </HStack>
          </HStack>
          <Separator />

          <HStack
            gap={2}
            color="gray.700"
            fontSize="sm"
            w="100%"
          >
            <HStack
              gap={2}
            >
              <LuMapPin />
              <Text>{locationStr}</Text>
            </HStack>
          </HStack>
          <Separator />

          <HStack
            gap={2}
            color="gray.700"
            fontSize="sm"
          >
            <Box
              w="8px"
              h="8px"
              borderRadius="full"
              bg="red.500"
            />
            <Text>
              <Text as="span" fontWeight="semibold">{attendees}</Text>
              {" Registered  /  "}
              <Text as="span" fontWeight="semibold">50</Text>
              {" Minimum  /  "}
              <Text as="span" fontWeight="semibold">{capacity}</Text>
              {" Maximum"}
            </Text>
          </HStack>
          <Separator />

          <HStack
            gap={2}
            mt={1}
            flexWrap="wrap"
          >
            {[type, capitalizeLocationType(locationType), ...languages.map((l) => (typeof l === "string" ? l : l.language))]
              .filter(Boolean)
              .map((tag) => (
                <Tag.Root
                  key={tag}
                  size="md"
                  borderRadius="md"
                  border="0.5px solid"
                  borderColor="gray.200"
                  bg="gray.100"
                  px={2}
                  py={1}
                >
                  <Tag.Label
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    {tag}
                  </Tag.Label>
                </Tag.Root>
              ))}
          </HStack>
        </VStack>

        {/* Action buttons */}
        <HStack
          gap={2}
          align="start"
        >
          <IconButton
            aria-label="Share event"
            variant="outline"
            borderColor="#E2E8F0"
            bg="white"
            color="gray.600"
            size="md"
          >
            <LuArrowUpFromLine />
          </IconButton>
          <Button
            variant="outline"
            border="1px solid #E2E8F0"
            bg="white"
            color="#B83232"
            borderRadius="md"
            justifyContent="flex-start"
            gap={3}
            px={4}
            _hover={{ bg: "red.50", borderColor: "red.200" }}
            onClick={async () => {
              try {
                await backend.delete(`/clinics/${eventId}`);
                navigate("/events");
              } catch (err) {
                console.error(err);
              }
            }}
          >
            <LuArchive />
            Delete Event
          </Button>
          <Button
            bg="#4A7FA5"
            color="white"
            borderRadius="md"
            justifyContent="flex-start"
            gap={3}
            px={4}
            _hover={{ bg: "#2C5282" }}
            onClick={() => navigate(`/events/${eventId}/edit/header`)}
          >
            <LuPencil />
            Edit Event
          </Button>
        </HStack>
      </Flex>

      {/* Tabs */}
      <HStack
        gap={1}
        borderBottom="1px solid #E2E8F0"
        w="100%"
        align="end"
      >
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant="ghost"
            borderRadius="8px 8px 0 0"
            borderTop={activeTab === tab.key ? "1px solid #E2E8F0" : "1px solid transparent"}
            borderLeft={activeTab === tab.key ? "1px solid #E2E8F0" : "1px solid transparent"}
            borderRight={activeTab === tab.key ? "1px solid #E2E8F0" : "1px solid transparent"}
            borderBottom="1px solid transparent"
            mb="-1px"
            color={activeTab === tab.key ? "#2D3748" : "gray.600"}
            bg={activeTab === tab.key ? "white" : "transparent"}
            fontWeight={activeTab === tab.key ? "medium" : "normal"}
            px={{ base: 3, md: 4 }}
            py={{ base: 2, md: 2.5 }}
            fontSize={{ base: "xs", md: "sm" }}
            onClick={() => setActiveTab(tab.key)}
            _hover={{ bg: activeTab === tab.key ? "white" : "gray.50" }}
            _focusVisible={{ outline: "none", boxShadow: "none" }}
          >
            <LuMail size={16} />
            {tab.label}
          </Button>
        ))}
      </HStack>

      <Box
        w="100%"
        pt={6}
      >
        {activeTab === "details" && (
          <VStack
            align="start"
            gap={6}
          >
            <VStack
              align="start"
              gap={2}
            >
              <Text
                fontWeight="bold"
                fontSize="md"
                color="gray.800"
              >
                Description
              </Text>
              <Text
                fontSize="sm"
                color="gray.600"
                whiteSpace="pre-line"
              >
                {eventData?.description || "No description provided."}
              </Text>
            </VStack>

            <VStack
              align="start"
              gap={2}
            >
              <Text
                fontWeight="bold"
                fontSize="md"
                color="gray.800"
              >
                Images
              </Text>
              <Text
                fontSize="sm"
                color="gray.600"
              >
                *insert images here*
              </Text>
            </VStack>
          </VStack>
        )}

        {activeTab !== "details" && (
          <Flex
            w="100%"
            minH="180px"
            align="center"
            justify="center"
          >
            <Text
              color="gray.400"
              fontSize="sm"
            >
              {tabs.find((t) => t.key === activeTab)?.label}
            </Text>
          </Flex>
        )}
      </Box>
    </VStack>
  );
};
