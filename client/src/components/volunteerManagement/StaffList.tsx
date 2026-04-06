import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { Box, Checkbox, Flex, Table, Text } from "@chakra-ui/react";
import { LuChevronsUpDown, LuChevronUp, LuChevronDown } from "react-icons/lu";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { StaffMember } from "@/types/volunteer";
import { PAGE_SIZE } from "./VolunteerList";

interface StaffListProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  staffMembers: StaffMember[];
  setStaffMembers: Dispatch<SetStateAction<StaffMember[]>>;
  checkedIds: Set<number>;
  setCheckedIds: Dispatch<SetStateAction<Set<number>>>;
  onSelect?: (member: StaffMember) => void;
  selectedId?: number;
  variant?: "table" | "list";
}

export const StaffList = ({
  page,
  setPage,
  staffMembers,
  setStaffMembers,
  checkedIds,
  setCheckedIds,
  onSelect,
  selectedId,
  variant = "table",
}: StaffListProps) => {
  const { backend } = useBackendContext();
  const [sortKey, setSortKey] = useState<keyof StaffMember | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    (async () => {
      const res = await backend.get<StaffMember[]>("/admins/staff");
      setStaffMembers(res.data);
    })();
  }, [backend, setStaffMembers]);

  const handleSort = (key: keyof StaffMember) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const sortedStaff = sortKey
    ? [...staffMembers].sort((a, b) => {
        const av = String(a[sortKey] ?? "");
        const bv = String(b[sortKey] ?? "");
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : staffMembers;

  const toggleCheck = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const SortHeader = ({ label, sortField }: { label: string; sortField?: keyof StaffMember }) => {
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

  const pageSlice = sortedStaff.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const isList = variant === "list";

  return (
    <Box overflow="hidden">
      <Table.Root size="md">
        <Table.Header>
          <Table.Row bg="#EFF6FF">
            {!isList && (
              <Table.ColumnHeader w="40px">
                <Checkbox.Root
                  cursor="pointer"
                  size="sm"
                  checked={
                    sortedStaff.length > 0 &&
                    pageSlice.every((s) => checkedIds.has(s.id))
                  }
                  onCheckedChange={() => {
                    const pageIds = pageSlice.map((s) => s.id);
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
            )}
            <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
              <SortHeader label="Name" sortField="firstName" />
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
              <SortHeader label="Role" sortField="role" />
            </Table.ColumnHeader>
            {!isList && (
              <>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Phone Number" sortField="phoneNumber" />
                </Table.ColumnHeader>
                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.600">
                  <SortHeader label="Start Date" sortField="startDate" />
                </Table.ColumnHeader>
              </>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pageSlice.map((member) => (
            <Table.Row
              key={member.id}
              bg={!isList && checkedIds.has(member.id) ? "blue.50" : "transparent"}
              boxShadow={selectedId === member.id ? "inset 0 0 0 1.5px var(--chakra-colors-blue-400)" : undefined}
              _hover={{ bg: "gray.50", cursor: "pointer" }}
              onClick={(e) => { e.stopPropagation(); onSelect?.(member); }}
            >
              {!isList && (
                <Table.Cell onClick={(e) => toggleCheck(e, member.id)}>
                  <Checkbox.Root cursor="pointer" size="sm" checked={checkedIds.has(member.id)}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </Table.Cell>
              )}
              <Table.Cell>
                <Flex align="center" gap={3}>
                  <Box w="36px" h="36px" borderRadius="full" bg="gray.200" flexShrink={0} />
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="black">
                      {member.firstName} {member.lastName}
                    </Text>
                    <Text fontSize="xs" color="gray.500">{member.email}</Text>
                  </Box>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" color="black">{member.role}</Text>
              </Table.Cell>
              {!isList && (
                <>
                  <Table.Cell>
                    <Text fontSize="sm" color="black">{member.phoneNumber ?? "—"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="black">{formatDate(member.startDate)}</Text>
                  </Table.Cell>
                </>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
