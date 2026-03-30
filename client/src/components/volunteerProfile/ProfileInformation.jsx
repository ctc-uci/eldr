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
import InputMask from "react-input-mask";

import {
  NOTARY_OPTIONS,
  PROFICIENCY_OPTIONS,
} from "./profileState.js";

const primaryBlue = "#3182CE";

const FieldLabel = ({ children }) => (
  <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
    {children}
  </Text>
);

const ReadValue = ({ children, muted }) => (
  <Text fontSize="sm" lineHeight="short" color={muted ? "gray.400" : "gray.900"}>
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
  isSaving = false,
  errorMessage = "",
  languageOptions = [],
  areaOptions = [],
}) => {
  const defaultLanguage = languageOptions[0] ?? "";

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
          language: defaultLanguage,
          proficiency: PROFICIENCY_OPTIONS[0],
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

  const addInterest = (value) => {
    const v = value.trim();
    if (!v || !setData) return;
    setData((prev) =>
      prev.interests.includes(v)
        ? prev
        : { ...prev, interests: [...prev.interests, v] },
    );
  };
  const availableAreaOptions = areaOptions.filter((option) => !data.interests.includes(option));

  return (
    <Box
      bg="white"
      borderRadius="2px"
      borderWidth="1px"
      borderColor="#ECECEC"
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
            <Heading size="2xl" lineHeight="snug" fontWeight="bold" color="gray.900">
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
            borderRadius="2px"
            borderWidth="1px"
            borderColor="gray.300"
            w="fit-content"
            bg="white"
          >
            <LuFileText size={14} color="var(--chakra-colors-gray-600)" />
            <Text fontSize="xs" color="gray.700">
              Confidential Form Verified
            </Text>
          </HStack>
        </Box>

        <HStack gap={2} flexShrink={0} pt={{ base: 0, md: 1 }}>
          {isEditing ? (
            <>
              <Button
                bg={primaryBlue}
                color="white"
                size="sm"
                minW="120px"
                borderRadius="md"
                _hover={{ bg: "#2B6CB0" }}
                onClick={onSave}
                loading={isSaving}
                disabled={isSaving}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                borderRadius="md"
                bg="gray.100"
                borderColor="gray.200"
                color="gray.800"
                _hover={{ bg: "gray.200" }}
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              bg={primaryBlue}
              color="white"
              size="sm"
              borderRadius="md"
              _hover={{ bg: "#2B6CB0" }}
              onClick={onEdit}
            >
              <HStack gap={1}>
                <LuPencil size={14} />
                <Text fontSize="sm">Edit</Text>
              </HStack>
            </Button>
          )}
        </HStack>
      </Flex>

      <VStack gap={8} align="stretch">
        {/* Personal Info — 3 columns: Photo | First+Phone | Last+Email */}
        <Box>
          <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.900">
            Personal Info
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mt={8} mb={10} alignItems="start">
            <Box display="flex" flexDirection="column" alignItems="center">
              <VStack align="center" gap={2}>
                <FieldLabel
                  mb={2}
                  textAlign="center"
                  alignSelf="center"
                >
                  Photo
                </FieldLabel>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Avatar.Root
                    size="2xl"
                    style={{
                      width: "6rem",
                      height: "6rem",
                    }}
                  >
                    <Avatar.Fallback name={`${data.firstName} ${data.lastName}`} />
                    <Avatar.Image
                      src={data.photoUrl || undefined}
                    />
                  </Avatar.Root>
                </Box>
                {isEditing ? (
                  <Button
                    size="xs"
                    variant="outline"
                    colorPalette="blue"
                    disabled
                  >
                    Change Photo
                  </Button>
                ) : null}
              </VStack>
            </Box>

            <VStack gap={8} align="stretch">
              <Box>
                <FieldLabel>First Name</FieldLabel>
                {isEditing ? (
                  <Field.Root>
                    <Input
                      size="sm"
                      value={data.firstName}
                      onChange={(e) => update({ firstName: e.target.value })}
                    />
                  </Field.Root>
                ) : (
                  <ReadValue>{data.firstName}</ReadValue>
                )}
              </Box>
              <Box>
                <FieldLabel>Phone Number</FieldLabel>
                {isEditing ? (
                  <Field.Root>
                    <InputMask
                      mask="(999) 999-9999" // can change mask if designer's input mask changes
                      value={data.phone ?? ""}
                      onChange={(e) => update({ phone: e.target.value })}
                    >
                      {(inputProps) => (
                        <Input
                          {...inputProps}
                          size="sm"
                          placeholder="(___) ___-____"
                        />
                      )}
                    </InputMask>
                  </Field.Root>
                ) : (
                  <ReadValue>{data.phone}</ReadValue>
                )}
              </Box>
            </VStack>

            <VStack gap={8} align="stretch">
              <Box>
                <FieldLabel>Last Name</FieldLabel>
                {isEditing ? (
                  <Field.Root>
                    <Input
                      size="sm"
                      value={data.lastName}
                      onChange={(e) => update({ lastName: e.target.value })}
                    />
                  </Field.Root>
                ) : (
                  <ReadValue>{data.lastName}</ReadValue>
                )}
              </Box>
              <Box>
                <FieldLabel>Email</FieldLabel>
                {isEditing ? (
                  <Field.Root>
                    <Input
                      size="sm"
                      type="email"
                      value={data.email}
                      onChange={(e) => update({ email: e.target.value })}
                    />
                  </Field.Root>
                ) : (
                  <ReadValue>{data.email}</ReadValue>
                )}
              </Box>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Occupation & Credentials */}
        <Box mb={6}>
          <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.900">
            Occupation & Credentials
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={12}>
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
              <ReadValue>{data.occupation}</ReadValue>
            </Box>
            <Box>
              <FieldLabel>Law School Year</FieldLabel>
              <ReadValue muted>{data.lawSchoolYear}</ReadValue>
            </Box>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <Box>
              <FieldLabel>State Bar Certificate State</FieldLabel>
              <ReadValue muted>{data.stateBarState}</ReadValue>
            </Box>
            <Box>
              <FieldLabel>State Bar Number</FieldLabel>
              <ReadValue muted>{data.stateBarNumber}</ReadValue>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Experience: Languages + Interests / Areas */}
        <Box>
          <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.900">
            Experience
          </Text>
          <Flex direction={{ base: "column", md: "row" }} gap={6} align="flex-start">
          <Box flex="1" w="100%">
            <Text fontWeight="semibold" fontSize="md" mb={1} color="gray.900">
              Languages
            </Text>
            <Box
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
            >
            {isEditing ? (
              <Text fontSize="xs" color="gray.600" mb={3}>
                Select the languages and your proficiency level.
              </Text>
            ) : null}
            {!isEditing && data.languages.length === 0 ? (
              <Text fontSize="sm" color="gray.600">
                No languages found, please click &quot;Edit&quot; to add more
              </Text>
            ) : (
            <VStack gap={2} align="stretch">
              {data.languages.map((row) => (
                <SimpleGrid
                  key={row.id}
                  columns={2}
                  gap={2}
                  minChildWidth="0"
                >
                  {isEditing ? (
                    <>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          value={row.language}
                          onChange={(e) =>
                            updateLanguage(row.id, {
                              language: e.target.value,
                            })
                          }
                        >
                          {languageOptions.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
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
                    </>
                  ) : (
                    <>
                      <Field.Root>
                        <Input
                          size="sm"
                          readOnly
                          value={row.language}
                          bg="white"
                          borderColor="gray.200"
                          color="gray.900"
                          cursor="default"
                          _focus={{ borderColor: "gray.200", boxShadow: "none" }}
                          _readOnly={{ opacity: 1, cursor: "default" }}
                        />
                      </Field.Root>
                      <Field.Root>
                        <Input
                          size="sm"
                          readOnly
                          value={row.proficiency}
                          bg="white"
                          borderColor="gray.200"
                          color="gray.900"
                          cursor="default"
                          _focus={{ borderColor: "gray.200", boxShadow: "none" }}
                          _readOnly={{ opacity: 1, cursor: "default" }}
                        />
                      </Field.Root>
                    </>
                  )}
                </SimpleGrid>
              ))}
            </VStack>
            )}
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
          </Box>

          <Box flex="1" w="100%">
            <Text fontWeight="semibold" fontSize="md" mb={1} color="gray.900">
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
              {!isEditing && data.interests.length === 0 ? (
                <Text fontSize="sm" color="gray.600" px={1}>
                  No interests found, please click &quot;Edit&quot; to add more
                </Text>
              ) : (
                <>
                  {data.interests.map((tag) => (
                    <Tag.Root
                      key={tag}
                      size="sm"
                      bg="gray.100"
                      color="gray.900"
                    >
                      <Tag.Label>{tag}</Tag.Label>
                      <Tag.EndElement>
                        <Tag.CloseTrigger
                          disabled={!isEditing}
                          aria-label={isEditing ? `Remove ${tag}` : undefined}
                          onClick={
                            isEditing
                              ? () => removeInterest(tag)
                              : undefined
                          }
                        />
                      </Tag.EndElement>
                    </Tag.Root>
                  ))}
                  {isEditing ? (
                    <NativeSelect.Root size="sm" minW="160px" maxW="160px">
                      <NativeSelect.Field
                        defaultValue=""
                        border="none"
                        bg="transparent"
                        px={2}
                        _focus={{ boxShadow: "none", borderColor: "transparent", outline: "none" }}
                        _focusVisible={{
                          boxShadow: "none",
                          borderColor: "transparent",
                          outline: "none",
                        }}
                        onChange={(e) => {
                          addInterest(e.target.value);
                          e.target.value = "";
                        }}
                      >
                        <option value="" disabled>
                          Add tag...
                        </option>
                        {availableAreaOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  ) : null}
                </>
              )}
            </Flex>
          </Box>
        </Flex>
        </Box>
        {errorMessage ? (
          <Text color="red.600" fontSize="sm">
            {errorMessage}
          </Text>
        ) : null}
      </VStack>
    </Box>
  );
};
