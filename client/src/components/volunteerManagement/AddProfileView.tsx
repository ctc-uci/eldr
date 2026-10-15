import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Breadcrumb,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  NativeSelect,
  Tabs,
  Text,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { LuCircleUser, LuIdCard, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { VolunteerProfileFormData } from "./VolunteerProfilePanel";

interface LanguageOption {
  id: number;
  language: string;
}
interface LanguageEntry {
  languageId: number;
  language: string;
  verbalProficiency: string;
  writtenProficiency: string;
}

import { PROFICIENCY_OPTIONS } from "@eldr/shared";

const TagInput = ({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  options = [],
}: {
  tags: string[];
  tagInput: string;
  onTagInputChange: (v: string) => void;
  onAddTag: (v: string) => void;
  onRemoveTag: (v: string) => void;
  options?: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const q = tagInput.trim().toLowerCase();
    if (!q) return [];
    return options.filter(
      (opt) => opt.toLowerCase().includes(q) && !tags.some((t) => t.toLowerCase() === opt.toLowerCase())
    ).slice(0, 8);
  }, [options, tagInput, tags]);

  const handleSelect = (val: string) => {
    onAddTag(val);
    onTagInputChange("");
    setIsOpen(false);
  };

  return (
    <Box position="relative">
      <Box
        borderWidth="1px"
        borderColor="#E4E4E7"
        borderRadius="md"
        p={3}
        minH="80px"
        bg="white"
      >
        <Flex
          gap={2}
          wrap="wrap"
          align="center"
        >
          {tags.map((t) => (
            <Flex
              key={t}
              align="center"
              gap={1}
              px={2}
              py={0.5}
              bg="gray.100"
              borderRadius="sm"
              fontSize="sm"
            >
              {t}
              <Icon
                as={FiX}
                boxSize={3}
                cursor="pointer"
                color="gray.400"
                _hover={{ color: "gray.700" }}
                onClick={() => onRemoveTag(t)}
              />
            </Flex>
          ))}
          <Flex
            align="center"
            gap={1}
            flex={1}
            minW="160px"
          >
            <Input
              size="xs"
              variant="unstyled"
              placeholder="Add tag (type to search existing)..."
              bg="transparent"
              value={tagInput}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                onTagInputChange(e.target.value);
                setIsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagInput.trim()) {
                  e.preventDefault();
                  if (filteredOptions.length > 0 && filteredOptions[0].toLowerCase() === tagInput.trim().toLowerCase()) {
                    handleSelect(filteredOptions[0]);
                  } else {
                    onAddTag(tagInput.trim());
                    onTagInputChange("");
                    setIsOpen(false);
                  }
                } else if (e.key === "Escape") {
                  setIsOpen(false);
                }
              }}
              w="100%"
              color="black"
              _placeholder={{ color: "#A1A1AA" }}
            />
            {tagInput && (
              <Icon
                as={FiX}
                boxSize={3}
                cursor="pointer"
                color="gray.400"
                onClick={() => {
                  onTagInputChange("");
                  setIsOpen(false);
                }}
              />
            )}
          </Flex>
        </Flex>
      </Box>

      {isOpen && filteredOptions.length > 0 && (
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
          {filteredOptions.map((opt) => (
            <Box
              key={opt}
              px={3}
              py={2}
              fontSize="sm"
              cursor="pointer"
              _hover={{ bg: "skyBlue.100", color: "brand.navy" }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(opt);
              }}
            >
              {opt}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export const AddProfileView = () => {
  const { backend } = useBackendContext();
  const { role: currentUserRole } = useRoleContext();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, trigger } =
    useForm<VolunteerProfileFormData>();
  const roleValue = watch("role");

  const [activeTab, setActiveTab] = useState("profile");
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Reference data from DB
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([]);

  // Occupation state
  // TODO: The following fields are not yet persisted and need backend support (posts + gets):
  //   - affiliated: no column in volunteers table
  //   - lawSchoolYear: no column in volunteers table
  //   - stateBarCertState: no column in volunteers table
  //   - stateBarNumber: no column in volunteers table
  //   - interests: free text, not mapped to areas_of_practice IDs
  //   - experience: no backend endpoint
  // Contact state
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("");
  const [isPrimaryMobile, setIsPrimaryMobile] = useState(false);
  const [isSecondaryMobile, setIsSecondaryMobile] = useState(false);
  const [canText, setCanText] = useState(false);

  // Volunteer Roles catalog
  const [rolesList, setRolesList] = useState<{ id: number; roleName: string }[]>([]);
  const [selectedVolunteerRoleId, setSelectedVolunteerRoleId] = useState<string>("");

  // Occupation state
  const [affiliated, setAffiliated] = useState("");
  const [notaryStatus, setNotaryStatus] = useState("");
  const [lawSchoolYear, setLawSchoolYear] = useState("");
  const [isCaliforniaLicensed, setIsCaliforniaLicensed] = useState(false);
  const [stateBarNumber, setStateBarNumber] = useState("");
  const [languages, setLanguages] = useState<LanguageEntry[]>([
    { languageId: 0, language: "", verbalProficiency: "", writtenProficiency: "" },
  ]);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [areaCatalog, setAreaCatalog] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [experienceInput, setExperienceInput] = useState("");

  useEffect(() => {
    backend
      .get<LanguageOption[]>("/languages")
      .then((res) => setLanguageOptions(res.data))
      .catch((error) => console.error("Error fetching languages:", error));

    backend
      .get<Array<{ id: number; roleName?: string; role_name?: string }>>("/roles")
      .then((res) => {
        const rows = (res.data || []).map((r) => ({
          id: r.id,
          roleName: r.roleName || r.role_name || "",
        }));
        setRolesList(rows);
      })
      .catch((error) => console.error("Error fetching roles:", error));

    backend
      .get<{ id: number; areasOfPractice: string }[]>("/areas-of-practice")
      .then((res) => {
        setAreaCatalog((res.data || []).map((a) => a.areasOfPractice));
      })
      .catch((err) => console.error("Error fetching areas of practice:", err));
  }, [backend]);

  const selectedRoleObj = rolesList.find((r) => String(r.id) === selectedVolunteerRoleId);
  const selectedRoleName = (selectedRoleObj?.roleName || "").toLowerCase();
  const isLawStudent = selectedRoleName.includes("law student");
  const isAttorney = selectedRoleName.includes("attorney");

  const handleContinue = async () => {
    const valid = await trigger([
      "firstName",
      "lastName",
      "phoneNumber",
      "email",
      "role",
    ]);
    if (!valid) return;
    setProfileCompleted(true);
    setActiveTab("occupation");
  };

  const handleTabChange = (details: { value: string }) => {
    if (details.value === "occupation" && !profileCompleted) return;
    setActiveTab(details.value);
  };

  const onCreateProfile = async (data: VolunteerProfileFormData) => {
    try {
      const isStaff = data.role === "staff" || data.role === "supervisor";

      if (isStaff) {
        await backend.post("/admins", {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          secondaryPhoneNumber: secondaryPhoneNumber || null,
          isPrimaryMobile,
          isSecondaryMobile,
          canText,
          isSupervisor: data.role === "supervisor",
        });
      } else {
        const volunteerRes = await backend.post<{ id: number }>("/volunteers", {
          firebaseUid: crypto.randomUUID(),
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber,
          secondary_phone_number: secondaryPhoneNumber || null,
          is_primary_mobile: isPrimaryMobile,
          is_secondary_mobile: isSecondaryMobile,
          can_text: canText,
          is_notary: notaryStatus === "active",
          notary_status: notaryStatus || null,
          affiliated_employer: affiliated || null,
          law_school_year: isLawStudent ? (lawSchoolYear || null) : null,
          is_california_licensed: isCaliforniaLicensed,
          state_bar_certificate: isCaliforniaLicensed ? "California" : null,
          state_bar_number: isCaliforniaLicensed ? (stateBarNumber || null) : null,
        });

        const volunteerId = volunteerRes.data.id;

        const tasks: Promise<unknown>[] = [];

        // Assign chosen volunteer role
        if (selectedVolunteerRoleId) {
          tasks.push(
            backend.post(`/volunteers/${volunteerId}/roles`, {
              roleId: Number(selectedVolunteerRoleId),
            })
          );
        }

        const validLanguages = languages.filter((l) => l.languageId !== 0);
        if (validLanguages.length > 0) {
          tasks.push(
            backend.post(`/volunteers/${volunteerId}/languages`, {
              languages: validLanguages.map((l) => ({
                languageId: l.languageId,
                verbalProficiency: l.verbalProficiency || "Professional",
                writtenProficiency: l.writtenProficiency || "Professional",
              })),
            })
          );
        }

        // Save interests
        const areasRes =
          await backend.get<{ id: number; areasOfPractice: string }[]>(
            "/areas-of-practice"
          );
        const areasList = areasRes.data;
        for (const name of interests) {
          const area = areasList.find(
            (a) => a.areasOfPractice.toLowerCase() === name.toLowerCase()
          );
          if (area) {
            tasks.push(
              backend.post(`/volunteers/${volunteerId}/areas-of-practice`, {
                areaOfPracticeId: area.id,
              })
            );
          } else {
            const created = await backend.post<{ id: number }>(
              "/areas-of-practice",
              { areaOfPractice: name }
            );
            tasks.push(
              backend.post(`/volunteers/${volunteerId}/areas-of-practice`, {
                areaOfPracticeId: created.data.id,
              })
            );
          }
        }

        await Promise.all(tasks);
      }

      navigate("/volunteer-management");
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return (
    <Box p={6}>
      <Heading
        size="xl"
        fontWeight="bold"
        mb={4}
      >
        New Profile
      </Heading>

      <Breadcrumb.Root
        mb={6}
        fontSize="sm"
        color="#27272A"
      >
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link
              onClick={() => navigate("/volunteer-management")}
              cursor="pointer"
            >
              User Management
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink color="#2563EB">
              Add Profile
            </Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <Tabs.Root
        value={activeTab}
        onValueChange={handleTabChange}
        variant="outline"
      >
        <Tabs.List>
          <Tabs.Trigger
            value="profile"
            gap={2}
          >
            <LuCircleUser /> Profile Information
          </Tabs.Trigger>
          <Tabs.Trigger
            value="occupation"
            gap={2}
            disabled={!profileCompleted}
            opacity={!profileCompleted ? 0.4 : 1}
            cursor={!profileCompleted ? "not-allowed" : "pointer"}
          >
            <LuIdCard /> Occupation & Credentials
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content
          value="profile"
          pt={0}
        >
          <Box
            borderWidth="1px"
            borderTopWidth={0}
            borderColor="#E4E4E7"
            borderBottomRadius="md"
            borderTopRadius={0}
            px={8}
            py={16}
          >
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="#002992"
              mb={6}
            >
              Profile Information
            </Text>

            {/* Row 1: Name & Primary Phone */}
            <Flex
              mb={6}
              gap={8}
              mr="24rem"
            >
              <Box flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={1}
                >
                  First Name{" "}
                  <Box
                    as="span"
                    color="red.500"
                  >
                    *
                  </Box>
                </Text>
                <Input
                  placeholder="Type here"
                  borderColor="#E4E4E7"
                  {...register("firstName", { required: true })}
                />
              </Box>
              <Box flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={1}
                >
                  Last Name{" "}
                  <Box
                    as="span"
                    color="red.500"
                  >
                    *
                  </Box>
                </Text>
                <Input
                  placeholder="Type here"
                  borderColor="#E4E4E7"
                  {...register("lastName", { required: true })}
                />
              </Box>
              <Box flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={1}
                >
                  Primary Phone{" "}
                  <Box
                    as="span"
                    color="red.500"
                  >
                    *
                  </Box>
                </Text>
                <Input
                  placeholder="Type here"
                  borderColor="#E4E4E7"
                  {...register("phoneNumber", { required: true })}
                />
                <Checkbox.Root
                  checked={isPrimaryMobile}
                  onCheckedChange={(e) => setIsPrimaryMobile(!!e.checked)}
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
            </Flex>

            {/* Row 2: Secondary Phone & Consent */}
            <Flex
              mb={6}
              gap={8}
              mr="24rem"
            >
              <Box flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={1}
                >
                  Secondary Phone (Optional)
                </Text>
                <Input
                  placeholder="Optional secondary phone"
                  borderColor="#E4E4E7"
                  value={secondaryPhoneNumber}
                  onChange={(e) => setSecondaryPhoneNumber(e.target.value)}
                />
                <Checkbox.Root
                  checked={isSecondaryMobile}
                  onCheckedChange={(e) => setIsSecondaryMobile(!!e.checked)}
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

              <Box flex={2} p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="#E4E4E7" alignSelf="flex-start">
                <Checkbox.Root
                  checked={canText}
                  onCheckedChange={(e) => setCanText(!!e.checked)}
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
            </Flex>

            {/* Row 3: Email & User Type */}
            <Flex
              mb={8}
              gap={8}
              mr="24rem"
            >
              <Box flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={1}
                >
                  Email{" "}
                  <Box
                    as="span"
                    color="red.500"
                  >
                    *
                  </Box>
                </Text>
                <Input
                  placeholder="Type here"
                  borderColor="#E4E4E7"
                  {...register("email", { required: true })}
                />
              </Box>
              <Box flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={1}
                >
                  User Type{" "}
                  <Box
                    as="span"
                    color="red.500"
                  >
                    *
                  </Box>
                </Text>
                <NativeSelect.Root borderColor="#E4E4E7">
                  <NativeSelect.Field
                    placeholder="Select User Type"
                    color={!roleValue ? "#A1A1AA" : "inherit"}
                    {...register("role", { required: true })}
                  >
                    <option value="volunteer">Volunteer</option>
                    {currentUserRole === "supervisor" && (
                      <option value="staff">Staff</option>
                    )}
                    {currentUserRole === "supervisor" && (
                      <option value="supervisor">Supervisor</option>
                    )}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
              <Box flex={1} />
            </Flex>

            <Flex justify="flex-end">
              <Button
                bg="brand.navy"
                color="white"
                fontFamily="heading"
                _hover={{ bg: "primary.500" }}
                onClick={handleContinue}
              >
                Continue
              </Button>
            </Flex>
          </Box>
        </Tabs.Content>

        <Tabs.Content
          value="occupation"
          pt={0}
        >
          <Box
            borderWidth="1px"
            borderTopWidth={0}
            borderColor="#E4E4E7"
            borderBottomRadius="md"
            borderTopRadius={0}
            p={8}
          >
            {/* Header */}
            <Flex
              align="center"
              justify="space-between"
              mb={8}
            >
              <Text
                fontSize="lg"
                fontWeight="semibold"
                fontFamily="heading"
                color="brand.navy"
              >
                Occupation & Credentials
              </Text>
              <Flex gap={3}>
                <Button
                  bg="brand.navy"
                  color="white"
                  fontFamily="heading"
                  _hover={{ bg: "primary.500" }}
                  gap={2}
                  onClick={handleSubmit(onCreateProfile)}
                >
                  <LuUser />
                  Create Profile
                </Button>
                <Button
                  variant="outline"
                  bg="#F4F4F5"
                  borderColor="#E4E4E7"
                  color="#27272A"
                  _hover={{ bg: "#E4E4E7" }}
                  onClick={() => navigate("/volunteer-management")}
                >
                  Cancel
                </Button>
              </Flex>
            </Flex>

            {/* Volunteer Role Selection (if Volunteer User Type) */}
            {(roleValue === "volunteer" || !roleValue) && (
              <Flex mb={6} gap={8} mr="24rem">
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="semibold" mb={1}>
                    Volunteer Role
                  </Text>
                  <NativeSelect.Root borderColor="#E4E4E7">
                    <NativeSelect.Field
                      placeholder="Select Volunteer Role"
                      value={selectedVolunteerRoleId}
                      onChange={(e) => setSelectedVolunteerRoleId(e.target.value)}
                    >
                      {rolesList.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roleName}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>
                <Box flex={2} />
              </Flex>
            )}

            {/* Row 1: Employer or School, Notary, Law School Year */}
            <Flex
              mb={8}
              gap={8}
              mr="24rem"
            >
              <Box flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={0.5}
                >
                  Employer or School{" "}
                  <Box
                    as="span"
                    color="red.500"
                  >
                    *
                  </Box>
                </Text>
                <Text fontSize="xs" color="gray.500" mb={1.5}>
                  Current workplace or school, not educational history
                </Text>
                <Flex
                  align="center"
                  borderWidth="1px"
                  borderColor="#E4E4E7"
                  borderRadius="md"
                  px={3}
                  h="40px"
                  gap={2}
                >
                  <Input
                    variant="unstyled"
                    placeholder="Enter employer or school name"
                    _placeholder={{ color: "#A1A1AA" }}
                    fontSize="sm"
                    value={affiliated}
                    onChange={(e) => setAffiliated(e.target.value)}
                    bg="transparent"
                  />
                </Flex>
              </Box>

              <Box flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={1}
                >
                  Are you a notary?{" "}
                  <Box
                    as="span"
                    color="red.500"
                  >
                    *
                  </Box>
                </Text>
                <NativeSelect.Root borderColor="#E4E4E7">
                  <NativeSelect.Field
                    placeholder="Select here"
                    color={!notaryStatus ? "#A1A1AA" : "inherit"}
                    value={notaryStatus}
                    onChange={(e) => setNotaryStatus(e.target.value)}
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
                <Box flex={1}>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    mb={1}
                  >
                    Law School Year
                  </Text>
                  <NativeSelect.Root borderColor="#E4E4E7">
                    <NativeSelect.Field
                      placeholder="Select here"
                      color={!lawSchoolYear ? "#A1A1AA" : "inherit"}
                      value={lawSchoolYear}
                      onChange={(e) => setLawSchoolYear(e.target.value)}
                    >
                      {["1L", "2L", "3L", "Graduate"].map((y) => (
                        <option
                          key={y}
                          value={y}
                        >
                          {y}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>
              )}
            </Flex>

            {/* Row 2: California Bar Admission & Interests */}
            <Flex
              mb={8}
              align="flex-start"
              gap={16}
              mr="16rem"
            >
              <Box
                w="380px"
                flexShrink={0}
                p={3.5}
                borderWidth="1px"
                borderColor="#E4E4E7"
                borderRadius="md"
                bg="#FAFAFA"
              >
                <Checkbox.Root
                  checked={isCaliforniaLicensed}
                  onCheckedChange={(e) => setIsCaliforniaLicensed(!!e.checked)}
                  colorPalette="blue"
                  size="sm"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label fontSize="sm" fontWeight="semibold" color="gray.800">
                    Licensed to practice law in California?
                  </Checkbox.Label>
                </Checkbox.Root>

                {isCaliforniaLicensed && (
                  <Box mt={3}>
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      mb={1}
                      color="gray.700"
                    >
                      California State Bar Number
                    </Text>
                    <Input
                      size="sm"
                      bg="white"
                      borderColor="#E4E4E7"
                      placeholder="Enter number"
                      _placeholder={{ color: "#A1A1AA" }}
                      value={stateBarNumber}
                      onChange={(e) => setStateBarNumber(e.target.value)}
                    />
                  </Box>
                )}
              </Box>

              <Box flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={1}
                >
                  Practice Areas & Interests
                </Text>
                <Text fontSize="xs" color="gray.400" mb={2}>Select or type areas of law, subjects, and interests</Text>
                <TagInput
                  tags={interests}
                  tagInput={interestInput}
                  options={areaCatalog}
                  onTagInputChange={setInterestInput}
                  onAddTag={(v) =>
                    setInterests((prev) =>
                      prev.includes(v) ? prev : [...prev, v]
                    )
                  }
                  onRemoveTag={(v) =>
                    setInterests((prev) => prev.filter((i) => i !== v))
                  }
                />
              </Box>
            </Flex>

            {/* Row 3 */}
            <Flex
              align="flex-start"
              gap={16}
              mr="16rem"
            >
              <Box flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={2}
                >
                  Languages
                </Text>
                <Box
                  borderWidth="1px"
                  borderColor="#E4E4E7"
                  borderRadius="md"
                  p={4}
                >
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    mb={3}
                  >
                    Select the languages and your proficiency level
                  </Text>
                  {languages.length > 0 && (
                    <Flex gap={2} mb={2} px={1}>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.500" flex={1}>
                        Language
                      </Text>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.500" flex={1}>
                        Verbal Proficiency
                      </Text>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.500" flex={1}>
                        Written Proficiency
                      </Text>
                      {languages.length > 1 && <Box w="12px" />}
                    </Flex>
                  )}
                  {languages.map((entry, i) => (
                    <Flex
                      key={i}
                      gap={2}
                      mb={2}
                      align="center"
                    >
                      <NativeSelect.Root
                        borderColor="#E4E4E7"
                        flex={1}
                      >
                        <NativeSelect.Field
                          placeholder="Language"
                          color={!entry.languageId ? "#A1A1AA" : "inherit"}
                          value={entry.languageId || ""}
                          onChange={(e) => {
                            const id = Number(e.target.value);
                            const lang = languageOptions.find(
                              (l) => l.id === id
                            );
                            setLanguages((prev) =>
                              prev.map((l, idx) =>
                                idx === i
                                  ? {
                                      ...l,
                                      languageId: id,
                                      language: lang?.language ?? "",
                                    }
                                  : l
                              )
                            );
                          }}
                        >
                          {languageOptions.map((l) => (
                            <option
                              key={l.id}
                              value={l.id}
                            >
                              {l.language}
                            </option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      <NativeSelect.Root
                        borderColor="#E4E4E7"
                        flex={1}
                      >
                        <NativeSelect.Field
                          placeholder="Verbal"
                          color={!entry.verbalProficiency ? "#A1A1AA" : "inherit"}
                          value={entry.verbalProficiency}
                          onChange={(e) =>
                            setLanguages((prev) =>
                              prev.map((l, idx) =>
                                idx === i
                                  ? { ...l, verbalProficiency: e.target.value }
                                  : l
                              )
                            )
                          }
                        >
                          {PROFICIENCY_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      <NativeSelect.Root
                        borderColor="#E4E4E7"
                        flex={1}
                      >
                        <NativeSelect.Field
                          placeholder="Written"
                          color={!entry.writtenProficiency ? "#A1A1AA" : "inherit"}
                          value={entry.writtenProficiency}
                          onChange={(e) =>
                            setLanguages((prev) =>
                              prev.map((l, idx) =>
                                idx === i
                                  ? { ...l, writtenProficiency: e.target.value }
                                  : l
                              )
                            )
                          }
                        >
                          {PROFICIENCY_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      {languages.length > 1 && (
                        <Icon
                          as={FiX}
                          boxSize={3}
                          cursor="pointer"
                          color="gray.400"
                          _hover={{ color: "gray.700" }}
                          onClick={() =>
                            setLanguages((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
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
                      setLanguages((prev) => [
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
              <Box flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={2}
                >
                  Experience
                </Text>
                <TagInput
                  tags={experience}
                  tagInput={experienceInput}
                  onTagInputChange={setExperienceInput}
                  onAddTag={(v) =>
                    setExperience((prev) =>
                      prev.includes(v) ? prev : [...prev, v]
                    )
                  }
                  onRemoveTag={(v) =>
                    setExperience((prev) => prev.filter((e) => e !== v))
                  }
                />
              </Box>
            </Flex>
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};
