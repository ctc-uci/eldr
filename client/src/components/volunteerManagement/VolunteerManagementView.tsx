import { useState } from "react";

import { Steps, Box, Button, Flex, Heading, Input } from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { Volunteer } from "@/types/volunteer";

import { VolunteerList } from "./VolunteerList";
import { VolunteerProfilePanel } from "./VolunteerProfilePanel";

type ViewMode = "list" | "split";

export const VolunteerManagementView = () => {
  const backend = useBackendContext();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isAdding, setIsAdding] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );

  const handleAddClick = () => {
    setIsAdding(true);
    if (viewMode === "list") {
      setViewMode("split");
    }
  };

  return (
    <Box
      p={4}
      h="100%"
    >
      <>
        <Heading
          size="md"
          mb={2}
        >
          Profile List
        </Heading>
        <Flex
          gap={2}
          align="center"
          mb={4}
        >
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
          <Button
            size="sm"
            variant="outline"
          >
            Filters
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddClick}
          >
            Add Profile
          </Button>
        </Flex>
      </>

      <Flex
        h="calc(100vh - 140px)"
        gap={6}
      >
        <Box
          w={viewMode === "split" ? "30%" : "100%"}
          minW={viewMode === "split" ? "300px" : undefined}
          h="100%"
          overflowY="auto"
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
          />
        </Box>

        {viewMode === "split" && (
          <Box
            w="70%"
            h="100%"
            overflowY="auto"
            borderLeftWidth="1px"
            borderLeftColor="gray.200"
            pl={6}
          >
            {isAdding ? (
              <VolunteerProfilePanel
                variant="new"
                showBack
                onBack={() => setIsAdding(false)}
                onConfirm={async (data) => {
                  try {
                    const payload = {
                      firebaseUid: "placeholder-uid7", // TODO: generate dynamically
                      first_name: data.firstName,
                      last_name: data.lastName,
                      email: data.email,
                      phone_number: data.phoneNumber,
                      role: data.role,
                      experience_level: data.experienceLevel,
                    };

                    const res = await backend.backend.post("/volunteers", payload);

                    setIsAdding(false);
                    setRefreshTrigger((prev) => prev + 1);

                    // Map snake_case response to camelCase for frontend
                    const newVolunteer = {
                      ...res.data,
                      firstName: res.data.first_name || data.firstName,
                      lastName: res.data.last_name || data.lastName,
                      phoneNumber: res.data.phone_number || data.phoneNumber,
                      experienceLevel: res.data.experience_level || data.experienceLevel,
                    };

                    setSelectedVolunteer(newVolunteer);
                  } catch (error) {
                    console.error("Error creating volunteer:", error);
                  }
                }}
              />
            ) : (
              <VolunteerProfilePanel
                showBack
                onBack={() => setViewMode("list")}
                volunteer={selectedVolunteer}
                onConfirm={async (data) => {
                  if (!selectedVolunteer) return;

                  await backend.backend.put(
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

                  // Update local state to reflect changes

                  setSelectedVolunteer((prev) =>
                    prev ? { ...prev, ...data } : prev
                  );
                  setRefreshTrigger((prev) => prev + 1);
                }}
              />
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
};
