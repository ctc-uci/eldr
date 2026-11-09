import { useEffect, useMemo, useRef, useState } from "react";

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
import {
  FiAlertTriangle,
  FiCheck,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { Volunteer } from "@/types/volunteer";
import { ProfileField, ProfilePanelShell } from "./ProfilePanelShell";
import { uploadHandbookToS3, validateHandbookFile } from "@/utils/uploadHandbook";

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
  email: string;
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
    email: "",
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
  const [templateUrl, setTemplateUrl] = useState<string>("/templates/volunteer_handbook_packet.pdf");

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
    backend.get<{ downloadUrl: string }>("/users/handbook/template-url")
      .then((res) => {
        if (res.data?.downloadUrl) setTemplateUrl(res.data.downloadUrl);
      })
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

  const [formReceived, setFormReceived] = useState(false);
  const [handbookAcknowledged, setHandbookAcknowledged] = useState(false);
  const [emergencyContactVerified, setEmergencyContactVerified] = useState(false);
  const [confidentialityWaiverVerified, setConfidentialityWaiverVerified] = useState(false);
  const [isSignedConfidentiality, setIsSignedConfidentiality] = useState(false);
  const [handbookUrl, setHandbookUrl] = useState<string | null>(null);
  const [handbookUploadedAt, setHandbookUploadedAt] = useState<string | null>(null);
  const [isUpdatingVerification, setIsUpdatingVerification] = useState(false);
  const [isUploadingHandbook, setIsUploadingHandbook] = useState(false);
  const [handbookError, setHandbookError] = useState<string | null>(null);
  const adminFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!volunteer) return;
    setFormReceived(Boolean(volunteer.formReceived));
    setHandbookAcknowledged(Boolean(volunteer.handbookAcknowledged));
    setEmergencyContactVerified(Boolean(volunteer.emergencyContactVerified));
    setConfidentialityWaiverVerified(Boolean(volunteer.confidentialityWaiverVerified));
    setIsSignedConfidentiality(Boolean(volunteer.isSignedConfidentiality));
    setHandbookUrl(volunteer.handbookUrl ?? null);
    setHandbookUploadedAt(volunteer.handbookUploadedAt ?? null);
    setHandbookError(null);
  }, [volunteer]);

  const updateVerification = async (patch: {
    form_received?: boolean;
    handbook_acknowledged?: boolean;
    emergency_contact_verified?: boolean;
    confidentiality_waiver_verified?: boolean;
    is_signed_confidentiality?: boolean | string | null;
  }) => {
    if (!volunteerId) return;
    setIsUpdatingVerification(true);
    setHandbookError(null);
    try {
      await backend.put(`/volunteers/${volunteerId}`, patch);
      if (patch.form_received !== undefined) setFormReceived(patch.form_received);
      if (patch.handbook_acknowledged !== undefined) setHandbookAcknowledged(patch.handbook_acknowledged);
      if (patch.emergency_contact_verified !== undefined) setEmergencyContactVerified(patch.emergency_contact_verified);
      if (patch.confidentiality_waiver_verified !== undefined) setConfidentialityWaiverVerified(patch.confidentiality_waiver_verified);
      if (patch.is_signed_confidentiality !== undefined) {
        setIsSignedConfidentiality(Boolean(patch.is_signed_confidentiality));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update verification status";
      setHandbookError(msg);
    } finally {
      setIsUpdatingVerification(false);
    }
  };

  const handleToggleComponent = (
    field: "handbookAcknowledged" | "emergencyContactVerified" | "confidentialityWaiverVerified",
    newVal: boolean
  ) => {
    const nextAck = field === "handbookAcknowledged" ? newVal : handbookAcknowledged;
    const nextEmerg = field === "emergencyContactVerified" ? newVal : emergencyContactVerified;
    const nextWaiver = field === "confidentialityWaiverVerified" ? newVal : confidentialityWaiverVerified;
    const allThree = nextAck && nextEmerg && nextWaiver;

    const patch: Record<string, unknown> = {
      [field === "handbookAcknowledged"
        ? "handbook_acknowledged"
        : field === "emergencyContactVerified"
        ? "emergency_contact_verified"
        : "confidentiality_waiver_verified"]: newVal,
    };

    if (allThree && !isSignedConfidentiality) {
      patch.is_signed_confidentiality = true;
    } else if (!allThree && isSignedConfidentiality) {
      patch.is_signed_confidentiality = false;
    }

    updateVerification(patch);
  };

  const handleToggleVerified = (newVal: boolean) => {
    updateVerification({
      is_signed_confidentiality: newVal,
      ...(newVal
        ? {
            form_received: true,
            handbook_acknowledged: true,
            emergency_contact_verified: true,
            confidentiality_waiver_verified: true,
          }
        : {}),
    });
  };

  const handleToggleFormReceived = (newVal: boolean) => {
    updateVerification({
      form_received: newVal,
      ...(!newVal
        ? {
            handbook_acknowledged: false,
            emergency_contact_verified: false,
            confidentiality_waiver_verified: false,
            is_signed_confidentiality: false,
          }
        : {}),
    });
  };

  const handleAdminHandbookUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !volunteerId) return;
    const validationError = validateHandbookFile(file);
    if (validationError) {
      setHandbookError(validationError);
      return;
    }
    setHandbookError(null);
    setIsUploadingHandbook(true);
    try {
      const fbUid = volunteer?.firebaseUid || `volunteer-${volunteerId}`;
      const key = await uploadHandbookToS3(backend, file, fbUid);
      const uploadedAt = new Date().toISOString();
      await backend.put(`/volunteers/${volunteerId}`, {
        form_received: true,
        form_link: key,
        handbook_uploaded_at: uploadedAt,
      });

      let viewUrl = "";
      try {
        const viewResp = await backend.get("/users/document/view-url", {
          params: { key },
        });
        viewUrl = viewResp.data?.viewUrl ?? "";
      } catch {
        /* ignore */
      }

      setFormReceived(true);
      setHandbookUrl(viewUrl || key);
      setHandbookUploadedAt(uploadedAt);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload handbook document";
      setHandbookError(msg);
    } finally {
      setIsUploadingHandbook(false);
      if (adminFileInputRef.current) adminFileInputRef.current.value = "";
    }
  };

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

  const currentRoles = isEditing
    ? editRoles.map((r) => r.roleName)
    : (volunteer?.roles && volunteer.roles.length > 0 ? volunteer.roles : [volunteer?.role || ""]);
  const roleLabel = currentRoles.filter(Boolean).join(" ").toLowerCase();

  const isLawStudent = roleLabel.includes("law student");
  const isAttorney = roleLabel.includes("attorney");

  const enterEditMode = async () => {
    if (!volunteer) return;
    setSaveError(null);
    const currentNotary =
      volunteer.notaryStatus ?? (volunteer.isNotary === true ? "active" : "no");
    const isCalLicensed =
      volunteer.isCaliforniaLicensed === true ||
      volunteer.stateBarCertificate?.toLowerCase() === "california" ||
      volunteer.stateBarCertificate?.toLowerCase() === "ca";

    setForm({
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      email: volunteer.email ?? "",
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
      const [areasRes, rolesRes, langsRes] = await Promise.all([
        backend.get<{ areaOfPracticeId: number; areasOfPractice: string }[]>(
          `/volunteers/${volunteer.id}/areas-of-practice`
        ),
        backend.get<RoleEntry[]>(`/volunteers/${volunteer.id}/roles`),
        backend.get<
          {
            id: number;
            language: string;
            verbalProficiency?: string;
            writtenProficiency?: string;
            proficiency?: string;
          }[]
        >(`/volunteers/${volunteer.id}/languages`),
      ]);

      setEditInterests(areasRes.data.map((a) => ({ id: a.areaOfPracticeId, name: a.areasOfPractice })));
      setOriginalInterestIds(areasRes.data.map((a) => a.areaOfPracticeId));
      setInterestInput("");

      setEditRoles(rolesRes.data);
      setOriginalRoleIds(rolesRes.data.map((r) => r.id));
      setSelectedRoleId("");

      const mapped = langsRes.data.map((l) => ({
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
      setOriginalLanguageIds(langsRes.data.map((l) => l.id));

      setIsEditing(true);
    } catch (err) {
      console.error("Failed to load volunteer details for editing:", err);
      setSaveError("Failed to load volunteer roles and details. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!volunteer) return;
    setSaveError(null);
    try {

    await backend.put(`/volunteers/${volunteer.id}`, {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email || volunteer.email,
      phone_number: form.phoneNumber || null,
      secondary_phone_number: form.secondaryPhoneNumber || null,
      is_primary_mobile: form.isPrimaryMobile,
      is_secondary_mobile: form.isSecondaryMobile,
      can_text: form.canText,
      is_notary: form.notaryStatus === "active",
      notary_status: form.notaryStatus || null,
      affiliated_employer: form.affiliated || null,
      law_school_year: isLawStudent ? (form.lawSchoolYear || null) : null,
      is_california_licensed: isAttorney ? form.isCaliforniaLicensed : false,
      state_bar_certificate: isAttorney && form.isCaliforniaLicensed ? "California" : null,
      state_bar_number: isAttorney && form.isCaliforniaLicensed ? (form.stateBarNumber || null) : null,
      form_received: formReceived,
      handbook_acknowledged: handbookAcknowledged,
      emergency_contact_verified: emergencyContactVerified,
      confidentiality_waiver_verified: confidentialityWaiverVerified,
      is_signed_confidentiality: isSignedConfidentiality,
    });

    const validLanguages = editLanguages.filter((l) => l.languageId !== 0);
    const currentLanguageIds = validLanguages.map((l) => l.languageId);
    const removedLanguageIds = originalLanguageIds.filter((id) => !currentLanguageIds.includes(id));

    await Promise.all(
      removedLanguageIds.map((id) =>
        backend.delete(`/volunteers/${volunteer.id}/languages/${id}`).catch((err) => {
          if (err?.response?.status !== 404) throw err;
        })
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
      ...rolesToRemove.map((id) =>
        backend.delete(`/volunteers/${volunteer.id}/roles/${id}`).catch((err) => {
          if (err?.response?.status !== 404) throw err;
        })
      ),
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
      ...interestsToRemove.map((id) =>
        backend.delete(`/volunteers/${volunteer.id}/areas-of-practice/${id}`).catch((err) => {
          if (err?.response?.status !== 404) throw err;
        })
      ),
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
      email: form.email || volunteer.email,
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
      lawSchoolYear: isLawStudent ? (form.lawSchoolYear || undefined) : undefined,
      isCaliforniaLicensed: isAttorney ? form.isCaliforniaLicensed : false,
      stateBarCertificate: isAttorney && form.isCaliforniaLicensed ? "California" : undefined,
      stateBarNumber: isAttorney && form.isCaliforniaLicensed ? (form.stateBarNumber || undefined) : undefined,
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
      photoUrl={volunteer.profilePictureUrl}
      onBack={onBack}
      isEditing={isEditing}
      isSaved={isSaved}
      onEditToggle={enterEditMode}
      onSave={handleSave}
    >
      {saveError && (
        <Text fontSize="sm" color="red.500" mb={3}>{saveError}</Text>
      )}

      {/* Volunteer Handbook & Confidentiality Verification Card */}
      <Box
        borderWidth="1px"
        borderColor="#E4E4E7"
        bg="#FAFAFA"
        borderRadius="lg"
        p={4}
        mb={5}
      >
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={3}
          mb={3}
        >
          <HStack gap={2}>
            <Icon
              as={isSignedConfidentiality ? FiCheck : formReceived ? FiFileText : FiAlertTriangle}
              boxSize={5}
              color={isSignedConfidentiality ? "green.600" : formReceived ? "blue.600" : "orange.500"}
            />
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="gray.900">
                Volunteer Handbook &amp; Confidentiality Form
              </Text>
              <Text fontSize="xs" color="gray.500">
                Single unified packet: Handbook acknowledgment, Emergency contact, Confidentiality waiver
              </Text>
            </Box>
          </HStack>

          <HStack gap={2}>
            {isSignedConfidentiality ? (
              <Badge colorPalette="green" size="md">
                ✓ Confidential Form Verified
              </Badge>
            ) : formReceived ? (
              <Badge colorPalette="blue" size="md">
                Handbook Received — Pending Verification
              </Badge>
            ) : (
              <Badge colorPalette="orange" size="md">
                Handbook Not Received
              </Badge>
            )}
          </HStack>
        </Flex>

        {/* Action Row */}
        <Flex
          justify="space-between"
          align={{ base: "start", sm: "center" }}
          direction={{ base: "column", sm: "row" }}
          gap={3}
          py={2}
          borderTopWidth="1px"
          borderColor="#E4E4E7"
        >
          <HStack gap={2} flexWrap="wrap">
            <Button
              as="a"
              href={templateUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="ELDR_Volunteer_Handbook_Packet.pdf"
              size="xs"
              variant="outline"
              bg="white"
              gap={1}
            >
              <Icon as={FiDownload} />
              Download Blank Template
            </Button>

            {handbookUrl && (
              <Button
                as="a"
                href={handbookUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="xs"
                variant="outline"
                bg="white"
                color="blue.600"
                gap={1}
              >
                <Icon as={FiExternalLink} />
                View Uploaded PDF
              </Button>
            )}

            <input
              ref={adminFileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              hidden
              onChange={handleAdminHandbookUpload}
            />

            <Button
              size="xs"
              variant="outline"
              bg="white"
              gap={1}
              onClick={() => adminFileInputRef.current?.click()}
              loading={isUploadingHandbook}
              disabled={isUploadingHandbook}
            >
              <Icon as={FiUploadCloud} />
              {formReceived ? "Replace PDF" : "Upload Signed PDF"}
            </Button>
          </HStack>

          {handbookUploadedAt && (
            <Text fontSize="xs" color="gray.500">
              Uploaded: {new Date(handbookUploadedAt).toLocaleDateString()}
            </Text>
          )}
        </Flex>

        {/* Admin Checkbox Controls */}
        <Box
          mt={3}
          pt={3}
          borderTopWidth="1px"
          borderColor="#E4E4E7"
          bg="white"
          p={3}
          borderRadius="md"
        >
          <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500" mb={2}>
            Admin Verification Checklist
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={3} mb={3}>
            {/* Checkbox 1 */}
            <Checkbox.Root
              checked={handbookAcknowledged}
              onCheckedChange={(e) =>
                handleToggleComponent("handbookAcknowledged", !!e.checked)
              }
              colorPalette="blue"
              size="sm"
              disabled={isUpdatingVerification}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label fontSize="xs" fontWeight="medium" color="gray.800">
                1. Handbook Acknowledged
              </Checkbox.Label>
            </Checkbox.Root>

            {/* Checkbox 2 */}
            <Checkbox.Root
              checked={emergencyContactVerified}
              onCheckedChange={(e) =>
                handleToggleComponent("emergencyContactVerified", !!e.checked)
              }
              colorPalette="blue"
              size="sm"
              disabled={isUpdatingVerification}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label fontSize="xs" fontWeight="medium" color="gray.800">
                2. Emergency Contact Info
              </Checkbox.Label>
            </Checkbox.Root>

            {/* Checkbox 3 */}
            <Checkbox.Root
              checked={confidentialityWaiverVerified}
              onCheckedChange={(e) =>
                handleToggleComponent("confidentialityWaiverVerified", !!e.checked)
              }
              colorPalette="blue"
              size="sm"
              disabled={isUpdatingVerification}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label fontSize="xs" fontWeight="medium" color="gray.800">
                3. Confidentiality / Waiver
              </Checkbox.Label>
            </Checkbox.Root>
          </SimpleGrid>

          <HStack justify="space-between" pt={2} borderTopWidth="1px" borderColor="#F4F4F5" flexWrap="wrap" gap={2}>
            <Checkbox.Root
              checked={formReceived}
              onCheckedChange={(e) => handleToggleFormReceived(!!e.checked)}
              colorPalette="blue"
              size="sm"
              disabled={isUpdatingVerification}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label fontSize="xs" color="gray.600">
                Form Received Marked
              </Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root
              checked={isSignedConfidentiality}
              onCheckedChange={(e) => handleToggleVerified(!!e.checked)}
              colorPalette="green"
              size="sm"
              disabled={isUpdatingVerification}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label fontSize="xs" fontWeight="bold" color="green.700">
                Mark as Fully Verified
              </Checkbox.Label>
            </Checkbox.Root>
          </HStack>

          {handbookError && (
            <Text fontSize="xs" color="red.500" mt={2}>
              {handbookError}
            </Text>
          )}
        </Box>
      </Box>

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
                {isLawStudent && (
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
                {isAttorney && (
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
                )}
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
                {isLawStudent && (
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" mb={1}>Law School Year</Text>
                    <Text fontSize="sm" color="gray.500">{volunteer.lawSchoolYear || "—"}</Text>
                  </Box>
                )}
                {isAttorney && (
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
