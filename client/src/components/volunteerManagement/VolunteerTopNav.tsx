import { Box, Flex, Tabs, Text } from "@chakra-ui/react";
import { VolunteerManagementView } from "./VolunteerManagementView";

export const VolunteerTopNav = () => {
  return (
    <Box>
      <Flex px={6} py={4} align="center">
        <Text fontWeight="700">ELDR</Text>
        <Box flex="1" />
        <Box w="26px" h="26px" borderWidth="1px" borderColor="gray.700" borderRadius="full" />
      </Flex>

      <Tabs.Root defaultValue="profiles" fitted>
        <Tabs.List>
          <Tabs.Trigger value="profiles">Profiles</Tabs.Trigger>
          <Tabs.Trigger value="cases">Cases</Tabs.Trigger>
          <Tabs.Trigger value="clinics">Clinics & Workshops</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="profiles">
          <VolunteerManagementView />
        </Tabs.Content>
        <Tabs.Content value="cases">
          <p>two!</p>
        </Tabs.Content>
        <Tabs.Content value="clinics">
          <p>three!</p>
        </Tabs.Content>
        <Tabs.Content value="settings">
          <p>Settings</p>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};
