import { Box, SimpleGrid, Tabs, Text } from "@chakra-ui/react";

import { ArchivedVolunteer } from "@/types/volunteer";
import { ProfileField, ProfilePanelShell } from "./ProfilePanelShell";

export interface ArchivedProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  reactivation: string;
  archivedNotes: string;
}

interface ArchivedProfilePanelProps {
  volunteer: ArchivedVolunteer | null;
  onBack?: () => void;
  onConfirm?: (data: ArchivedProfileFormData) => Promise<void> | void;
}

export const ArchivedProfilePanel = ({ volunteer, onBack }: ArchivedProfilePanelProps) => {
  if (!volunteer) return null;

  const formattedArchivedDate = volunteer.archivedDate
    ? new Date(volunteer.archivedDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  return (
    <ProfilePanelShell
      name={`${volunteer.firstName} ${volunteer.lastName}`}
      onBack={onBack}
      roles={volunteer.roles}
    >
      <Tabs.Root defaultValue="profile" variant="enclosed" mb={4}>
        <Tabs.List w="100%">
          <Tabs.Trigger value="profile" w="100%" h="8">Profile Information</Tabs.Trigger>
          <Tabs.Trigger value="record" w="100%" h="8">Record</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="profile" pt={6}>
          <SimpleGrid columns={2} gap={6} maxW="560px">
            <ProfileField label="First Name" value={volunteer.firstName} />
            <ProfileField label="Last Name" value={volunteer.lastName} />
            <ProfileField label="Phone Number" value={volunteer.phoneNumber} />
            <ProfileField label="Email" value={volunteer.email} />
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>Role</Text>
              <Text fontSize="sm" color="gray.500">{volunteer.roles?.join(", ") || "—"}</Text>
            </Box>
          </SimpleGrid>
        </Tabs.Content>

        <Tabs.Content value="record" pt={6}>
          <SimpleGrid columns={2} gap={6} maxW="560px">
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>Reactivation</Text>
              <Text fontSize="sm" color="gray.500">{volunteer.reactivation || "—"}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>Archived Date</Text>
              <Text fontSize="sm" color="gray.500">{formattedArchivedDate || "—"}</Text>
            </Box>
            <Box gridColumn="span 2">
              <Text fontSize="sm" fontWeight="bold" mb={1}>Note</Text>
              <Text fontSize="sm" color="gray.500">{volunteer.archivedNotes || "—"}</Text>
            </Box>
          </SimpleGrid>
        </Tabs.Content>
      </Tabs.Root>
    </ProfilePanelShell>
  );
};
