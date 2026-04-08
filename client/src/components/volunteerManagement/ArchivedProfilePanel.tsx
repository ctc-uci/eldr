import { useEffect, useState } from "react";

import { Box, Button, Flex, Icon, Input, NativeSelect, SimpleGrid, Tabs, Text, Textarea } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { ArchivedVolunteer } from "@/types/volunteer";
import { ProfileField, ProfilePanelShell } from "./ProfilePanelShell";

export interface ArchivedProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  reactivation: string;
  archivedNotes: string;
  roles?: string[];
}

interface ArchivedProfilePanelProps {
  volunteer: ArchivedVolunteer | null;
  onBack?: () => void;
  onConfirm?: (data: ArchivedProfileFormData) => Promise<void> | void;
}

interface FormState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  reactivation: string;
  archivedNotes: string;
}

interface RoleOption { id: number; roleName: string; }
interface RoleEntry { id: number; roleName: string; }

export const ArchivedProfilePanel = ({ volunteer, onBack, onConfirm }: ArchivedProfilePanelProps) => {
  const { backend } = useBackendContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", phoneNumber: "", email: "", reactivation: "", archivedNotes: "",
  });

  // Role editing state
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [editRoles, setEditRoles] = useState<RoleEntry[]>([]);
  const [originalRoleIds, setOriginalRoleIds] = useState<number[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const volunteerId = volunteer?.id;
  const isStaff = volunteer?.source === "staff";

  useEffect(() => {
    setIsEditing(false);
    setIsSaved(false);
  }, [volunteerId]);

  useEffect(() => {
    backend.get<RoleOption[]>("/roles")
      .then((res) => setRoleOptions(res.data))
      .catch(() => {});
  }, [backend]);

  const enterEditMode = async () => {
    if (!volunteer) return;
    setForm({
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      phoneNumber: volunteer.phoneNumber ?? "",
      email: volunteer.email,
      reactivation: volunteer.reactivation ?? "",
      archivedNotes: volunteer.archivedNotes ?? "",
    });

    if (!isStaff) {
      try {
        const res = await backend.get<RoleEntry[]>(`/volunteers/${volunteer.id}/roles`);
        setEditRoles(res.data);
        setOriginalRoleIds(res.data.map((r) => r.id));
      } catch {
        setEditRoles([]);
        setOriginalRoleIds([]);
      }
    }

    setSelectedRoleId("");
    setIsEditing(true);
  };

  const addRole = () => {
    const id = Number(selectedRoleId);
    if (!id) return;
    const option = roleOptions.find((r) => r.id === id);
    if (!option || editRoles.some((r) => r.id === id)) return;
    setEditRoles((prev) => [...prev, { id: option.id, roleName: option.roleName }]);
    setSelectedRoleId("");
  };

  const removeRole = (id: number) => {
    setEditRoles((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = async () => {
    if (!volunteer) return;
    setSaveError(null);
    try {

    const saves: Promise<unknown>[] = [
      isStaff
        ? backend.put(`/admins/${volunteer.id}`, {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
          })
        : backend.put(`/volunteers/${volunteer.id}`, {
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone_number: form.phoneNumber,
          }),
      isStaff
        ? backend.patch(`/admins/${volunteer.id}/archive`, {
            reactivation: form.reactivation || null,
            notes: form.archivedNotes || null,
          })
        : backend.patch(`/volunteers/${volunteer.id}/archive`, {
            reactivation: form.reactivation || null,
            notes: form.archivedNotes || null,
          }),
    ];

    if (!isStaff) {
      const currentIds = editRoles.map((r) => r.id);
      const toAdd = currentIds.filter((id) => !originalRoleIds.includes(id));
      const toRemove = originalRoleIds.filter((id) => !currentIds.includes(id));
      toAdd.forEach((id) => saves.push(backend.post(`/volunteers/${volunteer.id}/roles`, { roleId: id })));
      toRemove.forEach((id) => saves.push(backend.delete(`/volunteers/${volunteer.id}/roles/${id}`)));
    }

    await Promise.all(saves);

    setIsEditing(false);
    setIsSaved(true);
    await onConfirm?.({ ...form, roles: isStaff ? volunteer.roles : editRoles.map((r) => r.roleName) });
    } catch (err) {
      console.error("Failed to save:", err);
      setSaveError("Failed to save changes. Please try again.");
    }
  };

  const setField = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
      breadcrumbLabel="Archived Profile"
      onBack={onBack}
      roles={volunteer.roles}
      isEditing={isEditing}
      isSaved={isSaved}
      onEditToggle={enterEditMode}
      onSave={handleSave}
    >
      {saveError && (
        <Text fontSize="sm" color="red.500" mb={3}>{saveError}</Text>
      )}
      <Tabs.Root defaultValue="profile" variant="enclosed" mb={4}>
        <Tabs.List w="100%">
          <Tabs.Trigger value="profile" w="100%" h="8">Profile Information</Tabs.Trigger>
          <Tabs.Trigger value="record" w="100%" h="8">Record</Tabs.Trigger>
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

              {/* Role editing — volunteers only */}
              <Box gridColumn="span 2">
                <Text fontSize="sm" fontWeight="bold" mb={2}>Role</Text>
                {isStaff ? (
                  <Text fontSize="sm" color="gray.500">{volunteer.roles?.join(", ") || "—"}</Text>
                ) : (
                  <Box>
                    <Flex gap={2} wrap="wrap" mb={2}>
                      {editRoles.map((r) => (
                        <Flex
                          key={r.id}
                          align="center"
                          gap={1}
                          px={2}
                          py={0.5}
                          bg="gray.100"
                          borderRadius="sm"
                          fontSize="sm"
                        >
                          {r.roleName}
                          <Icon
                            as={FiX}
                            boxSize={3}
                            cursor="pointer"
                            color="gray.400"
                            _hover={{ color: "gray.700" }}
                            onClick={() => removeRole(r.id)}
                          />
                        </Flex>
                      ))}
                    </Flex>
                    <Flex gap={2} align="center">
                      <NativeSelect.Root borderColor="#E4E4E7" size="sm" flex={1} maxW="200px">
                        <NativeSelect.Field
                          placeholder="Add role..."
                          color={!selectedRoleId ? "#A1A1AA" : "inherit"}
                          value={selectedRoleId}
                          onChange={(e) => setSelectedRoleId(e.target.value)}
                        >
                          {roleOptions
                            .filter((o) => !editRoles.some((r) => r.id === o.id))
                            .map((o) => (
                              <option key={o.id} value={o.id}>{o.roleName}</option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      <Button size="xs" variant="outline" onClick={addRole} disabled={!selectedRoleId}>
                        Add
                      </Button>
                    </Flex>
                  </Box>
                )}
              </Box>
            </SimpleGrid>
          ) : (
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
          )}
        </Tabs.Content>

        <Tabs.Content value="record" pt={6}>
          {isEditing ? (
            <SimpleGrid columns={2} gap={4} maxW="560px">
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Reactivation</Text>
                <NativeSelect.Root borderColor="#E4E4E7" size="sm">
                  <NativeSelect.Field
                    value={form.reactivation}
                    onChange={(e) => setForm((prev) => ({ ...prev, reactivation: e.target.value }))}
                  >
                    <option value="">—</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Review">Review</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Archived Date</Text>
                <Text fontSize="sm" color="gray.500">{formattedArchivedDate || "—"}</Text>
              </Box>
              <Box gridColumn="span 2">
                <Text fontSize="sm" fontWeight="bold" mb={1}>Note</Text>
                <Textarea
                  size="sm"
                  borderColor="#E4E4E7"
                  value={form.archivedNotes}
                  onChange={setField("archivedNotes")}
                  _placeholder={{ color: "#A1A1AA" }}
                  rows={3}
                />
              </Box>
            </SimpleGrid>
          ) : (
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
          )}
        </Tabs.Content>
      </Tabs.Root>
    </ProfilePanelShell>
  );
};
