import React from "react";

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
  Separator,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { LuChevronUp } from "react-icons/lu";

const filterCategories = [
  {
    label: "Type",
    options: ["Estate Planning", "Limited Conservatorship", "Probate Note Clearing"],
  },
  {
    label: "Language",
    options: ["Arabic", "Japanese", "Korean", "Mandarin", "Spanish", "Vietnamese"],
  },
  {
    label: "Location",
    options: ["Virtual", "In-person"],
  },
  {
    label: "Occupation",
    options: [
      "Attorney",
      "Law Student 1L",
      "Law Student 2L",
      "Law Student 3L",
      "Law Student LLM",
      "Undergraduate Student",
      "Paralegal/Legal Worker",
      "Paralegal Student",
    ],
  },
];

const FilterCategory = ({ label, options, selectedFilters, onToggle }) => {
  return (
    <Collapsible.Root defaultOpen>
      <Collapsible.Trigger
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        py="12px"
        cursor="pointer"
        borderTopWidth="1px"
        borderColor="#E5E7EB"
      >
        <Text fontSize="16px" fontWeight={600} color="#111827">
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
        <VStack align="stretch" gap="10px" pl="8px" pb="12px">
          {options.map((option) => (
            <Checkbox.Root
              key={option}
              checked={selectedFilters.includes(option)}
              onCheckedChange={() => onToggle(option)}
              size="sm"
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text fontSize="14px" fontWeight={400} color="#374151">
                  {option}
                </Text>
              </Checkbox.Label>
            </Checkbox.Root>
          ))}
        </VStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export const SortAndFilter = ({ open, onOpenChange, sortBy, setSortBy, selectedFilters, setSelectedFilters, filteredCount }) => {
  const toggleFilter = (option) => {
    setSelectedFilters((prev) =>
      prev.includes(option)
        ? prev.filter((f) => f !== option)
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
            <Drawer.Header px="24px" pt="24px" pb="16px">
              <Flex justify="space-between" align="center" w="100%">
                <Text fontSize="20px" fontWeight={700} color="#111827">
                  Sort and Filter
                </Text>
                <CloseButton
                  size="sm"
                  onClick={() => onOpenChange(false)}
                />
              </Flex>
            </Drawer.Header>

            <Separator borderColor="#111827" mx="24px" />

            {/* Body */}
            <Drawer.Body px="24px" py="16px" overflowY="auto">
              {/* Sort By */}
              <Box mb="20px">
                <Text fontSize="16px" fontWeight={600} color="#111827" mb="12px">
                  Sort By
                </Text>
                <HStack gap="8px">
                  <Button
                    size="sm"
                    variant={sortBy === "upcoming" ? "solid" : "outline"}
                    bg={sortBy === "upcoming" ? "#111827" : "white"}
                    color={sortBy === "upcoming" ? "white" : "#374151"}
                    borderColor="#D1D5DB"
                    borderRadius="6px"
                    fontWeight={500}
                    fontSize="14px"
                    px="16px"
                    h="36px"
                    _hover={{
                      bg: sortBy === "upcoming" ? "#1F2937" : "#F9FAFB",
                    }}
                    onClick={() => setSortBy("upcoming")}
                  >
                    Upcoming
                  </Button>
                  <Button
                    size="sm"
                    variant={sortBy === "urgency" ? "solid" : "outline"}
                    bg={sortBy === "urgency" ? "#111827" : "white"}
                    color={sortBy === "urgency" ? "white" : "#374151"}
                    borderColor="#D1D5DB"
                    borderRadius="6px"
                    fontWeight={500}
                    fontSize="14px"
                    px="16px"
                    h="36px"
                    _hover={{
                      bg: sortBy === "urgency" ? "#1F2937" : "#F9FAFB",
                    }}
                    onClick={() => setSortBy("urgency")}
                  >
                    Urgency
                  </Button>
                </HStack>
              </Box>

              {/* Selected Filters */}
              <Box mb="20px">
                <Text fontSize="16px" fontWeight={600} color="#111827" mb="12px">
                  Selected Filters
                </Text>
                <Box
                  borderWidth="1px"
                  borderColor="#D1D5DB"
                  borderRadius="6px"
                  minH="40px"
                  px="12px"
                  py="8px"
                >
                  <HStack gap="6px" flexWrap="wrap">
                    {selectedFilters.map((filter) => (
                      <Button
                        key={filter}
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
                        {filter} ×
                      </Button>
                    ))}
                  </HStack>
                </Box>
              </Box>

              {/* Filter Categories */}
              <Box>
                <Text fontSize="16px" fontWeight={600} color="#111827" mb="8px">
                  Filter Categories
                </Text>
                <Stack gap="0" pl="8px">
                  {filterCategories.map((category) => (
                    <FilterCategory
                      key={category.label}
                      label={category.label}
                      options={category.options}
                      selectedFilters={selectedFilters}
                      onToggle={toggleFilter}
                    />
                  ))}
                </Stack>
              </Box>
            </Drawer.Body>

            {/* Footer */}
            <Drawer.Footer px="24px" py="16px" borderTopWidth="1px" borderColor="#E5E7EB">
              <Flex justify="space-between" align="center" w="100%">
                <Button
                  variant="outline"
                  borderColor="#D1D5DB"
                  color="#374151"
                  borderRadius="8px"
                  fontSize="14px"
                  fontWeight={500}
                  h="40px"
                  px="24px"
                  _hover={{ bg: "#F9FAFB" }}
                  onClick={clearAll}
                >
                  Clear
                </Button>
                <Button
                  bg="#111827"
                  color="white"
                  borderRadius="8px"
                  fontSize="14px"
                  fontWeight={500}
                  h="40px"
                  px="24px"
                  _hover={{ bg: "#1F2937" }}
                  onClick={() => onOpenChange(false)}
                >
                  See {filteredCount} Results
                </Button>
              </Flex>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
