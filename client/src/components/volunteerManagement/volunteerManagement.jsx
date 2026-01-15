import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Stack,
  Badge,
} from "@chakra-ui/react";

import VolunteerHeader from "./VolunteerHeader";
import VolunteerFilters from "./volunteerFilters";

const mockVolunteers = [
  {
    id: "1",
    name: "Alyssa Chen",
    email: "alyssa@uci.edu",
    status: "Active",
    hours: 24,
    lastActive: "2026-01-10",
  },
  {
    id: "2",
    name: "Jordan Park",
    email: "jpark@uci.edu",
    status: "Inactive",
    hours: 6,
    lastActive: "2025-12-22",
  },
];

export default function VolunteerManagement() {
  const newModal = useDisclosure();
  const drawer = useDisclosure();

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filteredVolunteers = useMemo(() => {
    return mockVolunteers.filter((v) => {
      const matchesQuery =
        v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.email.toLowerCase().includes(query.toLowerCase());

      const matchesStatus = status === "All" ? true : v.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  function openVolunteer(volunteer) {
    setSelectedVolunteer(volunteer);
    drawer.onOpen();
  }

  return (
    <Box p={6}>
      <Flex align="center" mb={4}>
        <Heading size="lg">Volunteer Management</Heading>
        <Spacer />
        <Button colorScheme="blue" onClick={newModal.onOpen}>
          New Volunteer
        </Button>
      </Flex>

      <VolunteerHeader />

      <Box mt={4}>
        <VolunteerFilters
          query={query}
          setQuery={setQuery}
          status={status}
          setStatus={setStatus}
        />
      </Box>

      <Box mt={4} borderWidth="1px" borderRadius="md">
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th isNumeric>Hours</Th>
              <Th>Last Active</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredVolunteers.map((v) => (
              <Tr
                key={v.id}
                _hover={{ bg: "gray.50", cursor: "pointer" }}
                onClick={() => openVolunteer(v)}
              >
                <Td>{v.name}</Td>
                <Td>{v.email}</Td>
                <Td>{v.status}</Td>
                <Td isNumeric>{v.hours}</Td>
                <Td>{v.lastActive}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* New Volunteer Modal */}
      <Modal isOpen={newModal.isOpen} onClose={newModal.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Volunteer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input placeholder="Name" />
              <Input placeholder="Email" />
              <Input placeholder="Status" />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={newModal.onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={newModal.onClose}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Expanded Volunteer Drawer */}
      <Drawer isOpen={drawer.isOpen} placement="right" onClose={drawer.onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Volunteer Details</DrawerHeader>
          <DrawerBody>
            {selectedVolunteer && (
              <Stack spacing={3}>
                <Heading size="md">{selectedVolunteer.name}</Heading>
                <Box>{selectedVolunteer.email}</Box>
                <Badge>{selectedVolunteer.status}</Badge>
                <Box>Hours: {selectedVolunteer.hours}</Box>
              </Stack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
