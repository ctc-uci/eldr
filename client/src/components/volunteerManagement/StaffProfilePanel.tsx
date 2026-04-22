import { useEffect, useState } from "react";

import { Box, Input, NativeSelect, SimpleGrid, Tabs, Text } from "@chakra-ui/react";

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
  email: string;
  role: string;
  startDate: string;
}

export const StaffProfilePanel = ({ staff, onBack, onSaved }: StaffProfilePanelProps) => {
  const { backend } = useBackendContext();
  const { role } = useRoleContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", phoneNumber: "", email: "", role: "", startDate: "",
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
      email: staff.email,
      role: staff.role,
      startDate: staff.startDate ? staff.startDate.split("T")[0] : "",
    });
    setEditRole(staff.role?.toLowerCase() === "supervisor" ? "supervisor" : "staff");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!staff) return;
    await backend.put(`/admins/${staff.id}`, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      isSupervisor: editRole === "supervisor",
      startDate: form.startDate || null,
    });
    const resolvedRole = editRole === "supervisor" ? "Supervisor" : "Staff";
    setIsEditing(false);
    setIsSaved(true);
    onSaved?.({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phoneNumber || undefined,
      role: resolvedRole,
      startDate: form.startDate || undefined,
    });
  };

  const setField = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  if (!staff) return null;

  const formattedStartDate = staff.startDate
    ? new Date(staff.startDate.split("T")[0] + "T00:00:00").toLocaleDateString("en-US", {
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
      isEditing={isEditing}
      isSaved={isSaved}
      canEdit={role === "supervisor"}
      onEditToggle={enterEditMode}
      onSave={handleSave}
    >
      <Tabs.Root defaultValue="profile" variant="enclosed" mb={4}>
        <Tabs.List w="100%">
          <Tabs.Trigger value="profile" w="100%" h="8">Profile Information</Tabs.Trigger>
          <Tabs.Trigger value="permissions" w="100%" h="8">Permissions</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="profile" pt={6}>
          {isEditing ? (
            <SimpleGrid columns={2} gap={4} maxW="560px">
              {(["firstName", "lastName", "phoneNumber", "email"] as const).map((key) => (
                <Box key={key}>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>
                    {key === "firstName" ? "First Name"
                      : key === "lastName" ? "Last Name"
                      : key === "phoneNumber" ? "Phone Number"
                      : "Email"}
                  </Text>
                  <Input
                    size="sm"
                    borderColor="#E4E4E7"
                    value={form[key]}
                    onChange={setField(key)}
                    _placeholder={{ color: "#A1A1AA" }}
                  />
                </Box>
              ))}
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Role</Text>
                <NativeSelect.Root borderColor="#E4E4E7" size="sm">
                  <NativeSelect.Field value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                    <option value="staff">Staff</option>
                    <option value="supervisor">Supervisor</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Start Date</Text>
                <Input
                  size="sm"
                  type="date"
                  borderColor="#E4E4E7"
                  value={form.startDate}
                  onChange={setField("startDate")}
                />
              </Box>
            </SimpleGrid>
          ) : (
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
          )}
        </Tabs.Content>

        <Tabs.Content value="permissions" pt={6}>
          <Text fontSize="sm" color="gray.500">No permissions configured.</Text>
        </Tabs.Content>
      </Tabs.Root>
    </ProfilePanelShell>
  );
};
