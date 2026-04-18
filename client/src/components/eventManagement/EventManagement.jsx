import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ConfirmDialog } from "./ConfirmDialog";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { CiSearch } from "react-icons/ci";
import { LuArrowRight, LuCalendar, LuPencil, LuSlidersHorizontal, LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

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
    timeZone: "UTC",
  });
};

const capitalizeLocationType = (str) => {
  if (!str) return "";
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
};

// Build location string based on locationType field
const renderLocation = (clinic) => {
  const mode = (clinic.locationType || "").toLowerCase();
  const link = clinic.meetingLink;
  const inPersonAddress = [
    clinic.address,
    clinic.city,
    clinic.state,
    clinic.zip,
  ]
    .filter(Boolean)
    .join(", ");

  if (mode === "online") return link || "";
  if (mode === "hybrid")
    return [inPersonAddress, link].filter(Boolean).join(" | ");
  return inPersonAddress;
};

export const EventManagement = () => {
  const { backend } = useBackendContext();
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteClick = (e, clinicId) => {
    e.stopPropagation();
    setDeleteTarget(clinicId);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await backend.delete(`/clinics/${deleteTarget}`);
      setClinics((prev) => prev.filter((c) => c.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await backend.get(`/clinics`);
        const clinicsData = response.data;

        const clinicsWithLanguages = await Promise.all(
          clinicsData.map(async (clinic) => {
            try {
              const langRes = await backend.get(
                `/clinics/${clinic.id}/languages`
              );
              return { ...clinic, languages: langRes.data };
            } catch {
              return { ...clinic, languages: [] };
            }
          })
        );

        setClinics(clinicsWithLanguages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, [backend]);

  return (
    <Flex
      minH="100vh"
      flex="1"
      direction="column"
    >
      <Box flex="1">
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
              onClick={() => navigate("/events/create/header")}
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
              const locationStr = renderLocation(clinic);

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
                          {formatDate(clinic.date)} •{" "}
                          {formatTime(clinic.startTime)} -{" "}
                          {formatTime(clinic.endTime)}
                        </Text>
                        {(() => {
                          const registered = clinic.attendees ?? 0;
                          const min = clinic.minAttendees ?? 0;
                          const max = clinic.capacity ?? 0;
                          const inRange =
                            registered >= min && registered <= max;
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
                              <Text
                                fontSize="sm"
                                color="gray.600"
                                fontWeight="medium"
                              >
                                <Text
                                  as="span"
                                  fontWeight="bold"
                                >
                                  {registered}
                                </Text>
                                {" Registered / "}
                                <Text
                                  as="span"
                                  fontWeight="bold"
                                >
                                  {min}
                                </Text>
                                {" Minimum / "}
                                <Text
                                  as="span"
                                  fontWeight="bold"
                                >
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

                      {/* Tags + action icons row */}
                      <Flex
                        w="100%"
                        justify="space-between"
                        align="center"
                        mt={1}
                      >
                        <HStack gap={2}>
                          {/* Clinic type */}
                          {clinic.type && (
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
                                {clinic.type}
                              </Tag.Label>
                            </Tag.Root>
                          )}

                          {/* Location type */}
                          {clinic.locationType && (
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
                                {capitalizeLocationType(clinic.locationType)}
                              </Tag.Label>
                            </Tag.Root>
                          )}

                          {/* Language tags */}
                          {(clinic.languages ?? []).map((l) => (
                            <Tag.Root
                              key={l.id}
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
                                {l.language}
                              </Tag.Label>
                            </Tag.Root>
                          ))}
                        </HStack>

                        {/* Edit / Delete icons */}
                        <HStack gap={1}>
                          <IconButton
                            aria-label="Edit event"
                            variant="ghost"
                            size="sm"
                            color="gray.500"
                            _hover={{ color: "blue.500", bg: "blue.50" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/events/${clinic.id}/edit/header`);
                            }}
                          >
                            <LuPencil />
                          </IconButton>
                          <IconButton
                            aria-label="Delete event"
                            variant="ghost"
                            size="sm"
                            color="gray.500"
                            _hover={{ color: "red.500", bg: "red.50" }}
                            onClick={(e) => handleDeleteClick(e, clinic.id)}
                          >
                            <LuTrash2 />
                          </IconButton>
                        </HStack>
                      </Flex>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              );
            })}
          </VStack>
        </VStack>
      </Box>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(e) => { if (!e.open) setDeleteTarget(null); }}
        title="Delete Clinic Event"
        confirmLabel="Yes, Delete"
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </Flex>
  );
};
