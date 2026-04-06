import { useEffect, useState } from "react";

import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { FiCheck } from "react-icons/fi";

import { Volunteer } from "@/types/volunteer";
import { ProfileField, ProfilePanelShell } from "./ProfilePanelShell";

export interface VolunteerProfileFormData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: string;
  experienceLevel: string;
}

interface VolunteerProfilePanelProps {
  variant?: string;
  showBack?: boolean;
  onBack?: () => void;
  onConfirm?: (data: VolunteerProfileFormData) => Promise<void> | void;
  volunteer?: Volunteer | null;
}

export const VolunteerProfilePanel = ({
  variant = "profile",
  onBack,
  volunteer,
}: VolunteerProfilePanelProps) => {
  const [languages, setLanguages] = useState<{ language: string; proficiency: string }[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (volunteer) {
      setLanguages((volunteer.languages ?? []).map((l) => ({ language: l, proficiency: "" })));
      setInterests(volunteer.specializations ?? []);
    }
  }, [volunteer]);

  if (variant === "new") {
    return (
      <Box p={6}>
        <Text>Use the Add Profile page to create a new volunteer.</Text>
      </Box>
    );
  }

  if (!volunteer) {
    return (
      <Box p={6}>
        <Text>Please select a volunteer from the list.</Text>
      </Box>
    );
  }

  return (
    <ProfilePanelShell
      name={`${volunteer.firstName} ${volunteer.lastName}`}
      onBack={onBack}
    >
      {/* Confidential Form Verified */}
      <Flex borderWidth="1px" borderColor="gray.300" borderRadius="md" w="fit-content" px={3} py={2} mb={4} align="center" gap={2}>
        <Icon as={FiCheck} boxSize={4} />
        <Text fontWeight="bold" fontSize="sm">Confidential Form Verified</Text>
      </Flex>

      <Tabs.Root defaultValue="profile" variant="enclosed" mb={4}>
        <Tabs.List w="100%">
          <Tabs.Trigger value="profile" w="100%" h="8">Profile Information</Tabs.Trigger>
          <Tabs.Trigger value="occupation" w="100%" h="8">Occupation & Credentials</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="profile" pt={6}>
          <SimpleGrid columns={2} gap={6} maxW="560px">
            <ProfileField label="First Name" value={volunteer.firstName} />
            <ProfileField label="Last Name" value={volunteer.lastName} />
            <ProfileField label="Phone Number" value={volunteer.phoneNumber || ""} />
            <ProfileField label="Email" value={volunteer.email} />
            <ProfileField label="Role" value={volunteer.role || "Volunteer"} />
          </SimpleGrid>
        </Tabs.Content>

        <Tabs.Content value="occupation" pt={6}>
          <SimpleGrid columns={2} gap={6} maxW="560px" mb={6}>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>Notary Status</Text>
              <Text fontSize="sm" color="gray.500">—</Text>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>Law School Year</Text>
              <Text fontSize="sm" color="gray.500">—</Text>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>State Bar Certificate</Text>
              <Text fontSize="sm" color="gray.500">—</Text>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={1}>State Bar Number</Text>
              <Text fontSize="sm" color="gray.500">—</Text>
            </Box>
          </SimpleGrid>

          {/* Languages */}
          <Box mb={6}>
            <Text fontSize="sm" fontWeight="bold" mb={2}>Languages</Text>
            <Box borderWidth="1px" borderColor="#E4E4E7" borderRadius="md" p={4} maxW="400px">
              {languages.length > 0 ? (
                languages.map((entry, i) => (
                  <SimpleGrid key={i} columns={2} mb={2} gap={2}>
                    <Text fontSize="sm">{entry.language}</Text>
                    <Text fontSize="sm" color="gray.500">{entry.proficiency || "—"}</Text>
                  </SimpleGrid>
                ))
              ) : (
                <Text fontSize="sm" color="gray.500">—</Text>
              )}
            </Box>
          </Box>

          {/* Interests */}
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2}>Interest(s)</Text>
            <Box borderWidth="1px" borderColor="#E4E4E7" borderRadius="md" p={4} maxW="400px">
              {interests.length > 0 ? (
                <Flex gap={2} wrap="wrap">
                  {interests.map((s) => (
                    <Flex key={s} align="center" gap={1} px={3} py={1} bg="gray.100" borderRadius="sm" fontSize="sm">
                      {s}
                    </Flex>
                  ))}
                </Flex>
              ) : (
                <Text fontSize="sm" color="gray.500">—</Text>
              )}
            </Box>
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </ProfilePanelShell>
  );
};
