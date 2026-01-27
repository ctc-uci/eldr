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

interface VolunteerProfilesPanelProps {
  variant?: "list" | "table";
}

export const VolunteerProfilesPanel = ({
  variant = "list",
}: VolunteerProfilesPanelProps) => {
  type Volunteer = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const { backend } = useBackendContext();

  useEffect(() => {
    (async () => {
      const res = await backend.get<Volunteer[]>("/volunteers");
      setVolunteers(res.data);
    })();
  }, [backend]);

  return (
    <Box>
      {variant === "list" && (
        <Box
          mt={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Table size="md">
            <Thead>
              <Tr>
                <Th fontSize="xs">Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {volunteers.map((volunteer) => (
                <Tr key={volunteer.id}>
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
                      <Text
                        fontSize="sm"
                        flex="1"
                      >
                        {volunteer.firstName} {volunteer.lastName}
                      </Text>
                      <Text
                        fontSize="sm"
                        color="gray.700"
                      >
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
        <Box
          mt={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
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
                <Tr key={volunteer.id}>
                  <Td>
                    <Flex
                      align="center"
                      gap={3}
                    >
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
