import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { Box, Checkbox, Flex, Table, Text } from "@chakra-ui/react";
import { LuChevronsUpDown, LuChevronUp, LuChevronDown } from "react-icons/lu";

export const PAGE_SIZE = 8;

export type PageItem = number | { type: "ellipsis"; target: number };

const WINDOW = 3;

export function getPageItems(page: number, totalPages: number): PageItem[] {
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
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
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
  page,
  setPage,
}: VolunteerListProps) => {
  const { backend } = useBackendContext();
  const [sortKey, setSortKey] = useState<keyof Volunteer | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: keyof Volunteer) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const sortedVolunteers = sortKey
    ? [...volunteers].sort((a, b) => {
        const raw = (v: Volunteer) => {
          const val = v[sortKey];
          return Array.isArray(val) ? val[0] ?? "" : (val ?? "");
        };
        const av = String(raw(a));
        const bv = String(raw(b));
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
        {sortField && (active ? (sortDir === "asc" ? <LuChevronUp size={12} /> : <LuChevronDown size={12} />) : <LuChevronsUpDown size={12} />)}
      </Flex>
    );
  };

  return (
    <Box>
      {variant === "list" && (
        <Box>
          <Table.Root size="md">
            <Table.Header>
              <Table.Row bg="#EFF6FF">
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600"><SortHeader label="Name" sortField="firstName" /></Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600"><SortHeader label="Role" /></Table.ColumnHeader>
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
                    <Text fontSize="sm" color="gray.600">{volunteer.roles?.join(", ") || "—"}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      {variant === "table" && (
        <Box overflow="hidden">
          <Table.Root size="md">
            <Table.Header>
              <Table.Row bg="#EFF6FF">
                <Table.ColumnHeader w="40px">
                  <Checkbox.Root cursor="pointer"
                    size="sm"
                    checked={
                      sortedVolunteers.length > 0 &&
                      sortedVolunteers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).every((v) => checkedIds.has(v.id))
                    }
                    onCheckedChange={() => {
                      const pageIds = sortedVolunteers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((v) => v.id);
                      const allChecked = pageIds.every((id) => checkedIds.has(id));
                      setCheckedIds((prev) => {
                        const next = new Set(prev);
                        if (allChecked) pageIds.forEach((id) => next.delete(id));
                        else pageIds.forEach((id) => next.add(id));
                        return next;
                      });
                    }}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control cursor="pointer" />
                  </Checkbox.Root>
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Name" sortField="firstName" />
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Role" sortField="roles" />
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Interests" sortField="areasOfPractice" />
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Most Recent Event" sortField="mostRecentEvent" />
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Preference" sortField="experienceLevel" />
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
                    <Checkbox.Root cursor="pointer"
                      size="sm"
                      checked={checkedIds.has(volunteer.id)}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control cursor="pointer" />
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
                    <Text fontSize="sm" color="black">{volunteer.roles?.join(", ") || "—"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="black">
                      {volunteer.areasOfPractice?.join(", ") || "—"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="black">
                      {volunteer.mostRecentEvent
                        ? new Date(volunteer.mostRecentEvent).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </Text>
                  </Table.Cell>
                  {/* // TODO: Implement Preference column — source from volunteer_areas_of_practice.experience_level */}
                  <Table.Cell>
                    <Text fontSize="sm" color="black">—</Text>
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
