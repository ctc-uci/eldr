import { React } from "react";

import {
  Text,
  VStack,
} from "@chakra-ui/react";

export const Sidebar = () => {
  return (
    <VStack align="start" spacing={10} width="259px" pt={2} mr={10} position="sticky" top="40px" height="fit-content">
      <Text fontWeight="bold" fontSize="20px" cursor="pointer">
        About
      </Text>
      <Text fontSize="20px" fontWeight="medium" cursor="pointer">
        Background
      </Text>
      <Text fontSize="20px" fontWeight="medium" cursor="pointer">
        Activity History
      </Text>
      <Text fontSize="20px" fontWeight="medium" cursor="pointer">
        Account Settings
      </Text>
    </VStack>
  )
}