import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

export default function VolunteerTopNav() {
  return (
    <Box>
      {/* Title line */}
      <Box px={6} pt={4} pb={1}>
        <Text fontSize="sm" color="blue.500">
          Volunteer Profile Management
        </Text>
      </Box>

      {/* Brand + avatar icon */}
      <Flex px={6} py={4} align="center">
        <Text fontWeight="700">ELDR</Text>
        <Box flex="1" />
        <Box
          w="26px"
          h="26px"
          borderWidth="1px"
          borderColor="gray.700"
          borderRadius="full"
        />
      </Flex>

      {/* Tabs */}
      <Flex
        px={6}
        borderBottom="2px solid"
        borderColor="gray.800"
        gap={10}
        align="flex-end"
      >
        <Box pb={2} borderBottom="3px solid" borderColor="gray.800">
          <Text fontSize="sm" fontWeight="700">
            Profiles
          </Text>
        </Box>

        <Box pb={2}>
          <Text fontSize="sm">Cases</Text>
        </Box>

        <Box pb={2}>
          <Text fontSize="sm">Clinics & Workshops</Text>
        </Box>

        <Box pb={2}>
          <Text fontSize="sm">Settings</Text>
        </Box>
      </Flex>
    </Box>
  );
}
