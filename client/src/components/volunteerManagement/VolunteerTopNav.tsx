import { Box, Heading, Tabs } from "@chakra-ui/react";

import { VolunteerManagementView } from "./VolunteerManagementView";

export const VolunteerTopNav = () => {
  return (
    <Box p={6}>
      <Heading
        size="2xl"
        m={4}
      >
        User Management
      </Heading>

      <Tabs.Root
        defaultValue="profiles"
        fitted
      >
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
          <p>settings!</p>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};
