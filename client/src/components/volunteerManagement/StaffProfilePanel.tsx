import { useEffect, useState } from "react";

import {
  Badge,
  Box,
  Checkbox,
  HStack,
  Input,
  NativeSelect,
  SimpleGrid,
  Tabs,
  Text,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";
import { StaffMember } from "@/types/volunteer";

import { ProfileField, ProfilePanelShell } from "./ProfilePanelShell";

interface StaffProfilePanelProps {
  staff: StaffMember | null;
  onBack?: () => void;
  onSaved?: (data: Partial<StaffMember>) => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  isPrimaryMobile: boolean;
  isSecondaryMobile: boolean;
  canText: boolean;
  role: string;
  startDate: string;
}

export const StaffProfilePanel = ({
  staff,
  onBack,
  onSaved,
}: StaffProfilePanelProps) => {
  const { backend } = useBackendContext();
  const { role } = useRoleContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    secondaryPhoneNumber: "",
    isPrimaryMobile: false,
    isSecondaryMobile: false,
    canText: false,
    role: "",
    startDate: "",
  });
  const [editRole, setEditRole] = useState("");

  const staffId = staff?.id;

  useEffect(() => {
    setIsEditing(false);
    setIsSaved(false);
  }, [staffId]);

  const enterEditMode = () => {
    if (!staff) return;
    setForm({
      firstName: staff.firstName,
      lastName: staff.lastName,
      phoneNumber: staff.phoneNumber ?? "",
      secondaryPhoneNumber: staff.secondaryPhoneNumber ?? "",
      isPrimaryMobile: Boolean(staff.isPrimaryMobile),
      isSecondaryMobile: Boolean(staff.isSecondaryMobile),
      canText: Boolean(staff.canText),
      role: staff.role,
      startDate: staff.startDate ? staff.startDate.split("T")[0] : "",
    });
    setEditRole(
      staff.role?.toLowerCase() === "supervisor" ? "supervisor" : "staff"
    );
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!staff) return;
    await backend.put(`/admins/${staff.id}`, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: staff.email,
      phoneNumber: form.phoneNumber || null,
      secondaryPhoneNumber: form.secondaryPhoneNumber || null,
      isPrimaryMobile: form.isPrimaryMobile,
      isSecondaryMobile: form.isSecondaryMobile,
      canText: form.canText,
      isSupervisor: editRole === "supervisor",
      startDate: form.startDate || null,
    });
    const resolvedRole = editRole === "supervisor" ? "Supervisor" : "Staff";
    setIsEditing(false);
    setIsSaved(true);
    onSaved?.({
      firstName: form.firstName,
      lastName: form.lastName,
      email: staff.email,
      phoneNumber: form.phoneNumber || undefined,
      secondaryPhoneNumber: form.secondaryPhoneNumber || undefined,
      isPrimaryMobile: form.isPrimaryMobile,
      isSecondaryMobile: form.isSecondaryMobile,
      canText: form.canText,
      role: resolvedRole,
      startDate: form.startDate || undefined,
    });
  };

  const setField =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  if (!staff) return null;

  const formattedStartDate = staff.startDate
    ? new Date(staff.startDate.split("T")[0] + "T00:00:00").toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      )
    : undefined;

  return (
    <ProfilePanelShell
      name={`${staff.firstName} ${staff.lastName}`}
      breadcrumbLabel="Staff Profile"
      onBack={onBack}
      roles={[staff.role]}
      isEditing={isEditing}
      isSaved={isSaved}
      canEdit={role === "supervisor"}
      onEditToggle={enterEditMode}
      onSave={handleSave}
    >
      <Tabs.Root
        defaultValue="profile"
        variant="enclosed"
        mb={4}
      >
        <Tabs.List w="100%">
          <Tabs.Trigger
            value="profile"
            w="100%"
            h="8"
          >
            Profile Information
          </Tabs.Trigger>
          <Tabs.Trigger
            value="permissions"
            w="100%"
            h="8"
          >
            Permissions
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content
          value="profile"
          pt={6}
        >
          {isEditing ? (
            <SimpleGrid
              columns={2}
              gap={4}
              maxW="560px"
            >
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>
                  First Name
                </Text>
                <Input
                  size="sm"
                  borderColor="#E4E4E7"
                  value={form.firstName}
                  onChange={setField("firstName")}
                  _placeholder={{ color: "#A1A1AA" }}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>
                  Last Name
                </Text>
                <Input
                  size="sm"
                  borderColor="#E4E4E7"
                  value={form.lastName}
                  onChange={setField("lastName")}
                  _placeholder={{ color: "#A1A1AA" }}
                />
              </Box>

              {/* Primary Phone */}
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>
                  Primary Phone
                </Text>
                <Input
                  size="sm"
                  borderColor="#E4E4E7"
                  value={form.phoneNumber}
                  onChange={setField("phoneNumber")}
                  placeholder="Primary phone number"
                  _placeholder={{ color: "#A1A1AA" }}
                />
                <Checkbox.Root
                  checked={form.isPrimaryMobile}
                  onCheckedChange={(e) =>
                    setForm((prev) => ({ ...prev, isPrimaryMobile: !!e.checked }))
                  }
                  colorPalette="blue"
                  size="sm"
                  mt={1.5}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label fontSize="xs" color="gray.600">
                    Mobile number
                  </Checkbox.Label>
                </Checkbox.Root>
              </Box>

              {/* Secondary Phone */}
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>
                  Secondary Phone (Optional)
                </Text>
                <Input
                  size="sm"
                  borderColor="#E4E4E7"
                  value={form.secondaryPhoneNumber}
                  onChange={setField("secondaryPhoneNumber")}
                  placeholder="Secondary phone number"
                  _placeholder={{ color: "#A1A1AA" }}
                />
                <Checkbox.Root
                  checked={form.isSecondaryMobile}
                  onCheckedChange={(e) =>
                    setForm((prev) => ({ ...prev, isSecondaryMobile: !!e.checked }))
                  }
                  colorPalette="blue"
                  size="sm"
                  mt={1.5}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label fontSize="xs" color="gray.600">
                    Mobile number
                  </Checkbox.Label>
                </Checkbox.Root>
              </Box>

              {/* Permission to text */}
              <Box gridColumn="span 2" p={2.5} bg="gray.50" borderRadius="md" border="1px solid" borderColor="#E4E4E7">
                <Checkbox.Root
                  checked={form.canText}
                  onCheckedChange={(e) =>
                    setForm((prev) => ({ ...prev, canText: !!e.checked }))
                  }
                  colorPalette="blue"
                  size="sm"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label fontSize="xs" color="gray.700">
                    Permission to text (applies to callable/textable numbers for California compliance)
                  </Checkbox.Label>
                </Checkbox.Root>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>
                  Email
                </Text>
                <Text fontSize="sm" color="gray.600" py={1.5}>
                  {staff.email}
                </Text>
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  mb={1}
                >
                  User Type
                </Text>
                <NativeSelect.Root
                  borderColor="#E4E4E7"
                  size="sm"
                >
                  <NativeSelect.Field
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  >
                    <option value="staff">Staff</option>
                    <option value="supervisor">Supervisor</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
            </SimpleGrid>
          ) : (
            <SimpleGrid
              columns={2}
              gap={6}
              maxW="560px"
            >
              <ProfileField
                label="First Name"
                value={staff.firstName}
              />
              <ProfileField
                label="Last Name"
                value={staff.lastName}
              />
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Primary Phone</Text>
                <HStack gap={2}>
                  <Text fontSize="sm" color="gray.500">{staff.phoneNumber || "—"}</Text>
                  {staff.isPrimaryMobile && (
                    <Badge size="xs" colorPalette="blue" variant="subtle">Mobile</Badge>
                  )}
                </HStack>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Secondary Phone</Text>
                <HStack gap={2}>
                  <Text fontSize="sm" color="gray.500">{staff.secondaryPhoneNumber || "—"}</Text>
                  {staff.isSecondaryMobile && (
                    <Badge size="xs" colorPalette="blue" variant="subtle">Mobile</Badge>
                  )}
                </HStack>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Permission to Text</Text>
                <Text fontSize="sm" color="gray.500">{staff.canText ? "Yes" : "No"}</Text>
              </Box>
              <ProfileField
                label="Email"
                value={staff.email}
              />
              <ProfileField
                label="User Type"
                value={staff.role}
              />
            </SimpleGrid>
          )}
        </Tabs.Content>

        <Tabs.Content
          value="permissions"
          pt={6}
        >
          <Text
            fontSize="sm"
            color="gray.500"
          >
            No permissions configured.
          </Text>
        </Tabs.Content>
      </Tabs.Root>
    </ProfilePanelShell>
  );
};
