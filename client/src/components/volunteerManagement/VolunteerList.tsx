import { useEffect, useState } from "react";

import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

export type Volunteer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  specializations?: string[];
  languages?: string[];
};

interface VolunteerListProps {
  variant?: "list" | "table";
  onSelect?: (volunteer: Volunteer) => void;
  selectedId?: number;
  refreshId?: number;
}

export const VolunteerList = ({
  variant = "list",
  onSelect,
  selectedId,
  refreshId = 0,
}: VolunteerListProps) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const { backend } = useBackendContext();

  useEffect(() => {
    (async () => {
      const res = await backend.get<Volunteer[]>("/volunteers");
      setVolunteers(res.data);
    })();
  }, [backend, refreshId]);

  const handleDelete = async (e: React.MouseEvent, volunteerId: number) => {
    e.stopPropagation();

    await backend.delete(`/volunteers/${volunteerId}`);

    setVolunteers((prev) => prev.filter((v) => v.id !== volunteerId));
  };

  return (
    <Box>
      {variant === "list" && (
        <Box mt={4} borderWidth="1px" borderColor="gray.200">
          <Table size="md">
            <Thead>
              <Tr>
                <Th fontSize="xs">Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {volunteers.map((volunteer) => (
                <Tr
                  key={volunteer.id}
                  onClick={() => onSelect?.(volunteer)}
                  bg={selectedId === volunteer.id ? "blue.50" : undefined}
                  _hover={{
                    bg: selectedId === volunteer.id ? "blue.100" : "gray.50",
                    cursor: "pointer",
                  }}
                >
                  <Td>
                    <Flex align="center">
                      <Box
                        w="28px"
                        h="28px"
                        borderWidth="1px"
                        borderColor="gray.400"
                        borderRadius="full"
                        mr={3}
                      />
                      <Text fontSize="sm" flex="1">
                        {volunteer.firstName} {volunteer.lastName}
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        Volunteer
                      </Text>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {variant === "table" && (
        <Box mt={4} borderWidth="1px" borderColor="gray.200">
          <Table size="md">
            <Thead>
              <Tr>
                <Th fontSize="xs">Name</Th>
                <Th fontSize="xs">Role</Th>
                <Th fontSize="xs">Email</Th>
                <Th fontSize="xs">Active Date</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {volunteers.map((volunteer) => (
                <Tr
                  key={volunteer.id}
                  onClick={() => onSelect?.(volunteer)}
                  bg={selectedId === volunteer.id ? "blue.50" : undefined}
                  _hover={{
                    bg: selectedId === volunteer.id ? "blue.100" : "gray.50",
                    cursor: "pointer",
                  }}
                >
                  <Td>
                    <Flex align="center" gap={3}>
                      <Box
                        w="24px"
                        h="24px"
                        borderWidth="1px"
                        borderColor="gray.400"
                        borderRadius="full"
                      />
                      <Text fontSize="sm">
                        {volunteer.firstName} {volunteer.lastName}
                      </Text>
                    </Flex>
                  </Td>
                  <Td fontSize="sm">Volunteer</Td>
                  <Td fontSize="sm">{volunteer.email}</Td>
                  <Td fontSize="sm">-------------</Td>
                  <Td
                    textAlign="right"
                    fontSize="18px"
                    onClick={(e) => handleDelete(e, volunteer.id)}
                    _hover={{ opacity: 0.7, cursor: "pointer" }}
                  >
                    🗑️
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};
