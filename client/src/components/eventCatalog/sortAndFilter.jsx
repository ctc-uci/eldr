import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Collapsible,
  Drawer,
  Flex,
  HStack,
  Portal,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { ListFilter } from "lucide-react";
import { LuChevronUp } from "react-icons/lu";

const FilterCategory = ({
  label,
  options,
  selectedFilters,
  onToggle,
  isFirst,
}) => {
  return (
    <Collapsible.Root
      defaultOpen
      m={2}
    >
      <Collapsible.Trigger
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        py="12px"
        cursor="pointer"
        borderTopWidth={isFirst ? "0" : "1px"}
        borderColor="#E5E7EB"
      >
        <Text
          fontSize="16px"
          fontWeight={600}
          color="#111827"
        >
          {label}
        </Text>
        <Collapsible.Indicator
          transition="transform 0.2s"
          _open={{ transform: "rotate(0deg)" }}
          _closed={{ transform: "rotate(180deg)" }}
        >
          <LuChevronUp color="#374151" />
        </Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <VStack
          align="stretch"
          gap="10px"
          px="8px"
          py="8px"
        >
          {options.map((option) => (
            <Checkbox.Root
              key={option.id}
              checked={selectedFilters.some((f) => f.id === option.id)}
              onCheckedChange={() => onToggle(option)}
              size="sm"
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text
                  fontSize="14px"
                  fontWeight={400}
                  color="#374151"
                >
                  {option.text}
                </Text>
              </Checkbox.Label>
            </Checkbox.Root>
          ))}
        </VStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export const SortAndFilter = ({
  open,
  onOpenChange,
  setSortBy,
  selectedFilters,
  setSelectedFilters,
  filteredCount,
}) => {
  const { backend } = useBackendContext();

  const [filterCategories, setFilterCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFilterOptions = async () => {
    try {
      const [typesRes, languagesRes, occupationsRes] = await Promise.all([
        backend.get("/areas-of-practice"),
        backend.get("/languages/with-volunteers"),
        backend.get("/roles"),
      ]);

      const categories = [
        {
          label: "Category",
          key: "areasOfPracticeIds",
          options: typesRes.data.map((t) => ({
            id: "areasOfPracticeId" + t.id,
            text: t.areasOfPractice,
          })),
        },
        {
          label: "Language",
          key: "languageIds",
          options: languagesRes.data.map((l) => ({
            id: "languageId" + l.id,
            text: l.language,
          })),
        },
        {
          label: "Location",
          key: "locations",
          // ids must match clinics.location_type enum (API normalizes legacy labels)
          options: [
            { id: "hybrid", text: "Hybrid" },
            { id: "in-person", text: "In-person" },
            { id: "online", text: "Online" },
          ],
        },
        {
          label: "Role",
          key: "roleIds",
          options: occupationsRes.data.map((o) => ({
            id: "roleId" + o.id,
            text: o.roleName,
          })),
        },
      ];

      setFilterCategories(categories);
    } catch (e) {
      console.error("Error fetching filter options:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const toggleFilter = (option) => {
    setSelectedFilters((prev) =>
      prev.some((f) => f.id === option.id)
        ? prev.filter((f) => f.id !== option.id)
        : [...prev, option]
    );
  };

  const clearAll = () => {
    setSelectedFilters([]);
    setSortBy("upcoming");
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement="start"
      size="sm"
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            {/* Header */}
            <Drawer.Header
              px="24px"
              pt="24px"
              pb="16px"
              borderBottom="1px solid #E4E4E7"
            >
              <Flex
                justify="space-between"
                align="center"
                w="100%"
              >
                <Text
                  fontSize="20px"
                  fontWeight={700}
                  color="#111827"
                >
                  Filter
                </Text>
                <CloseButton
                  size="sm"
                  onClick={() => onOpenChange(false)}
                />
              </Flex>
            </Drawer.Header>

            {/* Body */}
            <Drawer.Body
              px="24px"
              py="16px"
              overflowY="auto"
            >
              {/* Selected Filters */}
              <Box mb="20px">
                <Text
                  fontSize="16px"
                  fontWeight={600}
                  color="#111827"
                  mb="12px"
                >
                  Selected Filters
                </Text>
                <Box
                  borderWidth="1px"
                  borderColor="#D1D5DB"
                  borderRadius="6px"
                  minH="40px"
                  px="7px"
                  py="5px"
                >
                  <HStack
                    gap="6px"
                    flexWrap="wrap"
                  >
                    {selectedFilters.map((filter) => (
                      <Button
                        key={filter.id}
                        bg="#F4F4F5"
                        size="xs"
                        variant="outline"
                        borderColor="#D1D5DB"
                        borderRadius="4px"
                        fontSize="12px"
                        fontWeight={400}
                        color="#374151"
                        h="28px"
                        px="8px"
                        onClick={() => toggleFilter(filter)}
                      >
                        {filter.text} ×
                      </Button>
                    ))}
                  </HStack>
                </Box>
              </Box>

              {/* Filter Categories */}
              <Box>
                <Text
                  fontSize="16px"
                  fontWeight={600}
                  color="#111827"
                  mb="8px"
                >
                  Filter Categories
                </Text>
                {isLoading ? (
                  <Text
                    fontSize="14px"
                    color="#6B7280"
                  >
                    Loading filter options...
                  </Text>
                ) : (
                  <Stack
                    gap="0"
                    pl="8px"
                  >
                    {filterCategories.map((category, index) => (
                      <FilterCategory
                        key={category.label}
                        label={category.label}
                        options={category.options}
                        selectedFilters={selectedFilters}
                        onToggle={toggleFilter}
                        isFirst={index === 0}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Drawer.Body>

            {/* Footer */}
            <Drawer.Footer
              px="24px"
              py="16px"
              borderTopWidth="1px"
              borderColor="#E5E7EB"
            >
              <Flex
                justify="space-between"
                align="center"
                w="100%"
              >
                <Button
                  variant="outline"
                  borderColor="#D1D5DB"
                  color="#374151"
                  fontSize="14px"
                  fontWeight={500}
                  size="xl"
                  px="20px"
                  py="2px"
                  _hover={{ bg: "#F9FAFB" }}
                  onClick={clearAll}
                >
                  Clear
                </Button>
                <Button
                  bg="#487C9E"
                  color="white"
                  fontSize="14px"
                  fontWeight={500}
                  size="xl"
                  px="20px"
                  py="2px"
                  _hover={{ bg: "#5c86a3" }}
                  onClick={() => onOpenChange(false)}
                  disabled={filteredCount === 0}
                >
                  <ListFilter size={20} />
                  {filteredCount > 0
                    ? `See ${filteredCount} Results`
                    : "No Results"}
                </Button>
              </Flex>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
