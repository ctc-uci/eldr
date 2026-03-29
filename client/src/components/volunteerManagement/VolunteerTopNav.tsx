import { Box, Flex, Heading, Tabs } from "@chakra-ui/react";
import { LuArchive, LuBriefcase, LuCircleUser } from "react-icons/lu";
import { type ReactNode } from "react";

import { VolunteerManagementView } from "./VolunteerManagementView";

const TABS: { value: string; icon: ReactNode; label: string }[] = [
  { value: "archived", icon: <LuArchive />, label: "Archived" },
  { value: "volunteers", icon: <LuCircleUser />, label: "Volunteer" },
  { value: "staff", icon: <LuBriefcase />, label: "Staff" },
];

export const VolunteerTopNav = () => {
  return (
    <Box p={6}>
      <Heading size="2xl" m={4}>
        User Management
      </Heading>

      <Tabs.Root defaultValue="volunteers" variant="outline">
        <Tabs.List>
          {TABS.map(({ value, icon, label }) => (
            <Tabs.Trigger key={value} value={value} color="#52525B" _selected={{ color: "#27272A", bg: "white" }}>
              <Flex align="center" gap={1}>{icon} {label}</Flex>
            </Tabs.Trigger>
          ))}
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
