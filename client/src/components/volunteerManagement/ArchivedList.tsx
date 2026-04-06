import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { Box, Checkbox, Flex, Table, Text } from "@chakra-ui/react";
import { LuChevronsUpDown, LuChevronUp, LuChevronDown } from "react-icons/lu";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { ArchivedVolunteer } from "@/types/volunteer";
import { PAGE_SIZE } from "./VolunteerList";

interface ArchivedListProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  archivedVolunteers: ArchivedVolunteer[];
  setArchivedVolunteers: Dispatch<SetStateAction<ArchivedVolunteer[]>>;
  checkedIds: Set<number>;
  setCheckedIds: Dispatch<SetStateAction<Set<number>>>;
}

export const ArchivedList = ({
  page,
  setPage,
  archivedVolunteers,
  setArchivedVolunteers,
  checkedIds,
  setCheckedIds,
}: ArchivedListProps) => {
  const { backend } = useBackendContext();
  const [sortKey, setSortKey] = useState<keyof ArchivedVolunteer | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    (async () => {
      const [volunteersRes, staffRes] = await Promise.all([
        backend.get<ArchivedVolunteer[]>("/volunteers/archived"),
        backend.get<ArchivedVolunteer[]>("/admins/archived"),
      ]);
      setArchivedVolunteers([...volunteersRes.data, ...staffRes.data]);
    })();
  }, [backend, setArchivedVolunteers]);

  const handleSort = (key: keyof ArchivedVolunteer) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const sortedVolunteers = sortKey
    ? [...archivedVolunteers].sort((a, b) => {
        const raw = (v: ArchivedVolunteer) => {
          const val = v[sortKey];
          return Array.isArray(val) ? val[0] ?? "" : (val ?? "");
        };
        const av = String(raw(a));
        const bv = String(raw(b));
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : archivedVolunteers;

  const toggleCheck = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const SortHeader = ({ label, sortField }: { label: string; sortField?: keyof ArchivedVolunteer }) => {
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
        {sortField && (active
          ? (sortDir === "asc" ? <LuChevronUp size={12} /> : <LuChevronDown size={12} />)
          : <LuChevronsUpDown size={12} />
        )}
      </Flex>
    );
  };

  const pageSlice = sortedVolunteers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box overflow="hidden">
      <Table.Root size="md">
        <Table.Header>
          <Table.Row bg="#EFF6FF">
            <Table.ColumnHeader w="40px">
              <Checkbox.Root
                cursor="pointer"
                size="sm"
                checked={
                  sortedVolunteers.length > 0 &&
                  pageSlice.every((v) => checkedIds.has(v.id))
                }
                onCheckedChange={() => {
                  const pageIds = pageSlice.map((v) => v.id);
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
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
              <SortHeader label="Name" sortField="firstName" />
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
              <SortHeader label="Role" sortField="roles" />
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
              <SortHeader label="Reactivation" sortField="reactivation" />
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
              <SortHeader label="Archived Date" sortField="archivedDate" />
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
              Notes
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pageSlice.map((volunteer) => (
            <Table.Row
              key={volunteer.id}
              bg={checkedIds.has(volunteer.id) ? "blue.50" : "transparent"}
              _hover={{ bg: "gray.50", cursor: "pointer" }}
            >
              <Table.Cell onClick={(e) => toggleCheck(e, volunteer.id)}>
                <Checkbox.Root cursor="pointer" size="sm" checked={checkedIds.has(volunteer.id)}>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap={3}>
                  <Box w="36px" h="36px" borderRadius="full" bg="gray.200" flexShrink={0} />
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
                <Text fontSize="sm" color="black">{volunteer.reactivation ?? "—"}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="black">{volunteer.archivedDate ? new Date(volunteer.archivedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="black">{volunteer.archivedNotes ?? "—"}</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
