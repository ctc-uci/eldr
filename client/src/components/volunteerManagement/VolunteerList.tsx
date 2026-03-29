import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { Box, Button, Checkbox, Flex, Table, Text } from "@chakra-ui/react";
import { LuChevronsUpDown, LuChevronLeft, LuChevronRight, LuChevronUp, LuChevronDown } from "react-icons/lu";

const PAGE_SIZE = 8;

type PageItem = number | { type: "ellipsis"; target: number };

const WINDOW = 3;

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);

  // Near start: [1, 2, 3, ..., N]
  if (page <= WINDOW) {
    const pages: PageItem[] = Array.from({ length: WINDOW }, (_, i) => i + 1);
    pages.push({ type: "ellipsis", target: WINDOW + 1 });
    pages.push(totalPages);
    return pages;
  }

  // Near end: [1, ..., N-2, N-1, N]
  if (page >= totalPages - WINDOW + 1) {
    const pages: PageItem[] = [1, { type: "ellipsis", target: Math.max(1, totalPages - 2 * WINDOW) }];
    for (let i = totalPages - WINDOW + 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  // Middle: [1, ..., page, ..., N]
  return [1, { type: "ellipsis", target: page - WINDOW }, page, { type: "ellipsis", target: page + WINDOW }, totalPages];
}

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { Volunteer } from "@/types/volunteer";

interface VolunteerListProps {
  variant?: "list" | "table";
  onSelect?: (volunteer: Volunteer) => void;
  selectedId?: number;
  refreshId?: number;
  volunteers: Volunteer[];
  setVolunteers: Dispatch<SetStateAction<Volunteer[]>>;
  checkedIds: Set<number>;
  setCheckedIds: Dispatch<SetStateAction<Set<number>>>;
}

export const VolunteerList = ({
  variant = "list",
  onSelect,
  selectedId,
  refreshId = 0,
  volunteers,
  setVolunteers,
  checkedIds,
  setCheckedIds,
}: VolunteerListProps) => {
  const { backend } = useBackendContext();
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Volunteer | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: keyof Volunteer) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const sortedVolunteers = sortKey
    ? [...volunteers].sort((a, b) => {
        const av = (a[sortKey] ?? "") as string;
        const bv = (b[sortKey] ?? "") as string;
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : volunteers;

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

  const SortHeader = ({ label, sortField }: { label: string; sortField?: keyof Volunteer }) => {
    const active = sortField && sortKey === sortField;
    return (
      <Flex
        align="center"
        gap={1}
        cursor={sortField ? "pointer" : undefined}
        userSelect="none"
        onClick={sortField ? () => handleSort(sortField) : undefined}
      >
        {label}
        {active ? (sortDir === "asc" ? <LuChevronUp size={12} /> : <LuChevronDown size={12} />) : <LuChevronsUpDown size={12} />}
      </Flex>
    );
  };

  return (
    <Box>
      {variant === "list" && (
        <Box mt={4}>
          <Table.Root size="md">
            <Table.Header>
              <Table.Row bg="#EFF6FF">
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600"><SortHeader label="Name" sortField="firstName" /></Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600"><SortHeader label="Role" sortField="role" /></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sortedVolunteers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((volunteer) => (
                <Table.Row
                  key={volunteer.id}
                  onClick={(e) => { e.stopPropagation(); onSelect?.(volunteer); }}
                  boxShadow={selectedId === volunteer.id ? "inset 0 0 0 1.5px var(--chakra-colors-blue-400)" : undefined}
                  _hover={{
                    bg: "gray.50",
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
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.600">{volunteer.role ?? "—"}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          {sortedVolunteers.length > PAGE_SIZE && (
            <Flex align="center" justify="flex-end" px={4} py={3} borderTopWidth="1px" borderTopColor="gray.100">
              <Flex>
                <Button
                  size="sm"
                  variant="ghost"
                  borderRadius="none"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  border="1.5px solid #E4E4E7"
                  _hover={{ bg: "gray.100" }}
                  _active={{ bg: "gray.200" }}
                  p={0}
                >
                  <LuChevronLeft />
                </Button>
                {getPageItems(page, Math.ceil(sortedVolunteers.length / PAGE_SIZE)).map((item, i) =>
                  typeof item === "object" ? (
                    <Button
                      key={`ellipsis-${i}`}
                      size="sm"
                      variant="ghost"
                      borderRadius="none"
                      border="1px solid #E4E4E7"
                      _hover={{ bg: "gray.100" }}
                      _active={{ bg: "gray.200" }}
                      onClick={() => setPage(item.target)}
                      p={0}
                    >
                      ...
                    </Button>
                  ) : (
                    <Button
                      key={item}
                      size="sm"
                      borderRadius="none"
                      border="1px solid #E4E4E7"
                      variant={item === page ? "solid" : "ghost"}
                      bg={item === page ? "black" : undefined}
                      color={item === page ? "white" : undefined}
                      _hover={item === page ? { bg: "black" } : undefined}
                      onClick={() => setPage(item)}
                    >
                      {item}
                    </Button>
                  )
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  borderRadius="none"
                  disabled={page === Math.ceil(sortedVolunteers.length / PAGE_SIZE)}
                  onClick={() => setPage((p) => p + 1)}
                  border="1px solid #E4E4E7"
                  _hover={{ bg: "gray.100" }}
                  _active={{ bg: "gray.200" }}
                  p={0}
                >
                  <LuChevronRight />
                </Button>
              </Flex>
            </Flex>
          )}
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
                  <SortHeader label="Name" sortField="firstName" />
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Role" sortField="role" />
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
              {sortedVolunteers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((volunteer) => (
                <Table.Row
                  key={volunteer.id}
                  onClick={(e) => { e.stopPropagation(); onSelect?.(volunteer); }}
                  bg={checkedIds.has(volunteer.id) ? "blue.50" : "transparent"}
                  boxShadow={selectedId === volunteer.id ? "inset 0 0 0 1px var(--chakra-colors-blue-400)" : undefined}
                  _hover={{
                    bg: "gray.50",
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
          {sortedVolunteers.length > PAGE_SIZE && (
            <Flex align="center" justify="flex-end" px={4} py={3} borderTopWidth="1px" borderTopColor="gray.100">
              <Flex>
                <Button
                  size="sm"
                  variant="ghost"
                  borderRadius="none"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  border="1px solid #E4E4E7"
                  _hover={{ bg: "gray.100" }}
                  _active={{ bg: "gray.200" }}
                  p={0}
                >
                  <LuChevronLeft />
                </Button>
                {getPageItems(page, Math.ceil(sortedVolunteers.length / PAGE_SIZE)).map((item, i) =>
                  typeof item === "object" ? (
                    <Button
                      key={`ellipsis-${i}`}
                      size="sm"
                      variant="ghost"
                      borderRadius="none"
                      border="1px solid #E4E4E7"
                      _hover={{ bg: "gray.100" }}
                      _active={{ bg: "gray.200" }}
                      onClick={() => setPage(item.target)}
                      p={0}
                    >
                      ...
                    </Button>
                  ) : (
                    <Button
                      key={item}
                      size="sm"
                      borderRadius="none"
                      border="1px solid #E4E4E7"
                      variant={item === page ? "solid" : "ghost"}
                      bg={item === page ? "black" : undefined}
                      color={item === page ? "white" : undefined}
                      _hover={item === page ? { bg: "black" } : undefined}
                      onClick={() => setPage(item)}
                    >
                      {item}
                    </Button>
                  )
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  borderRadius="none"
                  disabled={page === Math.ceil(sortedVolunteers.length / PAGE_SIZE)}
                  onClick={() => setPage((p) => p + 1)}
                  border="1px solid #E4E4E7"
                  _hover={{ bg: "gray.100" }}
                  _active={{ bg: "gray.200" }}
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
