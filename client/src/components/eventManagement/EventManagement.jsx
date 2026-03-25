import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Input,
  InputGroup,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { CiSearch } from "react-icons/ci";
import { LuArrowRight, LuCalendar, LuSlidersHorizontal } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { Sidebar } from "@/components/Sidebar";
import { CreateEvent } from "./createEvent";
import { NewCreatedEvent } from "./NewCreatedEvent";

const parseTimestamp = (str) => {
  if (!str) return null;
  // "2026-02-20 15:00:00+00" → "2026-02-20T15:00:00+00:00"
  const iso = str.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00");
  return new Date(iso);
};

const formatDate = (dateStr) => {
  const d = parseTimestamp(dateStr);
  if (!d || isNaN(d)) return "";
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
};

const formatTime = (dateStr) => {
  const d = parseTimestamp(dateStr);
  if (!d || isNaN(d)) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Determine event mode (In-Person / Hybrid / Online) from tags
const getEventMode = (tags = []) => {
  const tagNames = tags.map((t) => (t.tag || t.name || "").toLowerCase());
  if (tagNames.includes("hybrid")) return "Hybrid";
  if (tagNames.includes("online")) return "Online";
  return "In-Person";
};

// Build location string based on event mode
const renderLocation = (clinic) => {
  const mode = getEventMode(clinic.tags);
  const link = clinic.meetingLink;
  const inPersonAddress = [clinic.address, clinic.city, clinic.state, clinic.zip]
    .filter(Boolean)
    .join(", ");

  if (mode === "In-Person") return inPersonAddress;
  if (mode === "Online") return link || "";
  if (mode === "Hybrid") return [inPersonAddress, link].filter(Boolean).join(" | ");
  return inPersonAddress;
};

export const EventManagement = () => {
  const { backend } = useBackendContext();
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [view, setView] = useState("list"); // "list" | "create" | "created"
  const [createdEventData, setCreatedEventData] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await backend.get(`/clinics`);
      const clinicsData = response.data;

      const clinicsWithTags = await Promise.all(
        clinicsData.map(async (clinic) => {
          try {
            const tagsRes = await backend.get(`/clinics/${clinic.id}/tags`);
            return { ...clinic, tags: tagsRes.data };
          } catch {
            return { ...clinic, tags: [] };
          }
        })
      );

      setClinics(clinicsWithTags);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1">
        {view === "list" && (
          <VStack
            w="100%"
            minH="100vh"
            bg="#F5F5F5"
            p={6}
            gap={5}
          >
            {/* Top bar */}
            <Flex
              w="100%"
              align="center"
              gap={4}
            >
              <Button
                bg="#2D3748"
                color="white"
                borderRadius="md"
                px={5}
                _hover={{ bg: "#1A202C" }}
              >
                <LuSlidersHorizontal />
                Filter &amp; Sort
              </Button>

              <InputGroup
                flex={1}
                bg="white"
                borderRadius="md"
                startElement={
                  <CiSearch
                    color="gray"
                    size="20"
                  />
                }
              >
                <Input
                  placeholder="Search for a case..."
                  borderRadius="md"
                  border="1px solid #E2E8F0"
                />
              </InputGroup>

              <Button
                bg="#2B6CB0"
                color="white"
                borderRadius="md"
                px={5}
                _hover={{ bg: "#2C5282" }}
                onClick={() => setView("create")}
              >
                <LuCalendar />
                Create New Event
                <LuArrowRight />
              </Button>
            </Flex>

            {/* Event cards */}
            <VStack
              w="100%"
              gap={4}
            >
              {clinics.map((clinic) => {
                const mode = getEventMode(clinic.tags);
                const locationStr = renderLocation(clinic);
                const otherTags = clinic.tags?.filter((t) => {
                  const name = (t.tag || t.name || "").toLowerCase();
                  return !["hybrid", "online", "in-person"].includes(name);
                });

                return (
                  <Card.Root
                    key={clinic.id}
                    w="100%"
                    borderRadius="lg"
                    border="1px solid #E2E8F0"
                    bg="white"
                    shadow="none"
                    cursor="pointer"
                    _hover={{ shadow: "sm" }}
                    onClick={() => navigate(`/events/${clinic.id}`)}
                  >
                    <Card.Body
                      px={6}
                      py={4}
                    >
                      <VStack
                        align="start"
                        gap={2}
                      >
                        {/* Date/time row */}
                        <Flex
                          w="100%"
                          justify="space-between"
                          align="center"
                        >
                          <Text
                            fontSize="sm"
                            color="gray.500"
                          >
                            {formatDate(clinic.date)} • {formatTime(clinic.startTime)} -{" "}
                            {formatTime(clinic.endTime)}
                          </Text>
                          {(() => {
                            const registered = clinic.attendees ?? 0;
                            const min = clinic.minAttendees ?? 0;
                            const max = clinic.capacity ?? 0;
                            const inRange = registered >= min && registered <= max;
                            const dotColor = inRange ? "green.400" : "red.400";
                            return (
                              <HStack gap={1}>
                                <Box
                                  w="10px"
                                  h="10px"
                                  borderRadius="full"
                                  bg={dotColor}
                                  flexShrink={0}
                                />
                                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                  <Text as="span" color={inRange ? "green.600" : "red.600"} fontWeight="bold">
                                    {registered}
                                  </Text>
                                  {" Registered / "}
                                  <Text as="span" color={registered < min ? "red.600" : "gray.600"} fontWeight="bold">
                                    {min}
                                  </Text>
                                  {" Minimum / "}
                                  <Text as="span" color={registered >= max ? "red.600" : "gray.600"} fontWeight="bold">
                                    {max}
                                  </Text>
                                  {" Maximum"}
                                </Text>
                              </HStack>
                            );
                          })()}
                        </Flex>

                        {/* Title */}
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                        >
                          {clinic.name}
                        </Text>

                        {/* Location */}
                        {locationStr && (
                          <Text
                            fontSize="sm"
                            color="gray.600"
                          >
                            {locationStr}
                          </Text>
                        )}

                        {/* Tags */}
                        <HStack
                          gap={2}
                          mt={1}
                        >
                          {/* Always show Clinic Type tag */}
                          <Tag.Root
                            size="md"
                            borderRadius="md"
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
                              Clinic Type
                            </Tag.Label>
                          </Tag.Root>

                          {/* Show event mode tag (In-Person / Hybrid / Online) */}
                          <Tag.Root
                            size="md"
                            borderRadius="md"
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
                              {mode}
                            </Tag.Label>
                          </Tag.Root>

                          {/* Remaining tags (e.g. Language) */}
                          {otherTags?.map((t) => (
                            <Tag.Root
                              key={t.id}
                              size="md"
                              borderRadius="md"
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
                                {t.tag}
                              </Tag.Label>
                            </Tag.Root>
                          ))}
                        </HStack>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                );
              })}
            </VStack>
          </VStack>
        )}

        {view === "create" && (
          <CreateEvent
            onClose={() => setView("list")}
            onCreated={(data) => {
              setCreatedEventData(data);
              setView("created");
            }}
          />
        )}

        {view === "created" && (
          <NewCreatedEvent
            eventData={createdEventData}
            onClose={() => setView("list")}
          />
        )}
      </Box>
    </Flex>
  );
};