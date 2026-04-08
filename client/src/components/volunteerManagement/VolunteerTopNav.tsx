import { useRef, useState } from "react";

import { Box, Heading } from "@chakra-ui/react";

import { FilterDrawer, FilterState } from "./FilterDrawer";
import { VolunteerManagementView } from "./VolunteerManagementView";
import { VolunteerToolbar } from "./VolunteerToolbar";

const EMPTY_FILTERS: FilterState = { roles: new Set(), interests: new Set(), languages: new Set() };

export const VolunteerTopNav = () => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 250);
  };

  return (
    <Box p={6}>
      <Heading size="2xl" mb={10}>
        User Management
      </Heading>

      <VolunteerToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFilterOpen={() => setFilterDrawerOpen(true)}
      />

      <VolunteerManagementView debouncedQuery={debouncedQuery} filters={filters} />

      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        totalCount={0}
        onApply={(f) => setFilters(f)}
      />
    </Box>
  );
};
