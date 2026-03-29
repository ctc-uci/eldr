import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { Box, Button, Checkbox, Flex, Table, Text } from "@chakra-ui/react";
import { LuChevronsUpDown, LuChevronLeft, LuChevronRight } from "react-icons/lu";

const PAGE_SIZE = 8;

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { Volunteer } from "@/types/volunteer";

interface VolunteerListProps {
  variant?: "list" | "table";
  onSelect?: (volunteer: Volunteer) => void;
  selectedId?: number;
  refreshId?: number;
  volunteers: Volunteer[];
  setVolunteers: Dispatch<SetStateAction<Volunteer[]>>;
}

export const VolunteerList = ({
  variant = "list",
  onSelect,
  selectedId,
  refreshId = 0,
  volunteers,
  setVolunteers,
}: VolunteerListProps) => {
  const { backend } = useBackendContext();
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      const res = await backend.get<Volunteer[]>("/volunteers");
      setVolunteers(res.data);
    })();
  }, [backend, refreshId, setVolunteers]);

  const toggleCheck = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const SortHeader = ({ label }: { label: string }) => (
    <Flex align="center" gap={1}>
      {label}
      <LuChevronsUpDown size={12} />
    </Flex>
  );

  return (
    <Box>
      {variant === "list" && (
        <Box mt={4} borderWidth="1px" borderColor="gray.200">
          <Table.Root size="md">
            <Table.Header>
              <Table.Row bg="#EFF6FF">
                <Table.ColumnHeader fontSize="xs"><SortHeader label="Name" /></Table.ColumnHeader>
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
                        w="32px"
                        h="32px"
                        borderRadius="full"
                        bg="gray.200"
                        mr={3}
                        flexShrink={0}
                      />
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold">
                          {volunteer.firstName} {volunteer.lastName}
                        </Text>
                        <Text fontSize="xs" color="gray.500">{volunteer.email}</Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      {variant === "table" && (
        <Box mt={4} overflow="hidden">
          <Table.Root size="md">
            <Table.Header>
              <Table.Row bg="#EFF6FF">
                <Table.ColumnHeader w="40px">
                  <Checkbox.Root size="sm">
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Name" />
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Role" />
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Interests" />
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Most Recent Event" />
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  Preference
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {volunteers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((volunteer) => (
                <Table.Row
                  key={volunteer.id}
                  onClick={() => onSelect?.(volunteer)}
                  bg={selectedId === volunteer.id ? "blue.50" : checkedIds.has(volunteer.id) ? "blue.50" : undefined}
                  _hover={{
                    bg: selectedId === volunteer.id ? "blue.100" : "gray.50",
                    cursor: "pointer",
                  }}
                >
                  <Table.Cell onClick={(e) => toggleCheck(e, volunteer.id)}>
                    <Checkbox.Root
                      size="sm"
                      checked={checkedIds.has(volunteer.id)}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap={3}>
                      <Box
                        w="36px"
                        h="36px"
                        borderRadius="full"
                        bg="gray.200"
                        flexShrink={0}
                      />
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold">
                          {volunteer.firstName} {volunteer.lastName}
                        </Text>
                        <Text fontSize="xs" color="gray.500">{volunteer.email}</Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" fontWeight="semibold">{volunteer.role ?? "—"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.600">
                      {volunteer.specializations?.join(", ") ?? "—"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.600">—</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.600">—</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          {volunteers.length > PAGE_SIZE && (
            <Flex align="center" justify="space-between" px={4} py={3} borderTopWidth="1px" borderTopColor="gray.100">
              <Text fontSize="sm" color="gray.600">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, volunteers.length)} of {volunteers.length}
              </Text>
              <Flex>
                <Button
                  size="sm"
                  variant="ghost"
                  borderRadius="none"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  border="1px solid #E4E4E7"
                  _hover={{ bg: "gray.100" }}
                  p={0}
                >
                  <LuChevronLeft />
                </Button>
                {Array.from({ length: Math.ceil(volunteers.length / PAGE_SIZE) }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    borderRadius="none"
                    border="1px solid #E4E4E7"
                    variant={p === page ? "solid" : "ghost"}
                    bg={p === page ? "black" : undefined}
                    color={p === page ? "white" : undefined}
                    _hover={p === page ? { bg: "black" } : undefined}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  borderRadius="none"
                  disabled={page === Math.ceil(volunteers.length / PAGE_SIZE)}
                  onClick={() => setPage((p) => p + 1)}
                  border="1px solid #E4E4E7"
                  _hover={{ bg: "gray.100" }}
                  p={0}
                >
                  <LuChevronRight />
                </Button>
              </Flex>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};
