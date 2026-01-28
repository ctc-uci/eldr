import { useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
} from "@chakra-ui/react";

import { VolunteerList, type Volunteer } from "./VolunteerList";
import { VolunteerProfilePanel } from "./VolunteerProfilePanel";

type ViewMode = "list" | "split";

export const VolunteerManagementView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isAdding, setIsAdding] = useState(false);
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
                onConfirm={(data) => {
                  console.log("New Profile Data:", data);
                  setIsAdding(false);
                }}
              />
            ) : (
              <VolunteerProfilePanel
                showBack
                onBack={() => setViewMode("list")}
                volunteer={selectedVolunteer}
              />
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
};
