import { Box, Flex, Heading, Tabs } from "@chakra-ui/react";
import { LuArchive, LuBriefcase } from "react-icons/lu";
import { LuCircleUser } from "react-icons/lu";

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
        defaultValue="volunteers"
      >
        <Tabs.List>
          <Tabs.Trigger value="archived">
            <Flex align="center" gap={1}><LuArchive /> Archived</Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="volunteers">
            <Flex align="center" gap={1}><LuCircleUser /> Volunteer</Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="staff">
            <Flex align="center" gap={1}><LuBriefcase /> Staff</Flex>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="archived">
          <p>archived!</p>
        </Tabs.Content>
        <Tabs.Content value="volunteers">
          <VolunteerManagementView />
        </Tabs.Content>
        <Tabs.Content value="staff">
          <p>staff!</p>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};
