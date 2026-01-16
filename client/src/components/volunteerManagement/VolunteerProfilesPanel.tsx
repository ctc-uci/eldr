import {
  Box,
  Flex,
  Text,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

interface VolunteerProfilesPanelProps {
  variant?: string;
}

export const VolunteerProfilesPanel = ({ variant = "list" }: VolunteerProfilesPanelProps) => {
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
              {Array.from({ length: 12 }).map((_, i) => (
                <Tr key={i}>
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
                        [Username]
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        {i % 3 === 0 ? "Staff" : "Volunteer"}
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
                <Th fontSize="xs">Join Date</Th>
                <Th fontSize="xs">Active Date</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {Array.from({ length: 11 }).map((_, i) => (
                <Tr key={i}>
                  <Td>
                    <Flex align="center" gap={3}>
                      <Box
                        w="24px"
                        h="24px"
                        borderWidth="1px"
                        borderColor="gray.400"
                        borderRadius="full"
                      />
                      <Text fontSize="sm">[Username]</Text>
                    </Flex>
                  </Td>
                  <Td fontSize="sm">{i % 4 === 0 ? "Staff" : "Volunteer"}</Td>
                  <Td fontSize="sm">February 10, 2025</Td>
                  <Td fontSize="sm">-------------</Td>
                  <Td textAlign="right" fontSize="18px">
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
}
