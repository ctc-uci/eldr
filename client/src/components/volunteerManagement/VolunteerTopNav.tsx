import { useRef, useState } from "react";

import { Box, Heading } from "@chakra-ui/react";

import { FilterDrawer } from "./FilterDrawer";
import { VolunteerManagementView } from "./VolunteerManagementView";
import { VolunteerToolbar } from "./VolunteerToolbar";

export const VolunteerTopNav = () => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
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

      <VolunteerManagementView debouncedQuery={debouncedQuery} />

      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        totalCount={0}
      />
    </Box>
  );
};
