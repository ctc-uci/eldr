import { useEffect, useState } from "react";
import { Box, Breadcrumb, Button, Flex, Heading, Icon, Input, NativeSelect, Tabs, Text } from "@chakra-ui/react";
import { LuCircleUser, LuBriefcase } from "react-icons/lu";
import { FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";
import { VolunteerProfileFormData } from "./VolunteerProfilePanel";

interface LanguageOption { id: number; language: string; }
interface LanguageEntry { languageId: number; language: string; proficiency: string; }

const TagInput = ({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
}: {
  tags: string[];
  tagInput: string;
  onTagInputChange: (v: string) => void;
  onAddTag: (v: string) => void;
  onRemoveTag: (v: string) => void;
}) => (
  <Box borderWidth="1px" borderColor="#E4E4E7" borderRadius="md" p={3} minH="80px">
    <Flex gap={2} wrap="wrap" align="center">
      {tags.map((t) => (
        <Flex key={t} align="center" gap={1} px={2} py={0.5} bg="gray.100" borderRadius="sm" fontSize="sm">
          {t}
          <Icon as={FiX} boxSize={3} cursor="pointer" color="gray.400" _hover={{ color: "gray.700" }} onClick={() => onRemoveTag(t)} />
        </Flex>
      ))}
      <Flex align="center" gap={1}>
        <Input
          size="xs"
          variant="unstyled"
          placeholder="Add tag here..."
          bg="transparent"
          value={tagInput}
          onChange={(e) => onTagInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && tagInput.trim()) {
              e.preventDefault();
              onAddTag(tagInput.trim());
              onTagInputChange("");
            }
          }}
          w="120px"
          color="black"
          _placeholder={{ color: "#A1A1AA" }}
        />
        {tagInput && (
          <Icon as={FiX} boxSize={3} cursor="pointer" color="gray.400" onClick={() => onTagInputChange("")} />
        )}
      </Flex>
    </Flex>
  </Box>
);

export const AddProfileView = () => {
  const { backend } = useBackendContext();
  const { role: currentUserRole } = useRoleContext();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, trigger } = useForm<VolunteerProfileFormData>();
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
  const [affiliated, setAffiliated] = useState("");
  const [notaryStatus, setNotaryStatus] = useState("");
  const [lawSchoolYear, setLawSchoolYear] = useState("");
  const [stateBarCertState, setStateBarCertState] = useState("");
  const [stateBarNumber, setStateBarNumber] = useState("");
  const [languages, setLanguages] = useState<LanguageEntry[]>([{ languageId: 0, language: "", proficiency: "" }]);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [experience, setExperience] = useState<string[]>([]);
  const [experienceInput, setExperienceInput] = useState("");

  useEffect(() => {
    backend.get<LanguageOption[]>("/languages").then((res) => setLanguageOptions(res.data)).catch((error) => console.error("Error fetching languages:", error));
  }, [backend]);

  const handleContinue = async () => {
    const valid = await trigger(["firstName", "lastName", "phoneNumber", "email", "role"]);
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
          isSupervisor: data.role === "supervisor",
        });
      } else {
        const volunteerRes = await backend.post<{ id: number }>("/volunteers", {
          firebaseUid: crypto.randomUUID(),
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber,
          is_notary: notaryStatus === "active" ? true : notaryStatus === "inactive" ? false : null,
        });

        const volunteerId = volunteerRes.data.id;

        const tasks: Promise<unknown>[] = [];

        // Save extra credential fields
        tasks.push(
          backend.put(`/volunteers/${volunteerId}`, {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone_number: data.phoneNumber,
            is_notary: notaryStatus === "active" ? true : notaryStatus === "inactive" ? false : null,
            affiliated_employer: affiliated || null,
            law_school_year: lawSchoolYear || null,
            state_bar_certificate: stateBarCertState || null,
            state_bar_number: stateBarNumber || null,
          })
        );

        const validLanguages = languages.filter((l) => l.languageId !== 0);
        if (validLanguages.length > 0) {
          tasks.push(
            backend.post(`/volunteers/${volunteerId}/languages`, {
              languages: validLanguages.map((l) => ({
                languageId: l.languageId,
                proficiency: l.proficiency || "proficient",
                isLiterate: true,
              })),
            })
          );
        }

        // Save interests
        const areasRes = await backend.get<{ id: number; areasOfPractice: string }[]>("/areas-of-practice");
        const areasList = areasRes.data;
        for (const name of interests) {
          const area = areasList.find((a) => a.areasOfPractice.toLowerCase() === name.toLowerCase());
          if (area) {
            tasks.push(backend.post(`/volunteers/${volunteerId}/areas-of-practice`, { areaOfPracticeId: area.id }));
          } else {
            const created = await backend.post<{ id: number }>("/areas-of-practice", { areaOfPractice: name });
            tasks.push(backend.post(`/volunteers/${volunteerId}/areas-of-practice`, { areaOfPracticeId: created.data.id }));
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
      <Heading size="xl" fontWeight="bold" mb={4}>New Profile</Heading>

      <Breadcrumb.Root mb={6} fontSize="sm" color="#27272A">
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link onClick={() => navigate("/volunteer-management")} cursor="pointer">
              User Management
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink color="#2563EB">Add Profile</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <Tabs.Root value={activeTab} onValueChange={handleTabChange} variant="outline">
        <Tabs.List borderBottom="none" pb={0}>
          <Tabs.Trigger value="profile" h="8" gap={2}><LuCircleUser /> Profile Information</Tabs.Trigger>
          <Tabs.Trigger
            value="occupation"
            h="8"
            gap={2}
            disabled={!profileCompleted}
            opacity={!profileCompleted ? 0.4 : 1}
            cursor={!profileCompleted ? "not-allowed" : "pointer"}
          >
            <LuBriefcase /> Occupation & Credentials
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="profile" pt={0}>
          <Box borderWidth="1px" borderTopWidth={0} borderColor="#E4E4E7" borderBottomRadius="md" borderTopRadius={0} p={8}>
            <Text fontSize="lg" fontWeight="semibold" color="#2563EB" mb={6}>Profile Information</Text>

            <Flex gap={4} mb={6}>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>First Name <Box as="span" color="red.500">*</Box></Text>
                <Input placeholder="Type here" borderColor="#E4E4E7" {...register("firstName", { required: true })} />
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>Last Name <Box as="span" color="red.500">*</Box></Text>
                <Input placeholder="Type here" borderColor="#E4E4E7" {...register("lastName", { required: true })} />
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>Phone Number <Box as="span" color="red.500">*</Box></Text>
                <Input placeholder="Type here" borderColor="#E4E4E7" {...register("phoneNumber", { required: true })} />
              </Box>
            </Flex>

            <Flex gap={4} mb={8}>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>Email <Box as="span" color="red.500">*</Box></Text>
                <Input placeholder="Type here" borderColor="#E4E4E7" {...register("email", { required: true })} />
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>Role <Box as="span" color="red.500">*</Box></Text>
                <NativeSelect.Root borderColor="#E4E4E7">
                  <NativeSelect.Field
                    placeholder="Type here to search"
                    color={!roleValue ? "#A1A1AA" : "inherit"}
                    {...register("role", { required: true })}
                  >
                    <option value="volunteer">Volunteer</option>
                    {currentUserRole === "supervisor" && <option value="staff">Staff</option>}
                    {currentUserRole === "supervisor" && <option value="supervisor">Supervisor</option>}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
              <Box flex={1} />
            </Flex>

            <Flex justify="flex-end">
              <Button bg="#5F80A0" color="white" _hover={{ bg: "#487C9E" }} onClick={handleContinue}>
                Continue
              </Button>
            </Flex>
          </Box>
        </Tabs.Content>

        <Tabs.Content value="occupation" pt={0}>
          <Box borderWidth="1px" borderTopWidth={0} borderColor="#E4E4E7" borderBottomRadius="md" borderTopRadius={0} p={8}>
            {/* Header */}
            <Flex align="center" justify="space-between" mb={8}>
              <Text fontSize="lg" fontWeight="semibold" color="#2563EB">Occupation & Credentials</Text>
              <Flex gap={3}>
                <Button bg="#5F80A0" color="white" _hover={{ bg: "#487C9E" }} gap={2} onClick={handleSubmit(onCreateProfile)}>
                  <LuCircleUser />
                  Create Profile
                </Button>
                <Button variant="outline" bg="#F4F4F5" borderColor="#E4E4E7" color="#27272A" _hover={{ bg: "#E4E4E7" }} onClick={() => navigate("/volunteer-management")}>
                  Cancel
                </Button>
              </Flex>
            </Flex>

            {/* Row 1 */}
            <Flex gap={6} mb={8}>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>Affiliated Employer/Education <Box as="span" color="red.500">*</Box></Text>
                <Flex align="center" borderWidth="1px" borderColor="#E4E4E7" borderRadius="md" px={3} h="40px" gap={2}>
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
                <Text fontSize="sm" fontWeight="semibold" mb={1}>Notary Status <Box as="span" color="red.500">*</Box></Text>
                <NativeSelect.Root borderColor="#E4E4E7">
                  <NativeSelect.Field
                    placeholder="Select here"
                    color={!notaryStatus ? "#A1A1AA" : "inherit"}
                    value={notaryStatus}
                    onChange={(e) => setNotaryStatus(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="none">None</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>Law School Year</Text>
                <NativeSelect.Root borderColor="#E4E4E7">
                  <NativeSelect.Field
                    placeholder="Select here"
                    color={!lawSchoolYear ? "#A1A1AA" : "inherit"}
                    value={lawSchoolYear}
                    onChange={(e) => setLawSchoolYear(e.target.value)}
                  >
                    {["1L", "2L", "3L", "Graduate"].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
            </Flex>

            {/* Row 2 */}
            <Flex gap={6} mb={8} align="flex-start">
              <Box w="180px" flexShrink={0}>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>State Bar Certificate State</Text>
                <NativeSelect.Root borderColor="#E4E4E7">
                  <NativeSelect.Field
                    placeholder="Select here"
                    color={!stateBarCertState ? "#A1A1AA" : "inherit"}
                    value={stateBarCertState}
                    onChange={(e) => setStateBarCertState(e.target.value)}
                  >
                    {["CA", "NY", "TX", "FL", "WA"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
              <Box w="200px" flexShrink={0}>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>State Bar Number</Text>
                <Input
                  borderColor="#E4E4E7"
                  placeholder="Enter number"
                  _placeholder={{ color: "#A1A1AA" }}
                  value={stateBarNumber}
                  onChange={(e) => setStateBarNumber(e.target.value)}
                />
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>Interest(s)</Text>
                <TagInput
                  tags={interests}
                  tagInput={interestInput}
                  onTagInputChange={setInterestInput}
                  onAddTag={(v) => setInterests((prev) => prev.includes(v) ? prev : [...prev, v])}
                  onRemoveTag={(v) => setInterests((prev) => prev.filter((i) => i !== v))}
                />
              </Box>
            </Flex>

            {/* Row 3 */}
            <Flex gap={6} align="flex-start">
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="semibold" mb={2}>Languages</Text>
                <Box borderWidth="1px" borderColor="#E4E4E7" borderRadius="md" p={4}>
                  <Text fontSize="sm" color="gray.500" mb={3}>Select the languages and your proficiency level</Text>
                  {languages.map((entry, i) => (
                    <Flex key={i} gap={2} mb={2} align="center">
                      <NativeSelect.Root borderColor="#E4E4E7" flex={1}>
                        <NativeSelect.Field
                          placeholder="Language"
                          color={!entry.languageId ? "#A1A1AA" : "inherit"}
                          value={entry.languageId || ""}
                          onChange={(e) => {
                            const id = Number(e.target.value);
                            const lang = languageOptions.find((l) => l.id === id);
                            setLanguages((prev) => prev.map((l, idx) => idx === i ? { ...l, languageId: id, language: lang?.language ?? "" } : l));
                          }}
                        >
                          {languageOptions.map((l) => (
                            <option key={l.id} value={l.id}>{l.language}</option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      <NativeSelect.Root borderColor="#E4E4E7" flex={1}>
                        <NativeSelect.Field
                          placeholder="Proficiency"
                          color={!entry.proficiency ? "#A1A1AA" : "inherit"}
                          value={entry.proficiency}
                          onChange={(e) => setLanguages((prev) => prev.map((l, idx) => idx === i ? { ...l, proficiency: e.target.value } : l))}
                        >
                          {["Proficient", "Professional", "Native/Fluent"].map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      {languages.length > 1 && (
                        <Icon as={FiX} boxSize={3} cursor="pointer" color="gray.400" _hover={{ color: "gray.700" }} onClick={() => setLanguages((prev) => prev.filter((_, idx) => idx !== i))} />
                      )}
                    </Flex>
                  ))}
                  <Button size="xs" variant="ghost" color="blue.500" mt={2} gap={1} onClick={() => setLanguages((prev) => [...prev, { languageId: 0, language: "", proficiency: "" }])}>
                    + Add Language
                  </Button>
                </Box>
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="semibold" mb={2}>Experience</Text>
                <TagInput
                  tags={experience}
                  tagInput={experienceInput}
                  onTagInputChange={setExperienceInput}
                  onAddTag={(v) => setExperience((prev) => prev.includes(v) ? prev : [...prev, v])}
                  onRemoveTag={(v) => setExperience((prev) => prev.filter((e) => e !== v))}
                />
              </Box>
            </Flex>
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};
