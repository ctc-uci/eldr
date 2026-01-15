import React from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
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
  showAdd?: boolean;
  onAdd?: () => void;
}

export const VolunteerProfilesPanel = ({ variant = "list", showAdd, onAdd }: VolunteerProfilesPanelProps) => {
  return (
    <Box>
      <Heading size="sm" mb={2}>
        Profile List
      </Heading>

      {/* Search row */}
      <Flex gap={2} align="center">
        <Flex
          align="center"
          borderWidth="1px"
          borderColor="gray.300"
          borderRadius="md"
          px={2}
          w="100%"
          h="40px"
        >
          <Box
            w="14px"
            h="14px"
            borderWidth="1px"
            borderColor="gray.600"
            borderRadius="sm"
            mr={2}
          />
          <Input
            variant="unstyled"
            placeholder=""
            fontSize="sm"
          />
        </Flex>

        <Button size="sm" variant="outline">
          Filters
        </Button>

        {showAdd && (
          <Button size="sm" variant="outline" onClick={onAdd}>
            Add Profile
          </Button>
        )}
      </Flex>

      {variant === "list" && (
        <Box mt={4}>
          <Text fontSize="xs" color="gray.600" mb={2}>
            Name
          </Text>

          <Box borderWidth="1px" borderColor="gray.200">
            {Array.from({ length: 12 }).map((_, i) => (
              <Box key={i}>
                <Flex px={3} py={3} align="center">
                  <Box
                    w="28px"
                    h="28px"
                    borderWidth="1px"
                    borderColor="gray.400"
                    borderRadius="full"
                    mr={3}
                  />
                  <Text fontSize="sm" fontWeight="600" flex="1">
                    [Username]
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    {i % 3 === 0 ? "Staff" : "Volunteer"}
                  </Text>
                </Flex>
                {i !== 11 && <Divider />}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {variant === "table" && (
        <Box mt={4} borderWidth="1px" borderColor="gray.200">
          <Table size="sm">
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
