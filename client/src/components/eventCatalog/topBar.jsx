import React, { useState } from "react";

import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";

import { FaMagnifyingGlass } from "react-icons/fa6";
import { LuCalendarDays, LuSettings2, LuUserCheck } from "react-icons/lu";

import { SortAndFilter } from "./sortAndFilter";

export const TopBar = ({
  showDetails,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  sortBy,
  setSortBy,
  selectedFilters,
  setSelectedFilters,
  filteredCount,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [filterOpen, setFilterOpen] = useState(false);

  // Hide search on mobile when showing details
  const showSearch = !isMobile || !showDetails;

  return (
    <Flex
      direction="column"
      w="100%"
    >
      {/* Tabs - Segmented Control Style */}
      <Flex
        w="100%"
        justify="center"
        align="center"
        py="16px"
        px="16px"
        bg="white"
      >
        <Tabs.Root
          value={activeTab}
          onValueChange={(e) => onTabChange(e.value)}
          variant="plain"
          fitted
          w="100%"
        >
          <Tabs.List
            bg="#F3F4F6"
            borderRadius="8px"
            p="4px"
            gap="4px"
            h="auto"
          >
            <Tabs.Trigger
              value="all"
              flex="1"
              gap="8px"
              fontWeight={500}
              fontSize="14px"
              color="#6B7280"
              justifyContent="center"
              borderRadius="6px"
              py="8px"
              px="12px"
              transition="all 0.2s"
              border="none"
              _selected={{
                bg: "white",
                color: "#111827",
                borderBottom: "none",
              }}
            >
              <LuCalendarDays />
              All Events
            </Tabs.Trigger>
            <Tabs.Trigger
              value="my"
              flex="1"
              gap="8px"
              fontWeight={500}
              fontSize="14px"
              color="#6B7280"
              justifyContent="center"
              borderRadius="6px"
              py="8px"
              px="12px"
              transition="all 0.2s"
              border="none"
              _selected={{
                bg: "white",
                color: "#111827",
                borderBottom: "none",
              }}
            >
              <LuUserCheck />
              My Events
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </Flex>

      {/* Sort/Filter + Search */}
      {showSearch && (
        <Flex
          w="100%"
          px="16px"
          py="12px"
          gap="12px"
          align="center"
          bg="white"
        >
          {isMobile ? (
            <IconButton
              aria-label="Sort and Filter"
              backgroundColor="#DBEAFE"
              color="#173DA6"
              borderRadius="8px"
              border="1px solid #BFDBFE"
              size="md"
              w="44px"
              h="44px"
              flexShrink={0}
              _hover={{ backgroundColor: "#BFDBFE" }}
              onClick={() => setFilterOpen(true)}
            >
              <LuSettings2 />
            </IconButton>
          ) : (
            <Button
              backgroundColor="#DBEAFE"
              color="#173DA6"
              borderRadius="8px"
              border="1px solid #BFDBFE"
              px="16px"
              h="40px"
              fontSize="14px"
              fontWeight={500}
              flexShrink={0}
              _hover={{ backgroundColor: "#BFDBFE" }}
              onClick={() => setFilterOpen(true)}
            >
              <LuSettings2 />
              Sort and Filter
            </Button>
          )}

          <SortAndFilter
            open={filterOpen}
            onOpenChange={setFilterOpen}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            filteredCount={filteredCount}
          />

          <InputGroup
            flex="1"
            startElement={<FaMagnifyingGlass color="#9CA3AF" />}
          >
            <Input
              placeholder="Search for an event..."
              backgroundColor="white"
              borderColor="#D1D5DB"
              borderRadius="8px"
              h="44px"
              fontSize="14px"
              _placeholder={{ color: "#9CA3AF" }}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </InputGroup>
        </Flex>
      )}
    </Flex>
  );
};
