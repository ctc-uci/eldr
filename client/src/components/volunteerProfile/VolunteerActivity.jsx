import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  NativeSelect,
  Table,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

const PAGE_SIZE = 5;

const toHours = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  if (Number.isNaN(diffMs) || diffMs <= 0) return 0;
  return Number((diffMs / (1000 * 60 * 60)).toFixed(2));
};

const formatDate = (dateLike) => {
  if (!dateLike) return "-";
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
};

export const VolunteerActivity = ({ volunteerId }) => {
  const { backend } = useBackendContext();
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadActivity = async () => {
      if (!volunteerId) {
        setLoading(false);
        setEvents([]);
        setLocations([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const clinicsResp = await backend.get("/clinics");
        const clinics = clinicsResp?.data ?? [];

        const registrationResults = await Promise.all(
          clinics.map(async (clinic) => {
            try {
              const registrationsResp = await backend.get(`/clinics/${clinic.id}/registrations`);
              const registrations = registrationsResp?.data ?? [];
              const registration = registrations.find((r) => r.id === volunteerId);
              if (!registration) return null;

              const hours = toHours(clinic.startTime, clinic.endTime);
              const endTime = new Date(clinic.endTime);
              const hasEnded = !Number.isNaN(endTime.getTime()) && endTime.getTime() < Date.now();

              return {
                id: clinic.id,
                name: clinic.name ?? `Clinic #${clinic.id}`,
                date: clinic.date ?? clinic.endTime ?? clinic.startTime,
                hours,
                type: "Clinic",
                hasAttended: Boolean(registration.hasAttended),
                hasEnded,
              };
            } catch {
              return null;
            }
          }),
        );

        const joinedEvents = registrationResults.filter(Boolean);
        setEvents(joinedEvents);

        try {
          const locationsResp = await backend.get(`/volunteers/${volunteerId}/locations`);
          const locationRows = locationsResp?.data ?? [];
          setLocations(
            locationRows.map((row) => {
              if (row.locationName) return row.locationName;
              const city = row.city ?? "";
              const state = row.state ?? "";
              const zip = row.zipCode ?? "";
              return [city, state, zip].filter(Boolean).join(", ");
            }),
          );
        } catch {
          setLocations([]);
        }
      } catch (e) {
        console.error("Failed to load volunteer activity", e);
        setError("Failed to load activity history.");
        setEvents([]);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [backend, volunteerId]);

  const pastRegisteredEvents = useMemo(() => {
    // TODO: Switch this to `event.hasAttended && event.hasEnded` once attendance
    // tracking is surfaced in the current profile/activity designs.
    return events.filter((event) => event.hasEnded);
  }, [events]);

  const totalHours = useMemo(() => {
    const sum = pastRegisteredEvents.reduce((acc, event) => acc + event.hours, 0);
    return Number(sum.toFixed(2));
  }, [pastRegisteredEvents]);

  const filteredSortedEvents = useMemo(() => {
    const filtered =
      typeFilter === "all"
        ? events
        : events.filter((event) => event.type.toLowerCase() === typeFilter);

    const sorted = [...filtered].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (sortBy === "oldest") return timeA - timeB;
      return timeB - timeA;
    });

    return sorted;
  }, [events, sortBy, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSortedEvents.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [sortBy, typeFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleEvents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSortedEvents.slice(start, start + PAGE_SIZE);
  }, [filteredSortedEvents, page]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }, [totalPages]);

  const renderHours = (value) => {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  };

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="#ECECEC"
      borderRadius="md"
      p={{ base: 5, md: 8 }}
    >
    <VStack gap={8} align="stretch">
      <Heading size="2xl" fontWeight="bold" color="gray.900">
        Activity History
      </Heading>

      <Flex gap={4} flexWrap="wrap">
        <Box
          flex="1"
          minW="200px"
          p={6}
          bg="white"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text fontSize="3xl" fontWeight="bold" color="gray.900">
            {loading ? "-" : renderHours(totalHours)}
          </Text>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Total Volunteer Hours
          </Text>
        </Box>
        <Box
          flex="1"
          minW="200px"
          p={6}
          bg="white"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text fontSize="3xl" fontWeight="bold" color="gray.900">
            {loading ? "-" : pastRegisteredEvents.length}
          </Text>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Total Event Count
          </Text>
        </Box>
      </Flex>

      <Box>
        <Text fontWeight="bold" fontSize="lg" mb={4}>
          Event Log
        </Text>
        <Flex gap={3} mt={6} mb={8} flexWrap="wrap" justifyContent="space-between">
          <NativeSelect.Root size="sm" maxW="180px">
            <NativeSelect.Field value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Events</option>
              <option value="clinic">Clinic</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <NativeSelect.Root size="sm" maxW="180px">
            <NativeSelect.Field value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>

        <Table.ScrollArea>
          <Table.Root size="sm" variant="line" borderWidth={1}>
            <Table.Header bg="blue.50">
              <Table.Row bg="blue.50" fontWeight="bold">
                <Table.ColumnHeader fontWeight="bold">Event</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Date</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Hours</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Type</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visibleEvents.map((ev) => (
                <Table.Row key={ev.id}>
                  <Table.Cell>{ev.name}</Table.Cell>
                  <Table.Cell>{formatDate(ev.date)}</Table.Cell>
                  <Table.Cell>{renderHours(ev.hours)}</Table.Cell>
                  <Table.Cell>{ev.type}</Table.Cell>
                </Table.Row>
              ))}
              {!loading && !error && visibleEvents.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <Text color="gray.500" fontSize="sm" py={2}>
                      No registered clinics found.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ) : null}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
        {error ? (
          <Text mt={3} color="red.600" fontSize="sm">
            {error}
          </Text>
        ) : null}

        <HStack justify="flex-end" mt={4} gap={1} flexWrap="wrap">
          <Button
            size="xs"
            variant="ghost"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            ‹
          </Button>
          {pageNumbers.map((n) => (
            <Button
              key={n}
              size="xs"
              minW="32px"
              variant={page === n ? "solid" : "ghost"}
              bg={page === n ? "gray.900" : undefined}
              color={page === n ? "white" : undefined}
              onClick={() => setPage(n)}
            >
              {n}
            </Button>
          ))}
          <Button
            size="xs"
            variant="ghost"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            ›
          </Button>
        </HStack>
      </Box>

      <Box>
        <Text fontWeight="bold" fontSize="lg" mb={3}>
          Locations
        </Text>
        <Flex
          flexWrap="wrap"
          gap={2}
          align="center"
          p={2}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="white"
          w="50%"
        >
          {locations.map((loc) => (
            <Tag.Root
              key={loc}
              size="md"
              bg="gray.150"
              color="gray.900"
            >
              <Tag.Label>{loc}</Tag.Label>
            </Tag.Root>
          ))}
          {!loading && locations.length === 0 ? (
            <Text color="gray.500" fontSize="sm">
              No saved locations.
            </Text>
          ) : null}
        </Flex>
      </Box>
    </VStack>
    </Box>
  );
};
