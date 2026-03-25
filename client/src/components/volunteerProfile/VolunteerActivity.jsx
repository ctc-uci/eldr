import { useState } from "react";

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

const PLACEHOLDER_EVENTS = [
  { id: "1", name: "Event #1", date: "11/12/25", hours: 10, type: "Clinic" },
  { id: "2", name: "Event #2", date: "11/10/25", hours: 8, type: "Event" },
  { id: "3", name: "Event #3", date: "11/01/25", hours: 6, type: "Clinic" },
];

const PLACEHOLDER_LOCATIONS = ["Irvine, CA", "Orange, CA", "Anaheim, CA"];

export const VolunteerActivity = () => {
  const [locations, setLocations] = useState(PLACEHOLDER_LOCATIONS);
  const [locInput, setLocInput] = useState("");
  const [page, setPage] = useState(1);

  const addLocation = () => {
    const v = locInput.trim();
    if (!v || locations.includes(v)) return;
    setLocations((prev) => [...prev, v]);
    setLocInput("");
  };

  const removeLocation = (loc) => {
    setLocations((prev) => prev.filter((l) => l !== loc));
  };

  return (
    <VStack gap={8} align="stretch">
      <Heading size="md" fontWeight="bold" color="gray.900">
        Activity History
      </Heading>

      <Flex gap={4} flexWrap="wrap">
        <Box
          flex="1"
          minW="200px"
          p={6}
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Text fontSize="3xl" fontWeight="bold" color="gray.900">
            115
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
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Text fontSize="3xl" fontWeight="bold" color="gray.900">
            30
          </Text>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Total Event Count
          </Text>
        </Box>
      </Flex>

      <Box
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.100"
        p={{ base: 4, md: 6 }}
        boxShadow="sm"
      >
        <Text fontWeight="bold" fontSize="md" mb={4}>
          Event Log
        </Text>
        <Flex gap={3} mb={4} flexWrap="wrap">
          <NativeSelect.Root size="sm" maxW="180px">
            <NativeSelect.Field defaultValue="all">
              <option value="all">All Events</option>
              <option value="clinic">Clinic</option>
              <option value="event">Event</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <NativeSelect.Root size="sm" maxW="180px">
            <NativeSelect.Field defaultValue="recent">
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>

        <Table.ScrollArea>
          <Table.Root size="sm" variant="line">
            <Table.Header bg="blue.50">
              <Table.Row>
                <Table.ColumnHeader>Event</Table.ColumnHeader>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader>Hours</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {PLACEHOLDER_EVENTS.map((ev) => (
                <Table.Row key={ev.id}>
                  <Table.Cell>{ev.name}</Table.Cell>
                  <Table.Cell>{ev.date}</Table.Cell>
                  <Table.Cell>{ev.hours}</Table.Cell>
                  <Table.Cell>{ev.type}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <HStack justify="flex-end" mt={4} gap={1} flexWrap="wrap">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            ‹
          </Button>
          {[1, 2, 3].map((n) => (
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
          <Text fontSize="sm" px={1} color="gray.500">
            ...
          </Text>
          <Button
            size="xs"
            minW="32px"
            variant={page === 5 ? "solid" : "ghost"}
            bg={page === 5 ? "gray.900" : undefined}
            color={page === 5 ? "white" : undefined}
            onClick={() => setPage(5)}
          >
            5
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setPage((p) => p + 1)}
            aria-label="Next page"
          >
            ›
          </Button>
        </HStack>
      </Box>

      <Box
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.100"
        p={{ base: 4, md: 6 }}
        boxShadow="sm"
      >
        <Text fontWeight="bold" fontSize="md" mb={3}>
          Locations
        </Text>
        <Flex
          flexWrap="wrap"
          gap={2}
          align="center"
          minH="44px"
          p={2}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="gray.50"
        >
          {locations.map((loc) => (
            <Tag.Root
              key={loc}
              size="md"
              borderRadius="full"
              bg="gray.200"
              color="gray.900"
            >
              <Tag.Label>{loc}</Tag.Label>
              <Tag.CloseTrigger onClick={() => removeLocation(loc)} />
            </Tag.Root>
          ))}
          <Input
            flex="1"
            minW="140px"
            border="none"
            bg="transparent"
            _focus={{ boxShadow: "none" }}
            placeholder="Add tag..."
            value={locInput}
            onChange={(e) => setLocInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLocation();
              }
            }}
          />
        </Flex>
      </Box>
    </VStack>
  );
};
