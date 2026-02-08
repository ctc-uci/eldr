import { Box, Flex, Table, Text } from "@chakra-ui/react";

interface VolunteerProfilesPanelProps {
  variant?: string;
}

export const VolunteerProfilesPanel = ({ variant = "list" }: VolunteerProfilesPanelProps) => {
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
              {Array.from({ length: 12 }).map((_, i) => (
                <Table.Row key={i}>
                  <Table.Cell>
                    <Flex align="center">
                      <Box w="28px" h="28px" borderWidth="1px" borderColor="gray.400" borderRadius="full" mr={3} />
                      <Text fontSize="sm" flex="1">[Username]</Text>
                      <Text fontSize="sm" color="gray.700">{i % 3 === 0 ? "Staff" : "Volunteer"}</Text>
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
                <Table.ColumnHeader fontSize="xs">Join Date</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs">Active Date</Table.ColumnHeader>
                <Table.ColumnHeader />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Array.from({ length: 11 }).map((_, i) => (
                <Table.Row key={i}>
                  <Table.Cell>
                    <Flex align="center" gap={3}>
                      <Box w="24px" h="24px" borderWidth="1px" borderColor="gray.400" borderRadius="full" />
                      <Text fontSize="sm">[Username]</Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell fontSize="sm">{i % 4 === 0 ? "Staff" : "Volunteer"}</Table.Cell>
                  <Table.Cell fontSize="sm">February 10, 2025</Table.Cell>
                  <Table.Cell fontSize="sm">-------------</Table.Cell>
                  <Table.Cell textAlign="right" fontSize="18px">🗑️</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
};
