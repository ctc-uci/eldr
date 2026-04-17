import { useMemo, useState } from "react";

import {
  Button,
  Flex,
  IconButton,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";

import { ListFilter } from "lucide-react";
import { LuCalendarDays, LuUserCheck } from "react-icons/lu";

import SearchBar from "./searchBar";
import { SortAndFilter } from "./sortAndFilter";

export const TopBar = ({
  showDetails,
  activeTab,
  onTabChange,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  selectedFilters,
  setSelectedFilters,
  filteredCount,
  events,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [filterOpen, setFilterOpen] = useState(false);

  const hasAppliedFilters = useMemo(() => {
    if (!selectedFilters) return false;

    return Object.values(selectedFilters).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== "";
    });
  }, [selectedFilters]);

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
              aria-label="Filter"
              backgroundColor={hasAppliedFilters ? "#DBEAFE" : "#F4F4F5"}
              color={hasAppliedFilters ? "#173DA6" : "black"}
              borderRadius="8px"
              border={
                hasAppliedFilters ? "1px solid #BFDBFE" : "1px solid #E4E4E7"
              }
              size="md"
              w="44px"
              h="44px"
              flexShrink={0}
              _hover={{
                backgroundColor: hasAppliedFilters ? "#BFDBFE" : "#E4E4E7",
              }}
              onClick={() => setFilterOpen(true)}
            >
              <ListFilter />
            </IconButton>
          ) : (
            <Button
              backgroundColor={hasAppliedFilters ? "#DBEAFE" : "#F4F4F5"}
              color={hasAppliedFilters ? "#173DA6" : "black"}
              borderRadius="8px"
              border={
                hasAppliedFilters ? "1px solid #BFDBFE" : "1px solid #E4E4E7"
              }
              px="16px"
              h="40px"
              fontSize="14px"
              fontWeight={500}
              flexShrink={0}
              _hover={{
                backgroundColor: hasAppliedFilters ? "#BFDBFE" : "#E4E4E7",
              }}
              onClick={() => setFilterOpen(true)}
            >
              <ListFilter />
              Filter
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

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            events={events}
            isMobile
          />
        </Flex>
      )}
    </Flex>
  );
};
