import { useState, useEffect } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
} from "@chakra-ui/react";


import { VolunteerProfilePanel } from "./VolunteerProfilePanel";
import { VolunteerProfilesPanel } from "./VolunteerProfilesPanel";

interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

type ViewMode = "list" | "split" | "profile";

export const VolunteerManagementView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isAdding, setIsAdding] = useState(false);
  const [volunteers, setVolunteers] = useState<never[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);


  const fetchVolunteers = async () => {
    try {
      const response = await fetch("http://localhost:3001/volunteers");
      const data = await response.json();
      setVolunteers(data);
      console.log("Volunteers loaded:", data);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleAddClick = () => {
    setIsAdding(true);
    if (viewMode === "list") {
      setViewMode("split");
    }
  };

  const handleConfirmNewVolunteer = async (data: VolunteerFormData) => {
    console.log("Attempting to create volunteer with data:", data);
    try {
      const response = await fetch("http://localhost:3001/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: "temp-" + Date.now(),
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber,
        }),
      });

      if (response.ok) {
        fetchVolunteers();
        setIsAdding(false);
      }
    } catch (error) {
      console.error("Error creating volunteer:", error);
    }
  };

  const handleUpdateVolunteer = async (id: number, data: any) => {
    try {
      const response = await fetch(`http://localhost:3001/volunteers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // We must map these to snake_case to match your volunteers.js PUT route
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber,
          // Sending nulls for the extra fields your backend expects
          form_completed: null,
          form_link: null,
          is_signed_confidentiality: null,
          is_attorney: null,
          is_notary: null
        }),
      });

      if (response.ok) {
        console.log("Volunteer updated successfully");
        fetchVolunteers(); // Refresh the list so the UI updates
      }
    } catch (error) {
      console.error("Error updating volunteer:", error);
    }
  };

  const handleSelectVolunteer = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsAdding(false);
  };

  return (
    <Box
      p={4}
      h="100%"
    >
      <Box mb={4}>
        <ButtonGroup
          size="sm"
          isAttached
          variant="outline"
        >
          <Button
            onClick={() => setViewMode("list")}
            colorScheme={viewMode === "list" ? "blue" : undefined}
          >
            List Only
          </Button>
          <Button
            onClick={() => setViewMode("split")}
            colorScheme={viewMode === "split" ? "blue" : undefined}
          >
            Split View
          </Button>
          <Button
            onClick={() => setViewMode("profile")}
            colorScheme={viewMode === "profile" ? "blue" : undefined}
          >
            Profile Only
          </Button>
        </ButtonGroup>
      </Box>

      {viewMode !== "profile" && (
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
      )}

      <Flex
        h="calc(100vh - 140px)"
        gap={6}
      >
        {(viewMode === "list" || viewMode === "split") && (
          <Box
            w={viewMode === "split" ? "30%" : "100%"}
            minW={viewMode === "split" ? "300px" : undefined}
            h="100%"
            overflowY="auto"
          >
            <VolunteerProfilesPanel
              variant={viewMode === "list" ? "table" : "list"}
              volunteers={volunteers}
              onSelectVolunteer={handleSelectVolunteer}
            />
          </Box>
        )}

        {(viewMode === "profile" || viewMode === "split") && (
          <Box
            w={viewMode === "split" ? "70%" : "100%"}
            h="100%"
            overflowY="auto"
            borderLeftWidth={viewMode === "split" ? "1px" : "0px"}
            borderLeftColor="gray.200"
            pl={viewMode === "split" ? 6 : 0}
          >
            {isAdding ? (
              <VolunteerProfilePanel
                variant="new"
                showBack
                onBack={() => setIsAdding(false)}
                onConfirm={handleConfirmNewVolunteer}
              />
            ) : (
              <VolunteerProfilePanel
                showBack={viewMode === "profile"}
                onBack={() => setViewMode("list")}
                selectedVolunteer={selectedVolunteer}
                onUpdate={handleUpdateVolunteer}
              />
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
};
