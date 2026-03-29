import { useEffect, useState } from "react";

import {
  Box,
  Breadcrumb,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  NativeSelect,
  SimpleGrid,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { FiCheck, FiEdit2, FiAlertTriangle, FiSave, FiX } from "react-icons/fi";

import { useForm, UseFormRegisterReturn } from "react-hook-form";

import { Volunteer } from "@/types/volunteer";

interface LabeledBoxProps {
  label: string;
  width?: string;
  value: string;
  dropdown?: boolean;
}

export interface VolunteerProfileFormData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: string;
  experienceLevel: string;
}

function LabeledBox({
  label,
  value,
}: Readonly<LabeledBoxProps>) {
  return (
    <Box>
      <Text fontSize="sm" fontWeight="bold" mb={1}>{label}</Text>
      <Text fontSize="sm" color="gray.500">{value || "—"}</Text>
    </Box>
  );
}

interface ProfileFieldProps {
  label: string;
  isEditing: boolean;
  registerProps?: UseFormRegisterReturn;
  value?: string;
  width?: string;
  type?: "text" | "select";
  options?: { value: string; label: string }[];
}

const ProfileField = ({
  label,
  isEditing,
  registerProps,
  value,
  width = "100%",
  type = "text",
  options,
}: ProfileFieldProps) => {
  return (
    <Box w={width}>
      {isEditing ? (
        <>
          <Text
            fontSize="xs"
            fontWeight="700"
            mb={1}
          >
            {label}
          </Text>
          {type === "select" ? (
            <NativeSelect.Root h="34px" fontSize="xs" bg="white" borderRadius="sm">
              <NativeSelect.Field {...registerProps}>
                {options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          ) : (
            <Input
              h="34px"
              fontSize="xs"
              bg="white"
              borderRadius="sm"
              borderColor="#E4E4E7"
              {...registerProps}
            />
          )}
        </>
      ) : (
        <LabeledBox
          label={label}
          value={value || ""}
        />
      )}
    </Box>
  );
};

interface VolunteerProfilePanelProps {
  variant?: string;
  showBack?: boolean;
  onBack?: () => void;
  onConfirm?: (data: VolunteerProfileFormData) => Promise<void> | void;
  volunteer?: Volunteer | null;
}

export const VolunteerProfilePanel = ({
  variant = "profile",
  showBack,
  onBack,
  onConfirm,
  volunteer,
}: VolunteerProfilePanelProps) => {
  const isNew = variant === "new";
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm<VolunteerProfileFormData>();

  // Occupation fields (not yet in Volunteer type)
  const [affiliated, setAffiliated] = useState("");
  const [notaryStatus, setNotaryStatus] = useState("");
  const [lawSchoolYear, setLawSchoolYear] = useState("");
  const [stateBarCert, setStateBarCert] = useState("");
  const [stateBarNumber, setStateBarNumber] = useState("");

  // Languages: [{language, proficiency}]
  const [languages, setLanguages] = useState<{ language: string; proficiency: string }[]>([]);

  // Interests / specializations
  const [interests, setInterests] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (volunteer) {
      reset({
        firstName: volunteer.firstName,
        lastName: volunteer.lastName,
        email: volunteer.email,
        phoneNumber: volunteer.phoneNumber || "",
        role: volunteer.role || "volunteer",
        experienceLevel: volunteer.experienceLevel || "beginner",
      });
      setLanguages((volunteer.languages ?? []).map((l) => ({ language: l, proficiency: "" })));
      setInterests(volunteer.specializations ?? []);
    }
  }, [volunteer, reset]);

  const onSubmit = async (data: VolunteerProfileFormData) => {
    if (onConfirm) await onConfirm(data);
    if (!isNew) setIsEditing(false);
  };

  if (!isNew && !volunteer) {
    return (
      <Box p={6}>
        <Text>Please select a volunteer from the list.</Text>
      </Box>
    );
  }

  return (
    <Box>
      {!isNew && volunteer && (
        <Breadcrumb.Root mb={3} fontSize="sm" color="#27272A">
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link>Volunteer Profile</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink color="#2563EB">
                {volunteer.firstName} {volunteer.lastName}
              </Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )}

      {/* Header row */}
      <Flex align="center" mb={4} gap={3}>
        <Heading size="xl" fontWeight="bold">
          {isNew ? "New Profile" : `${volunteer?.firstName} ${volunteer?.lastName}`}
        </Heading>

        {isEditing && (
          <Flex align="center" gap={1} px={2} py={1} borderWidth="1px" borderColor="yellow.400" borderRadius="md" color="yellow.700" bg="yellow.50" fontSize="xs" fontWeight="semibold">
            <Icon as={FiAlertTriangle} boxSize={3} />
            Edit Mode
          </Flex>
        )}

        <Box flex="1" />

        {!isNew && !isEditing && (
          <Button size="sm" bg="#5F80A0" color="white" _hover={{ bg: "#487C9E" }} onClick={() => setIsEditing(true)} gap={2}>
            <FiEdit2 />
            Edit
          </Button>
        )}

        {isEditing && (
          <Button size="sm" bg="#5F80A0" color="white" _hover={{ bg: "#487C9E" }} type="submit" form="profile-form" gap={2}>
            <FiSave />
            Save
          </Button>
        )}
      </Flex>


      {/* Main form container */}
      <Box
        as="form"
        id="profile-form"
        onSubmit={isNew || isEditing ? handleSubmit(onSubmit) : undefined}
      >
        {/* Confidential Form Verified */}
        <Flex borderWidth="1px" borderColor="gray.300" borderRadius="md" w="fit-content" px={3} py={2} mb={4} align="center" gap={2} >
          <Icon as={FiCheck} boxSize={4} />
          <Text fontWeight="bold" fontSize="sm">Confidential Form Verified</Text>
        </Flex>

        {!isNew && (
          <Tabs.Root defaultValue="profile" variant="enclosed" mb={4} >
            <Tabs.List w="100%">
              <Tabs.Trigger value="profile" w="100%" h="8">Profile Information</Tabs.Trigger>
              <Tabs.Trigger value="occupation" w="100%" h="8">Occupation & Credentials</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="profile" pt={6}>
              <SimpleGrid columns={2} gap={6} maxW="560px">
                <ProfileField label="First Name" isEditing={isEditing} registerProps={register("firstName")} value={volunteer?.firstName} />
                <ProfileField label="Last Name" isEditing={isEditing} registerProps={register("lastName")} value={volunteer?.lastName} />
                <ProfileField label="Phone Number" isEditing={isEditing} registerProps={register("phoneNumber")} value={volunteer?.phoneNumber || ""} />
                <ProfileField label="Email" isEditing={isEditing} registerProps={register("email")} value={volunteer?.email} />
                <ProfileField
                  label="Role"
                  isEditing={isEditing}
                  registerProps={register("role")}
                  value={volunteer?.role || "Volunteer"}
                  type="select"
                  options={[
                    { value: "volunteer", label: "Volunteer" },
                    { value: "admin", label: "Admin" },
                    { value: "staff", label: "Staff" },
                  ]}
                />
              </SimpleGrid>
            </Tabs.Content>

            <Tabs.Content value="occupation" pt={6}>
              {/* Affiliated Employer/Education */}
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Affiliated Employer/Education</Text>
                {isEditing ? (
                  <Input size="sm" borderColor="#E4E4E7" value={affiliated} onChange={(e) => setAffiliated(e.target.value)} maxW="300px" />
                ) : (
                  <Text fontSize="sm" color="gray.500">{affiliated || "—"}</Text>
                )}
              </Box>

              {/* Notary Status + Law School Year */}
              <SimpleGrid columns={2} gap={6} maxW="560px" mb={6}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>Notary Status</Text>
                  {isEditing ? (
                    <Input size="sm" borderColor="#E4E4E7" value={notaryStatus} onChange={(e) => setNotaryStatus(e.target.value)} />
                  ) : (
                    <Text fontSize="sm" color="gray.500">{notaryStatus || "—"}</Text>
                  )}
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>Law School Year</Text>
                  {isEditing ? (
                    <Input size="sm" borderColor="#E4E4E7" value={lawSchoolYear} onChange={(e) => setLawSchoolYear(e.target.value)} />
                  ) : (
                    <Text fontSize="sm" color="gray.500">{lawSchoolYear || "—"}</Text>
                  )}
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>State Bar Certificate</Text>
                  {isEditing ? (
                    <Input size="sm" borderColor="#E4E4E7" value={stateBarCert} onChange={(e) => setStateBarCert(e.target.value)} />
                  ) : (
                    <Text fontSize="sm" color="gray.500">{stateBarCert || "—"}</Text>
                  )}
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>State Bar Number</Text>
                  {isEditing ? (
                    <Input size="sm" borderColor="#E4E4E7" value={stateBarNumber} onChange={(e) => setStateBarNumber(e.target.value)} />
                  ) : (
                    <Text fontSize="sm" color="gray.500">{stateBarNumber || "—"}</Text>
                  )}
                </Box>
              </SimpleGrid>

              {/* Languages */}
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={2}>Languages</Text>
                <Box borderWidth="1px" borderColor="#E4E4E7" borderRadius="md" p={4} maxW="400px">
                  <Text fontSize="sm" color={isEditing ? "black" : "gray.400"} mb={3}>Select the languages and your proficiency level</Text>
                  {languages.length > 0 ? (
                    languages.map((entry, i) => (
                      <SimpleGrid key={i} columns={2} mb={2} gap={2} alignItems="center">
                        {isEditing ? (
                          <>
                            <NativeSelect.Root size="sm">
                              <NativeSelect.Field value={entry.language} onChange={(e) => setLanguages((prev) => prev.map((l, idx) => idx === i ? { ...l, language: e.target.value } : l))}>
                                {["English", "Spanish", "French", "Mandarin", "Japanese", "Korean", "Arabic", "Portuguese"].map((lang) => (
                                  <option key={lang} value={lang}>{lang}</option>
                                ))}
                              </NativeSelect.Field>
                              <NativeSelect.Indicator />
                            </NativeSelect.Root>
                            <Flex align="center" gap={1}>
                              <NativeSelect.Root size="sm">
                                <NativeSelect.Field value={entry.proficiency} onChange={(e) => setLanguages((prev) => prev.map((l, idx) => idx === i ? { ...l, proficiency: e.target.value } : l))}>
                                  {["Native", "Fluent", "Advanced", "Intermediate", "Elementary"].map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                  ))}
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                              </NativeSelect.Root>
                              <Icon as={FiX} boxSize={3} cursor="pointer" color="gray.400" _hover={{ color: "gray.700" }} onClick={() => setLanguages((prev) => prev.filter((_, idx) => idx !== i))} />
                            </Flex>
                          </>
                        ) : (
                          <>
                            <Text fontSize="sm">{entry.language}</Text>
                            <Text fontSize="sm" color="gray.500">{entry.proficiency || "—"}</Text>
                          </>
                        )}
                      </SimpleGrid>
                    ))
                  ) : (
                    !isEditing && <Text fontSize="sm" color="gray.500">—</Text>
                  )}
                  {isEditing && (
                    <Button size="xs" variant="ghost" color="blue.500" mt={2} onClick={() => setLanguages((prev) => [...prev, { language: "English", proficiency: "Fluent" }])}>
                      + Add Language
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Interests */}
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>Interest(s)</Text>
                <Box borderWidth="1px" borderColor="#E4E4E7" borderRadius="md" p={4} maxW="400px">
                  {interests.length > 0 || isEditing ? (
                    <Flex gap={2} wrap="wrap" align="center">
                      {interests.map((s) => (
                        <Flex key={s} align="center" gap={1} px={3} py={1} bg="gray.100" borderRadius="sm" fontSize="sm">
                          {s}
                          {isEditing && (
                            <Icon as={FiX} boxSize={3} cursor="pointer" color="gray.400" _hover={{ color: "gray.700" }} onClick={() => setInterests((prev) => prev.filter((i) => i !== s))} />
                          )}
                        </Flex>
                      ))}
                      {isEditing && (
                        <Flex align="center" gap={1}>
                          <Input
                            size="xs"
                            variant="unstyled"
                            placeholder="Add tag..."
                            value={tagInput}
                            bg="transparent"
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && tagInput.trim()) {
                                e.preventDefault();
                                setInterests((prev) => [...prev, tagInput.trim()]);
                                setTagInput("");
                              }
                            }}
                            w="80px"
                          />
                          {tagInput && (
                            <Icon as={FiX} boxSize={3} cursor="pointer" color="gray.400" onClick={() => setTagInput("")} />
                          )}
                        </Flex>
                      )}
                    </Flex>
                  ) : (
                    <Text fontSize="sm" color="gray.500">—</Text>
                  )}
                </Box>
              </Box>
            </Tabs.Content>
          </Tabs.Root>
        )}

        {isNew && (
          <SimpleGrid columns={2} gap={6} maxW="560px">
            <ProfileField label="First Name" isEditing registerProps={register("firstName")} value="" />
            <ProfileField label="Last Name" isEditing registerProps={register("lastName")} value="" />
            <ProfileField label="Phone Number" isEditing registerProps={register("phoneNumber")} value="" />
            <ProfileField label="Email Address" isEditing registerProps={register("email")} value="" />
            <ProfileField
              label="Experience Level"
              isEditing
              registerProps={register("experienceLevel")}
              value=""
              type="select"
              options={[
                { value: "beginner", label: "Beginner" },
                { value: "intermediate", label: "Intermediate" },
                { value: "advanced", label: "Advanced" },
              ]}
            />
            <Box>
              <Text fontSize="xs" fontWeight="700" mb={1}>Role</Text>
              <NativeSelect.Root h="34px" fontSize="xs" bg="white" borderRadius="sm">
                <NativeSelect.Field {...register("role")}>
                  <option value="volunteer">Volunteer</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>
          </SimpleGrid>
        )}

        {isNew && (
          <Flex mt={6} justify="flex-end">
            <Button size="sm" bg="#5F80A0" color="white" _hover={{ bg: "#487C9E" }} type="submit" gap={2}>
              <FiSave />
              Confirm
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
