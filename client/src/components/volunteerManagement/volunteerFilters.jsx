import {
  Box,
  Flex,
  Input,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

export default function VolunteerFilters({ query, setQuery, status, setStatus }) {
  return (
    <Box borderWidth="1px" borderRadius="md" p={4}>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        <FormControl>
          <FormLabel>Search</FormLabel>
          <Input
            placeholder="Search name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </FormControl>

        <FormControl maxW="220px">
          <FormLabel>Status</FormLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </FormControl>
      </Flex>
    </Box>
  );
}
