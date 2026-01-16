import { useState } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
} from "@chakra-ui/react";

import { VolunteerAddProfile } from "./VolunteerAddProfile";
import { VolunteerProfilePanel } from "./VolunteerProfilePanel";
import { VolunteerProfilesPanel } from "./VolunteerProfilesPanel";

type ViewMode = "list" | "split" | "profile";

export const VolunteerManagementView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isAdding, setIsAdding] = useState(false);

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
              <VolunteerAddProfile
                onBack={() => setIsAdding(false)}
                onConfirm={(data) => {
                  console.log("New Profile Data:", data);
                  setIsAdding(false);
                }}
              />
            ) : (
              <VolunteerProfilePanel
                showBack={viewMode === "profile"}
                onBack={() => setViewMode("list")}
              />
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
};
