import { useEffect, useState } from "react";

import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { LuCircleUser } from "react-icons/lu";
import { LuListFilter } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { Volunteer } from "@/types/volunteer";

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
            />
            <Box color="gray.400" flexShrink={0} mr={2}>
              <FiSearch />
            </Box>
          </Flex>
          <Button
            size="md"
            variant="outline"
            backgroundColor="#FAFAFA"
          >
            <LuListFilter />
            Sort and Filter
          </Button>
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
          Volunteers <Box as="span" color="#52525B" fontWeight="normal" ml={1}>{volunteers.length}</Box>
        </Heading>
        {checkedIds.size > 0 && (
          <Flex gap={4} mb={2} ml={2}>
            <Button size="sm" variant="ghost" color="gray.600" bg="transparent" borderRadius="none" borderBottom="1px solid transparent" _hover={{ color: "blue.400", borderBottomColor: "blue.400", _active: { color: "blue.600", borderBottomColor: "transparent" } }} p={0}>Delete</Button>
            <Button size="sm" variant="ghost" color="gray.600" bg="transparent" borderRadius="none" borderBottom="1px solid transparent" _hover={{ color: "blue.400", borderBottomColor: "blue.400", _active: { color: "blue.600", borderBottomColor: "transparent" } }} p={0}>Archive</Button>
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
          onClick={() => { if (viewMode === "split") { setViewMode("list"); setSelectedVolunteer(null); } }}
        >
          <VolunteerList
            variant={viewMode === "list" ? "table" : "list"}
            refreshId={refreshTrigger}
            onSelect={(volunteer) => {
              setSelectedVolunteer(volunteer);
              if (viewMode === "list") {
                setViewMode("split");
              }
            }}
            selectedId={selectedVolunteer?.id}
            volunteers={volunteers}
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
                  await backend.put(
                    `/volunteers/${selectedVolunteer.id}`,
                    {
                      first_name: data.firstName,
                      last_name: data.lastName,
                      email: data.email,
                      phone_number: data.phoneNumber,
                      role: data.role,
                      experience_level: data.experienceLevel,
                    }
                  );
                  setSelectedVolunteer((prev) =>
                    prev ? { ...prev, ...data } : prev
                  );
                  setRefreshTrigger((prev) => prev + 1);
                }}
              />
          </Box>
        )}
      </Flex>
    </Box>
  );
};
