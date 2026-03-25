import { useState } from "react";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Heading,
  HStack,
  Input,
  NativeSelect,
  SimpleGrid,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuFileText, LuPencil, LuTriangleAlert } from "react-icons/lu";

import {
  LANGUAGE_OPTIONS,
  LAW_YEAR_OPTIONS,
  NOTARY_OPTIONS,
  OCCUPATION_OPTIONS,
  PROFICIENCY_OPTIONS,
  STATE_OPTIONS,
} from "./profileState.js";

const primaryBlue = "#3182CE";

const FieldLabel = ({ children }) => (
  <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
    {children}
  </Text>
);

const ReadValue = ({ children, muted }) => (
  <Text fontSize="sm" color={muted ? "gray.400" : "gray.900"}>
    {children}
  </Text>
);

export const ProfileInformation = ({
  data,
  setData,
  isEditing,
  showUpdatedBadge,
  onEdit,
  onSave,
  onCancel,
}) => {
  const update = (patch) => {
    if (!setData) return;
    setData((prev) => ({ ...prev, ...patch }));
  };

  const updateLanguage = (id, patch) => {
    if (!setData) return;
    setData((prev) => ({
      ...prev,
      languages: prev.languages.map((row) =>
        row.id === id ? { ...row, ...patch } : row,
      ),
    }));
  };

  const addLanguageRow = () => {
    if (!setData) return;
    setData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        {
          id: `lang-${Date.now()}`,
          language: "English",
          proficiency: "Elementary",
        },
      ],
    }));
  };

  const removeInterest = (tag) => {
    if (!setData) return;
    setData((prev) => ({
      ...prev,
      interests: prev.interests.filter((t) => t !== tag),
    }));
  };

  const [interestInput, setInterestInput] = useState("");

  const addInterest = () => {
    const v = interestInput.trim();
    if (!v || !setData) return;
    setData((prev) =>
      prev.interests.includes(v)
        ? prev
        : { ...prev, interests: [...prev.interests, v] },
    );
    setInterestInput("");
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.100"
      p={{ base: 5, md: 8 }}
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={6}
      >
        <Box>
          <HStack flexWrap="wrap" gap={2} mb={2}>
            <Heading size="lg" fontWeight="bold" color="gray.900">
              Profile Information
            </Heading>
            {isEditing ? (
              <Badge
                px={2}
                py={0.5}
                borderRadius="md"
                bg="yellow.100"
                color="yellow.900"
                fontWeight="semibold"
                display="inline-flex"
                alignItems="center"
                gap={1}
              >
                <LuTriangleAlert size={14} />
                Edit Mode
              </Badge>
            ) : null}
            {!isEditing && showUpdatedBadge ? (
              <Badge
                px={2}
                py={0.5}
                borderRadius="md"
                bg="green.100"
                color="green.800"
                fontWeight="semibold"
              >
                ✓ Updated
              </Badge>
            ) : null}
          </HStack>

          <HStack
            gap={2}
            px={2}
            py={1}
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.300"
            w="fit-content"
            bg="gray.50"
          >
            <LuFileText size={14} color="var(--chakra-colors-gray-600)" />
            <Text fontSize="xs" color="gray.700">
              Confidential Form Verified
            </Text>
          </HStack>
        </Box>

        <HStack gap={2} flexShrink={0}>
          {isEditing ? (
            <>
              <Button
                bg={primaryBlue}
                color="white"
                size="sm"
                _hover={{ bg: "#2B6CB0" }}
                onClick={onSave}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                bg="gray.100"
                borderColor="gray.200"
                color="gray.800"
                _hover={{ bg: "gray.200" }}
                onClick={onCancel}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              bg={primaryBlue}
              color="white"
              size="sm"
              _hover={{ bg: "#2B6CB0" }}
              onClick={onEdit}
            >
              <HStack gap={1}>
                <LuPencil size={16} />
                <Text>Edit</Text>
              </HStack>
            </Button>
          )}
        </HStack>
      </Flex>

      <VStack gap={8} align="stretch">
        {/* Personal Info */}
        <Box>
          <Text fontWeight="bold" fontSize="md" mb={4} color="gray.900">
            Personal Info
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <Box>
              <FieldLabel>Photo</FieldLabel>
              <HStack align="start" gap={6} flexWrap="wrap">
                <Avatar.Root size="2xl">
                  <Avatar.Fallback name={`${data.firstName} ${data.lastName}`} />
                  <Avatar.Image src={data.photoUrl || undefined} />
                </Avatar.Root>
                {isEditing ? (
                  <Button
                    size="xs"
                    variant="outline"
                    colorPalette="blue"
                    mt={2}
                    onClick={() => {
                      /* placeholder — file upload later */
                    }}
                  >
                    Change Photo
                  </Button>
                ) : null}
              </HStack>
            </Box>
            <Box />

            <Box>
              <FieldLabel>First Name</FieldLabel>
              {isEditing ? (
                <Field.Root>
                  <Input
                    value={data.firstName}
                    onChange={(e) => update({ firstName: e.target.value })}
                  />
                </Field.Root>
              ) : (
                <ReadValue>{data.firstName}</ReadValue>
              )}
            </Box>
            <Box>
              <FieldLabel>Last Name</FieldLabel>
              {isEditing ? (
                <Field.Root>
                  <Input
                    value={data.lastName}
                    onChange={(e) => update({ lastName: e.target.value })}
                  />
                </Field.Root>
              ) : (
                <ReadValue>{data.lastName}</ReadValue>
              )}
            </Box>
            <Box>
              <FieldLabel>Phone Number</FieldLabel>
              {isEditing ? (
                <Field.Root>
                  <Input
                    value={data.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                  />
                </Field.Root>
              ) : (
                <ReadValue>{data.phone}</ReadValue>
              )}
            </Box>
            <Box>
              <FieldLabel>Email</FieldLabel>
              {isEditing ? (
                <Field.Root>
                  <Input
                    type="email"
                    value={data.email}
                    onChange={(e) => update({ email: e.target.value })}
                  />
                </Field.Root>
              ) : (
                <ReadValue>{data.email}</ReadValue>
              )}
            </Box>
          </SimpleGrid>
        </Box>

        {/* Occupation & Credentials */}
        <Box>
          <Text fontWeight="bold" fontSize="md" mb={4} color="gray.900">
            Occupation & Credentials
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={6}>
            <Box>
              <FieldLabel>Notary Status</FieldLabel>
              {isEditing ? (
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={data.notary}
                    onChange={(e) => update({ notary: e.target.value })}
                  >
                    {NOTARY_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              ) : (
                <ReadValue>{data.notary}</ReadValue>
              )}
            </Box>
            <Box>
              <FieldLabel>Occupation</FieldLabel>
              {isEditing ? (
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={data.occupation}
                    onChange={(e) => update({ occupation: e.target.value })}
                  >
                    {OCCUPATION_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              ) : (
                <ReadValue>{data.occupation}</ReadValue>
              )}
            </Box>
            <Box>
              <FieldLabel>Law School Year</FieldLabel>
              {isEditing ? (
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={data.lawSchoolYear}
                    onChange={(e) => update({ lawSchoolYear: e.target.value })}
                  >
                    {LAW_YEAR_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              ) : (
                <ReadValue>{data.lawSchoolYear}</ReadValue>
              )}
            </Box>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <Box>
              <FieldLabel>State Bar Certificate State</FieldLabel>
              {isEditing ? (
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={data.stateBarState}
                    onChange={(e) => update({ stateBarState: e.target.value })}
                  >
                    {STATE_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              ) : (
                <ReadValue muted={data.stateBarState === "N/A"}>
                  {data.stateBarState}
                </ReadValue>
              )}
            </Box>
            <Box>
              <FieldLabel>State Bar Number</FieldLabel>
              {isEditing ? (
                <Field.Root>
                  <Input
                    value={data.stateBarNumber}
                    onChange={(e) =>
                      update({ stateBarNumber: e.target.value })
                    }
                  />
                </Field.Root>
              ) : (
                <ReadValue muted={data.stateBarNumber === "N/A"}>
                  {data.stateBarNumber}
                </ReadValue>
              )}
            </Box>
          </SimpleGrid>
        </Box>

        {/* Experience: Languages + Interests / Areas */}
        <Box>
          <Text fontWeight="bold" fontSize="md" mb={4} color="gray.900">
            Experience
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} alignItems="start">
          <Box
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
            bg="gray.50"
          >
            <Text fontWeight="semibold" fontSize="sm" mb={1}>
              Languages
            </Text>
            <Text fontSize="xs" color="gray.600" mb={3}>
              Select the languages and your proficiency level.
            </Text>
            <VStack gap={2} align="stretch">
              {data.languages.map((row) => (
                <HStack key={row.id} gap={2} flexWrap="wrap">
                  {isEditing ? (
                    <>
                      <Box flex="1" minW="120px">
                        <NativeSelect.Root size="sm">
                          <NativeSelect.Field
                            value={row.language}
                            onChange={(e) =>
                              updateLanguage(row.id, {
                                language: e.target.value,
                              })
                            }
                          >
                            {LANGUAGE_OPTIONS.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Box>
                      <Box flex="1" minW="120px">
                        <NativeSelect.Root size="sm">
                          <NativeSelect.Field
                            value={row.proficiency}
                            onChange={(e) =>
                              updateLanguage(row.id, {
                                proficiency: e.target.value,
                              })
                            }
                          >
                            {PROFICIENCY_OPTIONS.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        px={3}
                        py={1.5}
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="md"
                        fontSize="sm"
                      >
                        {row.language}
                      </Box>
                      <Box
                        px={3}
                        py={1.5}
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="md"
                        fontSize="sm"
                      >
                        {row.proficiency}
                      </Box>
                    </>
                  )}
                </HStack>
              ))}
            </VStack>
            {isEditing ? (
              <Button
                variant="plain"
                size="sm"
                colorPalette="blue"
                fontWeight="semibold"
                mt={3}
                px={0}
                h="auto"
                onClick={addLanguageRow}
              >
                + Add Language
              </Button>
            ) : null}
          </Box>

          <Box
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
            bg="gray.50"
          >
            <Text fontWeight="semibold" fontSize="sm" mb={3}>
              Interests(s)
            </Text>
            <Flex
              flexWrap="wrap"
              gap={2}
              align="center"
              minH="44px"
              p={2}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
            >
              {data.interests.map((tag) => (
                <Tag.Root
                  key={tag}
                  size="md"
                  borderRadius="full"
                  bg="gray.200"
                  color="gray.900"
                >
                  <Tag.Label>{tag}</Tag.Label>
                  {isEditing ? (
                    <Tag.CloseTrigger onClick={() => removeInterest(tag)} />
                  ) : null}
                </Tag.Root>
              ))}
              {isEditing ? (
                <Input
                  flex="1"
                  minW="120px"
                  border="none"
                  _focus={{ boxShadow: "none" }}
                  placeholder="Add tag..."
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInterest();
                    }
                  }}
                />
              ) : null}
            </Flex>
          </Box>
        </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};
