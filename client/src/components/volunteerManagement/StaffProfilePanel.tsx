import { Box, SimpleGrid, Tabs, Text } from "@chakra-ui/react";

import { StaffMember } from "@/types/volunteer";
import { ProfileField, ProfilePanelShell } from "./ProfilePanelShell";

interface StaffProfilePanelProps {
  staff: StaffMember | null;
  onBack?: () => void;
}

export const StaffProfilePanel = ({ staff, onBack }: StaffProfilePanelProps) => {
  if (!staff) return null;

  const formattedStartDate = staff.startDate
    ? new Date(staff.startDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  return (
    <ProfilePanelShell
      name={`${staff.firstName} ${staff.lastName}`}
      breadcrumbLabel="Staff Profile"
      onBack={onBack}
      roles={[staff.role]}
    >
      <Tabs.Root defaultValue="profile" variant="enclosed" mb={4}>
        <Tabs.List w="100%">
          <Tabs.Trigger value="profile" w="100%" h="8">Profile Information</Tabs.Trigger>
          <Tabs.Trigger value="permissions" w="100%" h="8">Permissions</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="profile" pt={6}>
          <SimpleGrid columns={2} gap={6} maxW="560px">
            <ProfileField label="First Name" value={staff.firstName} />
            <ProfileField label="Last Name" value={staff.lastName} />
            <ProfileField label="Phone Number" value={staff.phoneNumber} />
            <ProfileField label="Email" value={staff.email} />
            <ProfileField label="Role" value={staff.role} />
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>Start Date</Text>
              <Text fontSize="sm" color="gray.500">{formattedStartDate || "—"}</Text>
            </Box>
          </SimpleGrid>
        </Tabs.Content>

        <Tabs.Content value="permissions" pt={6}>
          <Text fontSize="sm" color="gray.500">No permissions configured.</Text>
        </Tabs.Content>
      </Tabs.Root>
    </ProfilePanelShell>
  );
};
