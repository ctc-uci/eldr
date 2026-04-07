import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  NativeSelect,
  SimpleGrid,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { FiCheck, FiX } from "react-icons/fi";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { Volunteer } from "@/types/volunteer";
import { ProfileField, ProfilePanelShell } from "./ProfilePanelShell";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VolunteerProfileFormData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: string;
  experienceLevel: string;
  areasOfPractice?: string[];
  roles?: string[];
  affiliatedEmployer?: string;
  lawSchoolYear?: string;
  stateBarCertificate?: string;
  stateBarNumber?: string;
  isNotary?: boolean | null;
}

interface LanguageOption { id: number; language: string; }
interface LanguageEntry { languageId: number; language: string; proficiency: string; }
interface AreaOption { id: number; areasOfPractice: string; }
interface AreaEntry { id: number | null; name: string; }
interface RoleOption { id: number; roleName: string; }
interface RoleEntry { id: number; roleName: string; }

interface FormState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
  notaryStatus: string;
  lawSchoolYear: string;
  stateBarCertState: string;
  stateBarNumber: string;
  affiliated: string;
}

interface VolunteerProfilePanelProps {
  variant?: string;
  showBack?: boolean;
  onBack?: () => void;
  onConfirm?: (data: VolunteerProfileFormData) => Promise<void> | void;
  volunteer?: Volunteer | null;
}

// ---------------------------------------------------------------------------
// VolunteerProfilePanel
// ---------------------------------------------------------------------------

const PROFICIENCY_OPTIONS = ["Native", "Fluent", "Advanced", "Intermediate", "Elementary"];
const LAW_SCHOOL_YEARS = ["1L", "2L", "3L", "Graduate"];

export const VolunteerProfilePanel = ({
  variant = "profile",
  onBack,
  volunteer,
  onConfirm,
}: VolunteerProfilePanelProps) => {
  const { backend } = useBackendContext();

  // View mode
  const [languages, setLanguages] = useState<{ language: string; proficiency: string }[]>([]);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", phoneNumber: "", email: "", role: "",
    notaryStatus: "", lawSchoolYear: "", stateBarCertState: "", stateBarNumber: "", affiliated: "",
  });
  const [editLanguages, setEditLanguages] = useState<LanguageEntry[]>([]);
  const [originalLanguageIds, setOriginalLanguageIds] = useState<number[]>([]);
  const [editInterests, setEditInterests] = useState<AreaEntry[]>([]);
  const [originalInterestIds, setOriginalInterestIds] = useState<number[]>([]);
  const [interestInput, setInterestInput] = useState("");

  // Role edit state
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [editRoles, setEditRoles] = useState<RoleEntry[]>([]);
  const [originalRoleIds, setOriginalRoleIds] = useState<number[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  // Reference data
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([]);
  const [areaOptions, setAreaOptions] = useState<AreaOption[]>([]);

  useEffect(() => {
    backend.get<LanguageOption[]>("/languages")
      .then((res) => setLanguageOptions(res.data))
      .catch(() => {});
    backend.get<AreaOption[]>("/areas-of-practice")
      .then((res) => setAreaOptions(res.data))
      .catch(() => {});
    backend.get<RoleOption[]>("/roles")
      .then((res) => setRoleOptions(res.data))
      .catch(() => {});
  }, [backend]);

  const volunteerId = volunteer?.id;

  useEffect(() => {
    if (!volunteerId) return;
    setIsEditing(false);
    setIsSaved(false);
    backend
      .get<{ id: number; language: string; proficiency: string }[]>(`/volunteers/${volunteerId}/languages`)
      .then((res) => setLanguages(res.data.map((l) => ({ language: l.language, proficiency: l.proficiency }))))
      .catch(() => setLanguages([]));
  }, [volunteerId, backend]);

  const setField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const enterEditMode = async () => {
    if (!volunteer) return;
    setForm({
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      phoneNumber: volunteer.phoneNumber ?? "",
      email: volunteer.email,
      role: volunteer.roles?.[0] ?? volunteer.role ?? "",
      notaryStatus: volunteer.isNotary === true ? "active" : volunteer.isNotary === false ? "inactive" : "",
      lawSchoolYear: volunteer.lawSchoolYear ?? "",
      stateBarCertState: volunteer.stateBarCertificate ?? "",
      stateBarNumber: volunteer.stateBarNumber ?? "",
      affiliated: volunteer.affiliatedEmployer ?? "",
    });
    try {
      const res = await backend.get<{ areaOfPracticeId: number; areasOfPractice: string }[]>(
        `/volunteers/${volunteer.id}/areas-of-practice`
      );
      setEditInterests(res.data.map((a) => ({ id: a.areaOfPracticeId, name: a.areasOfPractice })));
      setOriginalInterestIds(res.data.map((a) => a.areaOfPracticeId));
    } catch {
      setEditInterests([]);
      setOriginalInterestIds([]);
    }
    setInterestInput("");

    try {
      const res = await backend.get<RoleEntry[]>(`/volunteers/${volunteer.id}/roles`);
      setEditRoles(res.data);
      setOriginalRoleIds(res.data.map((r) => r.id));
    } catch {
      setEditRoles([]);
      setOriginalRoleIds([]);
    }
    setSelectedRoleId("");

    try {
      const res = await backend.get<{ id: number; language: string; proficiency: string }[]>(
        `/volunteers/${volunteer.id}/languages`
      );
      const mapped = res.data.map((l) => ({ languageId: l.id, language: l.language, proficiency: l.proficiency }));
      setEditLanguages(mapped.length > 0 ? mapped : [{ languageId: 0, language: "", proficiency: "" }]);
      setOriginalLanguageIds(res.data.map((l) => l.id));
    } catch {
      setEditLanguages([{ languageId: 0, language: "", proficiency: "" }]);
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!volunteer) return;

    await backend.put(`/volunteers/${volunteer.id}`, {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone_number: form.phoneNumber,
      is_notary: form.notaryStatus === "active" ? true : form.notaryStatus === "inactive" ? false : null,
      affiliated_employer: form.affiliated || null,
      law_school_year: form.lawSchoolYear || null,
      state_bar_certificate: form.stateBarCertState || null,
      state_bar_number: form.stateBarNumber || null,
    });

    const validLanguages = editLanguages.filter((l) => l.languageId !== 0);
    const currentLanguageIds = validLanguages.map((l) => l.languageId);
    const removedLanguageIds = originalLanguageIds.filter((id) => !currentLanguageIds.includes(id));

    await Promise.all(
      removedLanguageIds.map((id) =>
        backend.delete(`/volunteers/${volunteer.id}/languages/${id}`)
      )
    );

    if (validLanguages.length > 0) {
      await backend.post(`/volunteers/${volunteer.id}/languages`, {
        languages: validLanguages.map((l) => ({
          languageId: l.languageId,
          proficiency: l.proficiency || "proficient",
          isLiterate: true,
        })),
      });
    }

    const currentRoleIds = editRoles.map((r) => r.id);
    const rolesToAdd = currentRoleIds.filter((id) => !originalRoleIds.includes(id));
    const rolesToRemove = originalRoleIds.filter((id) => !currentRoleIds.includes(id));
    await Promise.all([
      ...rolesToAdd.map((id) => backend.post(`/volunteers/${volunteer.id}/roles`, { roleId: id })),
      ...rolesToRemove.map((id) => backend.delete(`/volunteers/${volunteer.id}/roles/${id}`)),
    ]);

    // Resolve null-id interests: match by name or create new area
    const resolvedInterests: { id: number; name: string }[] = [];
    for (const interest of editInterests) {
      if (interest.id !== null) {
        resolvedInterests.push({ id: interest.id, name: interest.name });
      } else {
        const existing = areaOptions.find(
          (a) => a.areasOfPractice.toLowerCase() === interest.name.toLowerCase()
        );
        if (existing) {
          resolvedInterests.push({ id: existing.id, name: existing.areasOfPractice });
        } else {
          try {
            const res = await backend.post<{ id: number; areasOfPractice: string }>(
              "/areas-of-practice",
              { areaOfPractice: interest.name }
            );
            const newId = res.data.id;
            resolvedInterests.push({ id: newId, name: interest.name });
            setAreaOptions((prev) => [...prev, { id: newId, areasOfPractice: interest.name }]);
          } catch (err) {
            console.error("Failed to create area of practice:", err);
          }
        }
      }
    }

    const currentInterestIds = resolvedInterests.map((a) => a.id);
    const interestsToAdd = currentInterestIds.filter((id) => !originalInterestIds.includes(id));
    const interestsToRemove = originalInterestIds.filter((id) => !currentInterestIds.includes(id));

    await Promise.all([
      ...interestsToAdd.map((id) => backend.post(`/volunteers/${volunteer.id}/areas-of-practice`, { areaOfPracticeId: id })),
      ...interestsToRemove.map((id) => backend.delete(`/volunteers/${volunteer.id}/areas-of-practice/${id}`)),
    ]);

    // Optimistically update view mode state
    setLanguages(
      validLanguages.map((l) => ({
        language: l.language,
        proficiency: l.proficiency,
      }))
    );

    setIsEditing(false);
    setIsSaved(true);
    await onConfirm?.({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      role: editRoles[0]?.roleName ?? form.role,
      roles: editRoles.map((r) => r.roleName),
      experienceLevel: volunteer.experienceLevel ?? "",
      areasOfPractice: resolvedInterests.map((a) => a.name),
      affiliatedEmployer: form.affiliated || undefined,
      lawSchoolYear: form.lawSchoolYear || undefined,
      stateBarCertificate: form.stateBarCertState || undefined,
      stateBarNumber: form.stateBarNumber || undefined,
      isNotary: form.notaryStatus === "active" ? true : form.notaryStatus === "inactive" ? false : null,
    });
  };

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

  const interests = volunteer.areasOfPractice ?? [];

  return (
    <ProfilePanelShell
      name={`${volunteer.firstName} ${volunteer.lastName}`}
      onBack={onBack}
      isEditing={isEditing}
      isSaved={isSaved}
      onEditToggle={enterEditMode}
      onSave={handleSave}
    >
      {/* Confidential Form Verified */}
      <Flex
        borderWidth="1px"
        borderColor={volunteer.isSignedConfidentiality ? "gray.300" : "orange.300"}
        bg={volunteer.isSignedConfidentiality ? "white" : "orange.50"}
        borderRadius="md"
        w="fit-content"
        px={3}
        py={2}
        mb={4}
        align="center"
        gap={2}
      >
        <Icon
          as={volunteer.isSignedConfidentiality ? FiCheck : FiX}
          boxSize={4}
          color={volunteer.isSignedConfidentiality ? "inherit" : "orange.500"}
        />
        <Text fontWeight="bold" fontSize="sm" color={volunteer.isSignedConfidentiality ? "inherit" : "orange.600"}>
          {volunteer.isSignedConfidentiality ? "Confidential Form Verified" : "Confidential Form Not Signed"}
        </Text>
      </Flex>

      <Tabs.Root defaultValue="profile" variant="enclosed" mb={4}>
        <Tabs.List w="100%">
          <Tabs.Trigger value="profile" w="100%" h="8">Profile Information</Tabs.Trigger>
          <Tabs.Trigger value="occupation" w="100%" h="8">Occupation &amp; Credentials</Tabs.Trigger>
        </Tabs.List>

        {/* ── Profile Information ── */}
        <Tabs.Content value="profile" pt={6}>
          {isEditing ? (
            <SimpleGrid columns={2} gap={4} maxW="560px">
              {(["firstName", "lastName", "phoneNumber", "email"] as const).map((key) => (
                <Box key={key}>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>
                    {key === "phoneNumber" ? "Phone Number" : key === "firstName" ? "First Name" : key === "lastName" ? "Last Name" : "Email"}
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
              <Box gridColumn="span 2">
                <Text fontSize="sm" fontWeight="bold" mb={2}>Role</Text>
                <Flex gap={2} wrap="wrap" mb={2}>
                  {editRoles.map((r) => (
                    <Flex key={r.id} align="center" gap={1} px={2} py={0.5} bg="gray.100" borderRadius="sm" fontSize="sm">
                      {r.roleName}
                      <Icon as={FiX} boxSize={3} cursor="pointer" color="gray.400" _hover={{ color: "gray.700" }} onClick={() => setEditRoles((prev) => prev.filter((x) => x.id !== r.id))} />
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
                        .map((o) => <option key={o.id} value={o.id}>{o.roleName}</option>)}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={!selectedRoleId}
                    onClick={() => {
                      const id = Number(selectedRoleId);
                      const option = roleOptions.find((o) => o.id === id);
                      if (option) {
                        setEditRoles((prev) => [...prev, { id: option.id, roleName: option.roleName }]);
                        setSelectedRoleId("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </Flex>
              </Box>
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={2} gap={6} maxW="560px">
              <ProfileField label="First Name" value={volunteer.firstName} />
              <ProfileField label="Last Name" value={volunteer.lastName} />
              <ProfileField label="Phone Number" value={volunteer.phoneNumber || ""} />
              <ProfileField label="Email" value={volunteer.email} />
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Role</Text>
                <Text fontSize="sm" color="gray.500">{volunteer.roles?.join(", ") || volunteer.role || "—"}</Text>
              </Box>
            </SimpleGrid>
          )}
        </Tabs.Content>

        {/* ── Occupation & Credentials ── */}
        <Tabs.Content value="occupation" pt={6}>
          {isEditing ? (
            <Box>
              {/* Affiliated Employer/Education */}
              <Box mb={5}>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Affiliated Employer/Education</Text>
                <Input
                  size="sm"
                  borderColor="#E4E4E7"
                  placeholder="Type here"
                  _placeholder={{ color: "#A1A1AA" }}
                  value={form.affiliated}
                  onChange={setField("affiliated")}
                />
              </Box>

              {/* Notary / Law School Year */}
              <SimpleGrid columns={2} gap={4} maxW="560px" mb={5}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>Notary Status</Text>
                  <NativeSelect.Root borderColor="#E4E4E7" size="sm">
                    <NativeSelect.Field
                      placeholder="Select"
                      color={!form.notaryStatus ? "#A1A1AA" : "inherit"}
                      value={form.notaryStatus}
                      onChange={setField("notaryStatus")}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="none">None</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>Law School Year</Text>
                  <NativeSelect.Root borderColor="#E4E4E7" size="sm">
                    <NativeSelect.Field
                      placeholder="Select"
                      color={!form.lawSchoolYear ? "#A1A1AA" : "inherit"}
                      value={form.lawSchoolYear}
                      onChange={setField("lawSchoolYear")}
                    >
                      {LAW_SCHOOL_YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>

                {/* State Bar Certificate / Number */}
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>State Bar Certificate</Text>
                  <Input
                    size="sm"
                    borderColor="#E4E4E7"
                    placeholder="e.g. California, United States"
                    _placeholder={{ color: "#A1A1AA" }}
                    value={form.stateBarCertState}
                    onChange={setField("stateBarCertState")}
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>State Bar Number</Text>
                  <Input
                    size="sm"
                    borderColor="#E4E4E7"
                    placeholder="Enter number"
                    _placeholder={{ color: "#A1A1AA" }}
                    value={form.stateBarNumber}
                    onChange={setField("stateBarNumber")}
                  />
                </Box>
              </SimpleGrid>

              {/* Languages */}
              <Box mb={5}>
                <Text fontSize="sm" fontWeight="bold" mb={2}>Languages</Text>
                <Box borderWidth="1px" borderColor="#E4E4E7" borderRadius="md" p={4}>
                  <Text fontSize="sm" color="gray.500" mb={3}>
                    Select the languages and your proficiency level
                  </Text>
                  {editLanguages.map((entry, i) => (
                    <Flex key={i} gap={2} mb={2} align="center">
                      <NativeSelect.Root borderColor="#E4E4E7" flex={1} size="sm">
                        <NativeSelect.Field
                          placeholder="Language"
                          color={!entry.languageId ? "#A1A1AA" : "inherit"}
                          value={entry.languageId || ""}
                          onChange={(e) => {
                            const id = Number(e.target.value);
                            const lang = languageOptions.find((l) => l.id === id);
                            setEditLanguages((prev) =>
                              prev.map((l, idx) =>
                                idx === i ? { ...l, languageId: id, language: lang?.language ?? "" } : l
                              )
                            );
                          }}
                        >
                          {languageOptions.map((l) => (
                            <option key={l.id} value={l.id}>{l.language}</option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      <NativeSelect.Root borderColor="#E4E4E7" flex={1} size="sm">
                        <NativeSelect.Field
                          placeholder="Proficiency"
                          color={!entry.proficiency ? "#A1A1AA" : "inherit"}
                          value={entry.proficiency}
                          onChange={(e) =>
                            setEditLanguages((prev) =>
                              prev.map((l, idx) =>
                                idx === i ? { ...l, proficiency: e.target.value } : l
                              )
                            )
                          }
                        >
                          {PROFICIENCY_OPTIONS.map((p) => (
                            <option key={p} value={p.toLowerCase()}>{p}</option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      {editLanguages.length > 1 && (
                        <Icon
                          as={FiX}
                          boxSize={3}
                          cursor="pointer"
                          color="gray.400"
                          _hover={{ color: "gray.700" }}
                          onClick={() =>
                            setEditLanguages((prev) => prev.filter((_, idx) => idx !== i))
                          }
                        />
                      )}
                    </Flex>
                  ))}
                  <Button
                    size="xs"
                    variant="ghost"
                    color="blue.500"
                    mt={2}
                    gap={1}
                    onClick={() =>
                      setEditLanguages((prev) => [...prev, { languageId: 0, language: "", proficiency: "" }])
                    }
                  >
                    + Add Language
                  </Button>
                </Box>
              </Box>

              {/* Interests */}
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>Interest(s)</Text>
                <Box borderWidth="1px" borderColor="#E4E4E7" borderRadius="md" p={3}>
                  <Flex gap={2} wrap="wrap" align="center">
                    {editInterests.map((interest, idx) => (
                      <Flex
                        key={idx}
                        align="center"
                        gap={1}
                        px={2}
                        py={0.5}
                        bg="gray.100"
                        borderRadius="sm"
                        fontSize="sm"
                      >
                        {interest.name}
                        <Icon
                          as={FiX}
                          boxSize={3}
                          cursor="pointer"
                          color="gray.400"
                          _hover={{ color: "gray.700" }}
                          onClick={() => setEditInterests((prev) => prev.filter((_, i) => i !== idx))}
                        />
                      </Flex>
                    ))}
                    <Flex align="center" gap={1}>
                      <Input
                        size="xs"
                        placeholder="Add tag..."
                        border="none"
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && interestInput.trim()) {
                            e.preventDefault();
                            const name = interestInput.trim();
                            if (!editInterests.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
                              setEditInterests((prev) => [...prev, { id: null, name }]);
                            }
                            setInterestInput("");
                          }
                        }}
                        w="100px"
                        color="black"
                        _placeholder={{ color: "#A1A1AA" }}
                      />
                      {interestInput && (
                        <Icon
                          as={FiX}
                          boxSize={3}
                          cursor="pointer"
                          color="gray.400"
                          onClick={() => setInterestInput("")}
                        />
                      )}
                    </Flex>
                  </Flex>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Affiliated Employer/Education</Text>
                <Text fontSize="sm" color="gray.500">{volunteer.affiliatedEmployer || "—"}</Text>
              </Box>

              <SimpleGrid columns={2} gap={6} maxW="560px" mb={6}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>Notary Status</Text>
                  <Text fontSize="sm" color="gray.500">
                    {volunteer.isNotary === true ? "Active" : volunteer.isNotary === false ? "Inactive" : "—"}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>Law School Year</Text>
                  <Text fontSize="sm" color="gray.500">{volunteer.lawSchoolYear || "—"}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>State Bar Certificate</Text>
                  <Text fontSize="sm" color="gray.500">{volunteer.stateBarCertificate || "—"}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>State Bar Number</Text>
                  <Text fontSize="sm" color="gray.500">{volunteer.stateBarNumber || "—"}</Text>
                </Box>
              </SimpleGrid>

              {/* Languages */}
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={2}>Languages</Text>
                <Box borderWidth="1px" borderColor="#E4E4E7" borderRadius="xl" p={5} justifyContent="center" maxWidth="400px">
                  {languages.length > 0 ? (
                    languages.map((entry, i) => (
                      <SimpleGrid key={i} columns={2} px={2} py={1.5}>
                        <Text fontSize="sm">{entry.language}</Text>
                        <Text fontSize="sm">{entry.proficiency ? entry.proficiency.charAt(0).toUpperCase() + entry.proficiency.slice(1) : "—"}</Text>
                      </SimpleGrid>
                    ))
                  ) : (
                    <Text fontSize="sm" color="gray.500" px={2}>—</Text>
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
                        <Flex
                          key={s}
                          align="center"
                          gap={1}
                          px={3}
                          py={1}
                          bg="gray.100"
                          borderRadius="sm"
                          fontSize="sm"
                        >
                          {s}
                        </Flex>
                      ))}
                    </Flex>
                  ) : (
                    <Text fontSize="sm" color="gray.500">—</Text>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </ProfilePanelShell>
  );
};
