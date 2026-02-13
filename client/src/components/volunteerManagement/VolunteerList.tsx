import { useEffect, useState } from "react";

import { Steps, Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { Volunteer } from "@/types/volunteer";

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
          <Table.Root size="md">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader fontSize="xs">Name</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {volunteers.map((volunteer) => (
                <Table.Row
                  key={volunteer.id}
                  onClick={() => onSelect?.(volunteer)}
                  bg={selectedId === volunteer.id ? "blue.50" : undefined}
                  _hover={{
                    bg: selectedId === volunteer.id ? "blue.100" : "gray.50",
                    cursor: "pointer",
                  }}
                >
                  <Table.Cell>
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
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
      {variant === "table" && (
        <Box mt={4} borderWidth="1px" borderColor="gray.200">
          <Table.Root size="md">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader fontSize="xs">Name</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs">Role</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs">Email</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs">Active Date</Table.ColumnHeader>
                <Table.ColumnHeader />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {volunteers.map((volunteer) => (
                <Table.Row
                  key={volunteer.id}
                  onClick={() => onSelect?.(volunteer)}
                  bg={selectedId === volunteer.id ? "blue.50" : undefined}
                  _hover={{
                    bg: selectedId === volunteer.id ? "blue.100" : "gray.50",
                    cursor: "pointer",
                  }}
                >
                  <Table.Cell>
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
                  </Table.Cell>
                  <Table.Cell fontSize="sm">Volunteer</Table.Cell>
                  <Table.Cell fontSize="sm">{volunteer.email}</Table.Cell>
                  <Table.Cell fontSize="sm">-------------</Table.Cell>
                  <Table.Cell
                    textAlign="right"
                    fontSize="18px"
                    onClick={(e) => handleDelete(e, volunteer.id)}
                    _hover={{ opacity: 0.7, cursor: "pointer" }}
                  >
                    🗑️
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
};
