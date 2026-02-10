import {
  Box,
  Button,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

export const Playground = () => {
  return (
    <Box
      maxW="900px"
      mx="auto"
      px={6}
      py={8}
      w="100%"
    >
      <VStack align="stretch" gap={6}>
        <HStack justify="space-between" align="start">
          <Box>
            <Heading size="lg">Volunteer Profile</Heading>
            <Text color="fg.muted">Simple mock profile for UI testing</Text>
          </Box>
          <HStack>
            <Button variant="outline">Edit</Button>
            <Button>Save</Button>
          </HStack>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Box borderWidth="1px" borderRadius="md" p={4}>
            <Text fontWeight="semibold" mb={2}>
              Basic Info
            </Text>
            <VStack align="stretch" gap={1}>
              <Text>Name: Jane Doe</Text>
              <Text>Email: jane.doe@email.com</Text>
              <Text>Phone: (949) 555-0198</Text>
              <Text>Role: Volunteer</Text>
            </VStack>
          </Box>

          <Box borderWidth="1px" borderRadius="md" p={4}>
            <Text fontWeight="semibold" mb={2}>
              Availability
            </Text>
            <VStack align="stretch" gap={1}>
              <Text>Preferred Days: Mon, Wed, Fri</Text>
              <Text>Preferred Time: Evenings</Text>
              <Text>Location: Irvine Clinic</Text>
            </VStack>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          <Box borderWidth="1px" borderRadius="md" p={4}>
            <Text fontWeight="semibold">Hours Logged</Text>
            <Text fontSize="2xl">42</Text>
          </Box>
          <Box borderWidth="1px" borderRadius="md" p={4}>
            <Text fontWeight="semibold">Events Joined</Text>
            <Text fontSize="2xl">8</Text>
          </Box>
          <Box borderWidth="1px" borderRadius="md" p={4}>
            <Text fontWeight="semibold">Status</Text>
            <Text fontSize="2xl">Active</Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};