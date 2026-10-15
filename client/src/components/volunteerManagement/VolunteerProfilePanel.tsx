import { useEffect, useMemo, useState } from "react";

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
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
  secondaryPhoneNumber?: string;
  isPrimaryMobile?: boolean;
  isSecondaryMobile?: boolean;
  canText?: boolean;
  experienceLevel: string;
  areasOfPractice?: string[];
  roles?: string[];
  affiliatedEmployer?: string;
  lawSchoolYear?: string;
  isCaliforniaLicensed?: boolean;
  stateBarCertificate?: string;
  stateBarNumber?: string;
  isNotary?: boolean | null;
  notaryStatus?: string | null;
}

interface LanguageOption { id: number; language: string; }
interface LanguageEntry {
  languageId: number;
  language: string;
  verbalProficiency: string;
  writtenProficiency: string;
}
interface AreaOption { id: number; areasOfPractice: string; }
interface AreaEntry { id: number | null; name: string; }
interface RoleOption { id: number; roleName: string; }
interface RoleEntry { id: number; roleName: string; }

interface FormState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  isPrimaryMobile: boolean;
  isSecondaryMobile: boolean;
  canText: boolean;
  role: string;
  notaryStatus: string;
  lawSchoolYear: string;
  isCaliforniaLicensed: boolean;
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

import { PROFICIENCY_OPTIONS } from "@eldr/shared";
const LAW_SCHOOL_YEARS = ["1L", "2L", "3L", "Graduate"];

export const VolunteerProfilePanel = ({
  variant = "profile",
  onBack,
  volunteer,
  onConfirm,
}: VolunteerProfilePanelProps) => {
  const { backend } = useBackendContext();

  // View mode
  const [languages, setLanguages] = useState<
    { language: string; verbalProficiency: string; writtenProficiency: string }[]
  >([]);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    secondaryPhoneNumber: "",
    isPrimaryMobile: false,
    isSecondaryMobile: false,
    canText: false,
    role: "",
    notaryStatus: "",
    lawSchoolYear: "",
    isCaliforniaLicensed: false,
    stateBarNumber: "",
    affiliated: "",
  });
  const [editLanguages, setEditLanguages] = useState<LanguageEntry[]>([]);
  const [originalLanguageIds, setOriginalLanguageIds] = useState<number[]>([]);
  const [editInterests, setEditInterests] = useState<AreaEntry[]>([]);
  const [originalInterestIds, setOriginalInterestIds] = useState<number[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);

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

  const interestSuggestions = useMemo(() => {
    const q = interestInput.trim().toLowerCase();
    if (!q) return [];
    return areaOptions
      .map((a) => a.areasOfPractice)
      .filter(
        (name) =>
          name.toLowerCase().includes(q) &&
          !editInterests.some((e) => e.name.toLowerCase() === name.toLowerCase())
      )
      .slice(0, 8);
  }, [areaOptions, interestInput, editInterests]);

  const volunteerId = volunteer?.id;

  useEffect(() => {
    if (!volunteerId) return;
    setIsEditing(false);
    setIsSaved(false);
    backend
      .get<
        {
          id: number;
          language: string;
          verbalProficiency?: string;
          writtenProficiency?: string;
          proficiency?: string;
        }[]
      >(`/volunteers/${volunteerId}/languages`)
      .then((res) =>
        setLanguages(
          res.data.map((l) => ({
            language: l.language,
            verbalProficiency: l.verbalProficiency ?? l.proficiency ?? "",
            writtenProficiency: l.writtenProficiency ?? l.proficiency ?? "",
          }))
        )
      )
      .catch(() => setLanguages([]));
  }, [volunteerId, backend]);

  const setField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const enterEditMode = async () => {
    if (!volunteer) return;
    const currentNotary =
      volunteer.notaryStatus ??
      (volunteer.isNotary === true
        ? "active"
        : volunteer.isNotary === false
          ? "inactive"
          : "no");
    const isCalLicensed = Boolean(
      volunteer.isCaliforniaLicensed ??
        (volunteer.stateBarCertificate?.toLowerCase() === "california" ||
          volunteer.stateBarCertificate?.toLowerCase() === "ca")
    );

    setForm({
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      phoneNumber: volunteer.phoneNumber ?? "",
      secondaryPhoneNumber: volunteer.secondaryPhoneNumber ?? "",
      isPrimaryMobile: Boolean(volunteer.isPrimaryMobile),
      isSecondaryMobile: Boolean(volunteer.isSecondaryMobile),
      canText: Boolean(volunteer.canText),
      role: volunteer.roles?.[0] ?? volunteer.role ?? "",
      notaryStatus: currentNotary,
      lawSchoolYear: volunteer.lawSchoolYear ?? "",
      isCaliforniaLicensed: isCalLicensed,
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
      const res = await backend.get<
        {
          id: number;
          language: string;
          verbalProficiency?: string;
          writtenProficiency?: string;
          proficiency?: string;
        }[]
      >(`/volunteers/${volunteer.id}/languages`);
      const mapped = res.data.map((l) => ({
        languageId: l.id,
        language: l.language,
        verbalProficiency: l.verbalProficiency ?? l.proficiency ?? "Professional",
        writtenProficiency: l.writtenProficiency ?? l.proficiency ?? "Professional",
      }));
      setEditLanguages(
        mapped.length > 0
          ? mapped
          : [{ languageId: 0, language: "", verbalProficiency: "", writtenProficiency: "" }]
      );
      setOriginalLanguageIds(res.data.map((l) => l.id));
    } catch {
      setEditLanguages([
        { languageId: 0, language: "", verbalProficiency: "", writtenProficiency: "" },
      ]);
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!volunteer) return;
    setSaveError(null);
    try {

    await backend.put(`/volunteers/${volunteer.id}`, {
      first_name: form.firstName,
      last_name: form.lastName,
      email: volunteer.email,
      phone_number: form.phoneNumber || null,
      secondary_phone_number: form.secondaryPhoneNumber || null,
      is_primary_mobile: form.isPrimaryMobile,
      is_secondary_mobile: form.isSecondaryMobile,
      can_text: form.canText,
      is_notary: form.notaryStatus === "active",
      notary_status: form.notaryStatus || null,
      affiliated_employer: form.affiliated || null,
      law_school_year: form.lawSchoolYear || null,
      is_california_licensed: form.isCaliforniaLicensed,
      state_bar_certificate: form.isCaliforniaLicensed ? "California" : null,
      state_bar_number: form.isCaliforniaLicensed ? (form.stateBarNumber || null) : null,
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
          verbalProficiency: l.verbalProficiency || "Professional",
          writtenProficiency: l.writtenProficiency || "Professional",
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
        verbalProficiency: l.verbalProficiency,
        writtenProficiency: l.writtenProficiency,
      }))
    );

    setIsEditing(false);
    setIsSaved(true);
    await onConfirm?.({
      firstName: form.firstName,
      lastName: form.lastName,
      email: volunteer.email,
      phoneNumber: form.phoneNumber,
      secondaryPhoneNumber: form.secondaryPhoneNumber || undefined,
      isPrimaryMobile: form.isPrimaryMobile,
      isSecondaryMobile: form.isSecondaryMobile,
      canText: form.canText,
      role: editRoles[0]?.roleName ?? form.role,
      roles: editRoles.map((r) => r.roleName),
      experienceLevel: volunteer.experienceLevel ?? "",
      areasOfPractice: resolvedInterests.map((a) => a.name),
      affiliatedEmployer: form.affiliated || undefined,
      lawSchoolYear: form.lawSchoolYear || undefined,
      isCaliforniaLicensed: form.isCaliforniaLicensed,
      stateBarCertificate: form.isCaliforniaLicensed ? "California" : undefined,
      stateBarNumber: form.isCaliforniaLicensed ? (form.stateBarNumber || undefined) : undefined,
      isNotary: form.notaryStatus === "active",
      notaryStatus: form.notaryStatus || undefined,
    });
    } catch (err) {
      console.error("Failed to save volunteer:", err);
      setSaveError("Failed to save changes. Please try again.");
    }
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
      {saveError && (
        <Text fontSize="sm" color="red.500" mb={3}>{saveError}</Text>
      )}
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
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>First Name</Text>
                <Input
                  size="sm"
                  borderColor="#E4E4E7"
                  value={form.firstName}
                  onChange={setField("firstName")}
                  _placeholder={{ color: "#A1A1AA" }}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Last Name</Text>
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
                <Text fontSize="sm" fontWeight="bold" mb={1}>Primary Phone</Text>
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
                <Text fontSize="sm" fontWeight="bold" mb={1}>Secondary Phone (Optional)</Text>
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

              <Box gridColumn="span 2">
                <Text fontSize="sm" fontWeight="bold" mb={1}>Email</Text>
                <Input
                  size="sm"
                  borderColor="#E4E4E7"
                  value={form.email}
                  onChange={setField("email")}
                  _placeholder={{ color: "#A1A1AA" }}
                />
              </Box>

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
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Primary Phone</Text>
                <HStack gap={2}>
                  <Text fontSize="sm" color="gray.500">{volunteer.phoneNumber || "—"}</Text>
                  {volunteer.isPrimaryMobile && (
                    <Badge size="xs" colorPalette="blue" variant="subtle">Mobile</Badge>
                  )}
                </HStack>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Secondary Phone</Text>
                <HStack gap={2}>
                  <Text fontSize="sm" color="gray.500">{volunteer.secondaryPhoneNumber || "—"}</Text>
                  {volunteer.isSecondaryMobile && (
                    <Badge size="xs" colorPalette="blue" variant="subtle">Mobile</Badge>
                  )}
                </HStack>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Permission to Text</Text>
                <Text fontSize="sm" color="gray.500">{volunteer.canText ? "Yes" : "No"}</Text>
              </Box>
              <ProfileField label="Email" value={volunteer.email} />
              <Box gridColumn="span 2">
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
              {/* Employer or School */}
              <Box mb={5}>
                <Text fontSize="sm" fontWeight="bold" mb={0.5}>Employer or School</Text>
                <Text fontSize="xs" color="gray.500" mb={1.5}>Current workplace or school, not educational history</Text>
                <Input
                  size="sm"
                  borderColor="#E4E4E7"
                  placeholder="e.g. UC Irvine, Legal Aid Foundation"
                  _placeholder={{ color: "#A1A1AA" }}
                  value={form.affiliated}
                  onChange={setField("affiliated")}
                />
              </Box>

              {/* Notary / Law School Year */}
              <SimpleGrid columns={2} gap={4} maxW="560px" mb={5}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>Are you a notary?</Text>
                  <NativeSelect.Root borderColor="#E4E4E7" size="sm">
                    <NativeSelect.Field
                      placeholder="Select"
                      color={!form.notaryStatus ? "#A1A1AA" : "inherit"}
                      value={form.notaryStatus}
                      onChange={setField("notaryStatus")}
                    >
                      <option value="active">Yes (active)</option>
                      <option value="inactive">Yes (inactive)</option>
                      <option value="no">No</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>

                {/* Show Law School Year only if role is Law Student */}
                {editRoles.some((r) => r.roleName.toLowerCase().includes("law student")) && (
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
                )}

                {/* California Bar Admission (toggle + number if active) */}
                <Box gridColumn="span 2" p={3} borderWidth="1px" borderColor="#E4E4E7" borderRadius="md" bg="#FAFAFA">
                  <Checkbox.Root
                    checked={form.isCaliforniaLicensed}
                    onCheckedChange={(e) =>
                      setForm((prev) => ({ ...prev, isCaliforniaLicensed: !!e.checked }))
                    }
                    colorPalette="blue"
                    size="sm"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label fontSize="sm" fontWeight="semibold" color="gray.800">
                      Licensed to practice law in California?
                    </Checkbox.Label>
                  </Checkbox.Root>
                  {form.isCaliforniaLicensed && (
                    <Box mt={3} maxW="280px">
                      <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.700">State Bar Number</Text>
                      <Input
                        size="sm"
                        borderColor="#E4E4E7"
                        bg="white"
                        placeholder="Enter bar number"
                        _placeholder={{ color: "#A1A1AA" }}
                        value={form.stateBarNumber}
                        onChange={setField("stateBarNumber")}
                      />
                    </Box>
                  )}
                </Box>
              </SimpleGrid>

              {/* Languages */}
              <Box mb={5}>
                <Text fontSize="sm" fontWeight="bold" mb={2}>Languages</Text>
                <Box borderWidth="1px" borderColor="#E4E4E7" borderRadius="md" p={4}>
                  <Text fontSize="sm" color="gray.500" mb={3}>
                    Select the languages and your proficiency level
                  </Text>
                  {editLanguages.length > 0 && (
                    <Flex gap={2} mb={2} px={1}>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.500" flex={1.2}>
                        Language
                      </Text>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.500" flex={1}>
                        Verbal Proficiency
                      </Text>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.500" flex={1}>
                        Written Proficiency
                      </Text>
                      {editLanguages.length > 1 && <Box w="12px" />}
                    </Flex>
                  )}
                  {editLanguages.map((entry, i) => (
                    <Flex key={i} gap={2} mb={2} align="center">
                      <NativeSelect.Root borderColor="#E4E4E7" flex={1.2} size="sm">
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
                          placeholder="Verbal"
                          color={!entry.verbalProficiency ? "#A1A1AA" : "inherit"}
                          value={entry.verbalProficiency}
                          onChange={(e) =>
                            setEditLanguages((prev) =>
                              prev.map((l, idx) =>
                                idx === i ? { ...l, verbalProficiency: e.target.value } : l
                              )
                            )
                          }
                        >
                          {PROFICIENCY_OPTIONS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      <NativeSelect.Root borderColor="#E4E4E7" flex={1} size="sm">
                        <NativeSelect.Field
                          placeholder="Written"
                          color={!entry.writtenProficiency ? "#A1A1AA" : "inherit"}
                          value={entry.writtenProficiency}
                          onChange={(e) =>
                            setEditLanguages((prev) =>
                              prev.map((l, idx) =>
                                idx === i ? { ...l, writtenProficiency: e.target.value } : l
                              )
                            )
                          }
                        >
                          {PROFICIENCY_OPTIONS.map((p) => (
                            <option key={p} value={p}>{p}</option>
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
                    variant="ghost"
                    size="sm"
                    color="#2563EB"
                    _hover={{ bg: "transparent", textDecoration: "underline" }}
                    p={0}
                    h="auto"
                    onClick={() =>
                      setEditLanguages((prev) => [
                        ...prev,
                        {
                          languageId: 0,
                          language: "",
                          verbalProficiency: "",
                          writtenProficiency: "",
                        },
                      ])
                    }
                  >
                    + Add Language
                  </Button>
                </Box>
              </Box>

              {/* Practice Areas & Interests */}
              <Box position="relative">
                <Text fontSize="sm" fontWeight="bold" mb={1}>Practice Areas & Interests</Text>
                <Text fontSize="xs" color="gray.400" mb={2}>Select or type areas of law, subjects, and interests</Text>
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
                    <Flex align="center" gap={1} flex={1} minW="160px">
                      <Input
                        size="xs"
                        placeholder="Add tag (type to search existing)..."
                        border="none"
                        value={interestInput}
                        onFocus={() => setShowInterestSuggestions(true)}
                        onChange={(e) => {
                          setInterestInput(e.target.value);
                          setShowInterestSuggestions(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && interestInput.trim()) {
                            e.preventDefault();
                            const name = interestInput.trim();
                            const match = areaOptions.find((a) => a.areasOfPractice.toLowerCase() === name.toLowerCase());
                            if (!editInterests.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
                              setEditInterests((prev) => [
                                ...prev,
                                match ? { id: match.id, name: match.areasOfPractice } : { id: null, name },
                              ]);
                            }
                            setInterestInput("");
                            setShowInterestSuggestions(false);
                          } else if (e.key === "Escape") {
                            setShowInterestSuggestions(false);
                          }
                        }}
                        w="100%"
                        color="black"
                        _placeholder={{ color: "#A1A1AA" }}
                      />
                      {interestInput && (
                        <Icon
                          as={FiX}
                          boxSize={3}
                          cursor="pointer"
                          color="gray.400"
                          onClick={() => {
                            setInterestInput("");
                            setShowInterestSuggestions(false);
                          }}
                        />
                      )}
                    </Flex>
                  </Flex>
                </Box>

                {showInterestSuggestions && interestSuggestions.length > 0 && (
                  <Box
                    position="absolute"
                    top="calc(100% + 4px)"
                    left={0}
                    right={0}
                    bg="white"
                    borderWidth="1px"
                    borderColor="#E4E4E7"
                    borderRadius="md"
                    boxShadow="md"
                    zIndex={50}
                    maxH="180px"
                    overflowY="auto"
                    py={1}
                  >
                    {interestSuggestions.map((opt) => {
                      const match = areaOptions.find((a) => a.areasOfPractice.toLowerCase() === opt.toLowerCase());
                      return (
                        <Box
                          key={opt}
                          px={3}
                          py={2}
                          fontSize="sm"
                          cursor="pointer"
                          _hover={{ bg: "skyBlue.100", color: "brand.navy" }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (!editInterests.some((i) => i.name.toLowerCase() === opt.toLowerCase())) {
                              setEditInterests((prev) => [
                                ...prev,
                                match ? { id: match.id, name: match.areasOfPractice } : { id: null, name: opt },
                              ]);
                            }
                            setInterestInput("");
                            setShowInterestSuggestions(false);
                          }}
                        >
                          {opt}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={0.5}>Employer or School</Text>
                <Text fontSize="xs" color="gray.400" mb={1}>Current workplace or school</Text>
                <Text fontSize="sm" color="gray.500">{volunteer.affiliatedEmployer || "—"}</Text>
              </Box>

              <SimpleGrid columns={2} gap={6} maxW="560px" mb={6}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>Are you a notary?</Text>
                  <Text fontSize="sm" color="gray.500">
                    {volunteer.notaryStatus === "active" || (volunteer.notaryStatus === undefined && volunteer.isNotary === true)
                      ? "Yes (active)"
                      : volunteer.notaryStatus === "inactive"
                        ? "Yes (inactive)"
                        : volunteer.notaryStatus === "no" || (volunteer.notaryStatus === undefined && volunteer.isNotary === false)
                          ? "No"
                          : "—"}
                  </Text>
                </Box>
                {((volunteer.roles || []).some((r) => r.toLowerCase().includes("law student")) || (volunteer.role || "").toLowerCase().includes("law student")) && (
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" mb={1}>Law School Year</Text>
                    <Text fontSize="sm" color="gray.500">{volunteer.lawSchoolYear || "—"}</Text>
                  </Box>
                )}
                {((volunteer.roles || []).some((r) => r.toLowerCase().includes("attorney")) ||
                  (volunteer.role || "").toLowerCase().includes("attorney") ||
                  volunteer.isCaliforniaLicensed ||
                  volunteer.stateBarCertificate) && (
                  <>
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" mb={1}>Licensed in California?</Text>
                      <Text fontSize="sm" color="gray.500">
                        {volunteer.isCaliforniaLicensed ||
                        volunteer.stateBarCertificate?.toLowerCase() === "california" ||
                        volunteer.stateBarCertificate?.toLowerCase() === "ca"
                          ? "Yes"
                          : "No"}
                      </Text>
                    </Box>
                    {(volunteer.isCaliforniaLicensed ||
                      volunteer.stateBarCertificate?.toLowerCase() === "california" ||
                      volunteer.stateBarCertificate?.toLowerCase() === "ca") && (
                      <Box>
                        <Text fontSize="sm" fontWeight="bold" mb={1}>State Bar Number</Text>
                        <Text fontSize="sm" color="gray.500">{volunteer.stateBarNumber || "—"}</Text>
                      </Box>
                    )}
                  </>
                )}
              </SimpleGrid>

              {/* Languages */}
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={2}>Languages</Text>
                <Box borderWidth="1px" borderColor="#E4E4E7" borderRadius="xl" p={5} justifyContent="center" maxWidth="440px">
                  {languages.length > 0 ? (
                    <>
                      <SimpleGrid columns={{ base: 1, sm: 3 }} px={2} pb={1.5} gap={2}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500">Language</Text>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500">Verbal Proficiency</Text>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500">Written Proficiency</Text>
                      </SimpleGrid>
                      {languages.map((entry, i) => (
                        <SimpleGrid key={i} columns={{ base: 1, sm: 3 }} px={2} py={1.5} gap={2}>
                          <Text fontSize="sm" fontWeight="medium">{entry.language}</Text>
                          <Text fontSize="sm" color="gray.700">{entry.verbalProficiency || "—"}</Text>
                          <Text fontSize="sm" color="gray.700">{entry.writtenProficiency || "—"}</Text>
                        </SimpleGrid>
                      ))}
                    </>
                  ) : (
                    <Text fontSize="sm" color="gray.500" px={2}>—</Text>
                  )}
                </Box>
              </Box>

              {/* Practice Areas & Interests */}
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>Practice Areas & Interests</Text>
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
