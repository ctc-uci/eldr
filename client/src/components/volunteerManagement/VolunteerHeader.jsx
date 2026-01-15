import { Box, SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react";

export default function VolunteerHeader() {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
      <Box borderWidth="1px" borderRadius="md" p={4}>
        <Stat>
          <StatLabel>Total Volunteers</StatLabel>
          <StatNumber>86</StatNumber>
        </Stat>
      </Box>
      <Box borderWidth="1px" borderRadius="md" p={4}>
        <Stat>
          <StatLabel>Active</StatLabel>
          <StatNumber>71</StatNumber>
        </Stat>
      </Box>
      <Box borderWidth="1px" borderRadius="md" p={4}>
        <Stat>
          <StatLabel>Inactive</StatLabel>
          <StatNumber>15</StatNumber>
        </Stat>
      </Box>
    </SimpleGrid>
  );
}
