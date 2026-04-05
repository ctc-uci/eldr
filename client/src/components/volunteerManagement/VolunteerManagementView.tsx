import { useEffect, useRef, useState } from "react";

import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { Volunteer } from "@/types/volunteer";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { LuCircleUser, LuListFilter } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { FilterDrawer } from "./FilterDrawer";
import { VolunteerList } from "./VolunteerList";
import { VolunteerProfilePanel } from "./VolunteerProfilePanel";

type ViewMode = "list" | "split";

export const VolunteerManagementView = () => {
  const { backend } = useBackendContext();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 250);
  };

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
    ? volunteers.filter((v) =>
        fuzzyMatch(debouncedQuery, `${v.firstName} ${v.lastName}`)
      )
    : volunteers;

  useEffect(() => {
    (async () => {
      const res = await backend.get<Volunteer[]>("/volunteers");
      setVolunteers(res.data);
    })();
  }, [backend]);

  return (
    <Box
      p={4}
      h="100%"
    >
      <>
        <Flex
          gap={2}
          align="center"
          mb={4}
        >
          <Button
            size="md"
            variant="outline"
            backgroundColor="#FAFAFA"
            onClick={() => setFilterDrawerOpen(true)}
          >
            <LuListFilter />
            Filter
          </Button>
          <Flex
            align="center"
            borderWidth="1px"
            borderColor="gray.300"
            borderRadius="sm"
            px={2}
            w="100%"
            h="40px"
          >
            <Input
              placeholder="Search..."
              fontSize="md"
              border="none"
              _placeholder={{ color: "#A1A1AA" }}
              _focusVisible={{
                border: "none",
                boxShadow: "none",
                outline: "none",
              }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Box
              color="gray.400"
              flexShrink={0}
              mr={2}
            >
              <FiSearch />
            </Box>
          </Flex>
          <Button
            size="md"
            bg="#5F80A0"
            color="white"
            borderRadius="md"
            py={4}
            gap={2}
            _hover={{ bg: "#487C9E" }}
            onClick={() => navigate("/volunteer-management/new")}
          >
            <LuCircleUser />
            Add Profile
            <FiArrowRight />
          </Button>
        </Flex>
        <Heading
          size="lg"
          mb={2}
        >
          Volunteers{" "}
          <Box
            as="span"
            color="#52525B"
            fontWeight="normal"
            ml={1}
          >
            {filteredVolunteers.length}
          </Box>
        </Heading>
        {checkedIds.size > 0 && (
          <Flex
            gap={4}
            mb={2}
            ml={2}
          >
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
                _active: {
                  color: "blue.600",
                  borderBottomColor: "transparent",
                },
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
                _active: {
                  color: "blue.600",
                  borderBottomColor: "transparent",
                },
              }}
              p={0}
            >
              Archive
            </Button>
          </Flex>
        )}
      </>

      <Flex
        h="calc(100vh - 140px)"
        gap={6}
      >
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
          />
        </Box>

        {viewMode === "split" && (
          <Box
            w="50%"
            h="100%"
            overflowY="auto"
            pl={6}
          >
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
                setSelectedVolunteer((prev) =>
                  prev ? { ...prev, ...data } : prev
                );
                setRefreshTrigger((prev) => prev + 1);
              }}
            />
          </Box>
        )}
      </Flex>

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

      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        totalCount={volunteers.length}
      />
    </Box>
  );
};
