import { useEffect, useState, type ReactNode } from "react";

import { Box, Button, Flex, Tabs, Text } from "@chakra-ui/react";
import { LuArchive, LuBriefcase, LuCircleUser, LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { Volunteer } from "@/types/volunteer";

import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { PAGE_SIZE, getPageItems, VolunteerList } from "./VolunteerList";
import { VolunteerProfilePanel } from "./VolunteerProfilePanel";

type ViewMode = "list" | "split";

interface VolunteerManagementViewProps {
  debouncedQuery: string;
}

const TABS: { value: string; icon: ReactNode; label: string }[] = [
  { value: "volunteers", icon: <LuCircleUser />, label: "Volunteer" },
  { value: "staff", icon: <LuBriefcase />, label: "Staff" },
  { value: "archived", icon: <LuArchive />, label: "Archived" },
];

export const VolunteerManagementView = ({ debouncedQuery }: VolunteerManagementViewProps) => {
  const { backend } = useBackendContext();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const fuzzyMatch = (query: string, target: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    const t = target.toLowerCase();
    let qi = 0;
    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t[ti] === q[qi]) qi++;
    }
    return qi === q.length;
  };

  const filteredVolunteers = debouncedQuery
    ? volunteers.filter((v) => fuzzyMatch(debouncedQuery, `${v.firstName} ${v.lastName}`))
    : volunteers;

  useEffect(() => {
    setPage(1);
  }, [filteredVolunteers.length]);

  useEffect(() => {
    (async () => {
      const res = await backend.get<Volunteer[]>("/volunteers");
      setVolunteers(res.data);
    })();
  }, [backend]);

  const totalPages = Math.ceil(filteredVolunteers.length / PAGE_SIZE);

  const showingStart = (page - 1) * PAGE_SIZE + 1;
  const showingEnd = Math.min(page * PAGE_SIZE, filteredVolunteers.length);

  const pagination = filteredVolunteers.length > PAGE_SIZE ? (
    <Flex direction="column" align="flex-end" py={3} gap={2}>
      <Text fontSize="sm" color="gray.500">
        Showing {showingStart} to {showingEnd} of {filteredVolunteers.length}
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
          _active={{ bg: "gray.200" }}
          p={0}
        >
          <LuChevronLeft />
        </Button>
        {getPageItems(page, totalPages).map((item, i) =>
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
          disabled={page === totalPages}
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
  ) : null;

  const volunteersTable = (
    <>
      {checkedIds.size > 0 && (
        <Flex gap={4} mb={2} ml={2}>
          <Button
            size="sm"
            variant="ghost"
            color="gray.600"
            bg="transparent"
            borderRadius="none"
            borderBottom="1px solid transparent"
            _hover={{
              color: "blue.400",
              borderBottomColor: "blue.400",
              _active: { color: "blue.600", borderBottomColor: "transparent" },
            }}
            p={0}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </Button>
          {/* TODO: Implement archive functionality */}
          <Button
            size="sm"
            variant="ghost"
            color="gray.600"
            bg="transparent"
            borderRadius="none"
            borderBottom="1px solid transparent"
            _hover={{
              color: "blue.400",
              borderBottomColor: "blue.400",
              _active: { color: "blue.600", borderBottomColor: "transparent" },
            }}
            p={0}
          >
            Archive
          </Button>
        </Flex>
      )}

      <Flex gap={6}>
        <Box
          w={viewMode === "split" ? "50%" : "100%"}
          minW={viewMode === "split" ? "300px" : undefined}
          h="100%"
          overflowY="auto"
          onClick={(e) => {
            if (viewMode === "split" && e.target === e.currentTarget) {
              setViewMode("list");
              setSelectedVolunteer(null);
            }
          }}
        >
          <VolunteerList
            variant={viewMode === "list" ? "table" : "list"}
            refreshId={refreshTrigger}
            onSelect={(volunteer) => {
              if (selectedVolunteer?.id === volunteer.id) {
                setSelectedVolunteer(null);
                setViewMode("list");
              } else {
                setSelectedVolunteer(volunteer);
                setViewMode("split");
              }
            }}
            selectedId={selectedVolunteer?.id}
            volunteers={filteredVolunteers}
            setVolunteers={setVolunteers}
            checkedIds={checkedIds}
            setCheckedIds={setCheckedIds}
            page={page}
            setPage={setPage}
          />
        </Box>

        {viewMode === "split" && (
          <Box w="50%" h="100%" overflowY="auto" pl={6}>
            <VolunteerProfilePanel
              showBack
              onBack={() => setViewMode("list")}
              volunteer={selectedVolunteer}
              onConfirm={async (data) => {
                if (!selectedVolunteer) return;
                await backend.put(`/volunteers/${selectedVolunteer.id}`, {
                  first_name: data.firstName,
                  last_name: data.lastName,
                  email: data.email,
                  phone_number: data.phoneNumber,
                });
                setSelectedVolunteer((prev) => prev ? { ...prev, ...data } : prev);
                setRefreshTrigger((prev) => prev + 1);
              }}
            />
          </Box>
        )}
      </Flex>
    </>
  );

  return (
    <Box h="100%">
      <Tabs.Root defaultValue="volunteers" variant="outline">
        <Tabs.List w="fit-content">
          {TABS.map(({ value, icon, label }) => (
            <Tabs.Trigger key={value} value={value} color="#52525B" _selected={{ color: "#27272A", bg: "white" }}>
              <Flex align="center" gap={1}>{icon} {label}</Flex>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="volunteers" p={0} pt={0} border="1px solid #E4E4E7">
          {volunteersTable}
        </Tabs.Content>
        {/* TODO: Implement staff view */}
        <Tabs.Content value="staff" p={0} border="1px solid #E4E4E7">
          <p>staff!</p>
        </Tabs.Content>
        {/* TODO: Implement archived volunteers view */}
        <Tabs.Content value="archived" p={0} border="1px solid #E4E4E7">
          <p>archived!</p>
        </Tabs.Content>
      </Tabs.Root>
        
      {pagination}

      <DeleteConfirmModal
        open={deleteModalOpen}
        count={checkedIds.size}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          await Promise.all(
            [...checkedIds].map((id) => backend.delete(`/volunteers/${id}`))
          );
          setVolunteers((prev) => prev.filter((v) => !checkedIds.has(v.id)));
          if (selectedVolunteer && checkedIds.has(selectedVolunteer.id)) {
            setSelectedVolunteer(null);
            setViewMode("list");
          }
          setCheckedIds(new Set());
          setDeleteModalOpen(false);
        }}
      />
    </Box>
  );
};
