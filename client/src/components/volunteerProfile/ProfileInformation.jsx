import { useRef } from "react";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  NativeSelect,
  SimpleGrid,
  Textarea,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuFileText, LuPencil, LuTriangleAlert, LuX } from "react-icons/lu";
import InputMask from "react-input-mask";

import {
  NOTARY_OPTIONS,
  PROFICIENCY_OPTIONS,
} from "./profileState.js";


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

const editBlue = "#3B6F8F";

export const ProfileInformation = ({
  data,
  setData,
  isEditing,
  showUpdatedBadge,
  onEdit,
  onSave,
  onCancel,
  onPhotoSelect,
  isSaving = false,
  photoError = "",
  errorMessage = "",
  languageOptions = [],
  areaOptions = [],
}) => {
  const photoInputRef = useRef(null);
  const defaultLanguage = languageOptions[0] ?? "";

  const handlePhotoInputChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file && onPhotoSelect) {
      onPhotoSelect(file);
    }
  };

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

  const removeLanguageRow = (id) => {
    if (!setData) return;
    setData((prev) => ({
      ...prev,
      languages: prev.languages.filter((row) => row.id !== id),
    }));
  };

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
            <Heading size="2xl" lineHeight="snug" fontWeight="semibold" color="gray.900">
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
                bg={editBlue}
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
              bg={editBlue}
              color="white"
              size="sm"
              borderRadius="md"
              _hover={{ bg: "#2B6CB0" }}
              onClick={onEdit}
            >
              <HStack gap={2}>
                <Text fontSize="sm">Edit</Text>
                <LuPencil size={14} />
              </HStack>
            </Button>
          )}
        </HStack>
      </Flex>

      <VStack gap={8} align="stretch">
        {/* Personal Info — 3 columns: Photo | First+Phone | Last+Email */}
        <Box>
          <Text fontWeight="semibold" fontSize="lg" mb={4} color="gray.900">
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
                  <>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      hidden
                      onChange={handlePhotoInputChange}
                    />
                    <Button
                      size="xs"
                      variant="solid"
                      bg={editBlue}
                      color="white"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={isSaving}
                    >
                      Change Photo
                    </Button>
                    {photoError ? (
                      <Text fontSize="xs" color="red.600" textAlign="center" maxW="12rem">
                        {photoError}
                      </Text>
                    ) : null}
                  </>
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
          <Text fontWeight="semibold" fontSize="lg" mb={4} color="gray.900">
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

        {/* Experience: Languages + Listed Experience */}
        <Box minW={0}>
          <Text fontWeight="semibold" fontSize="lg" mb={4} color="gray.900">
            Experience
          </Text>
          <Flex direction={{ base: "column", md: "row" }} gap={6} align="flex-start" minW={0}>
          <Box flex="1" minW={0} w="100%">
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
              <Text fontSize="sm" color="#A1A1AA" mb={3} fontWeight="normal">
                Select the languages and your proficiency level.
              </Text>
            ) : null}
            {!isEditing && data.languages.length === 0 ? (
              <Text fontSize="sm" color="gray.600">
                No languages found, please click &quot;Edit&quot; to add more.
              </Text>
            ) : (
            <VStack gap={2} align="stretch">
              {data.languages.map((row) =>
                isEditing ? (
                  <Flex key={row.id} gap={2} align="center" minW={0}>
                    <NativeSelect.Root size="sm" flex={1} minW={0}>
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
                    <NativeSelect.Root size="sm" flex={1} minW={0}>
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
                    <IconButton
                      aria-label={`Remove ${row.language}`}
                      variant="ghost"
                      size="xs"
                      color="gray.500"
                      flexShrink={0}
                      onClick={() => removeLanguageRow(row.id)}
                    >
                      <LuX size={14} />
                    </IconButton>
                  </Flex>
                ) : (
                  <SimpleGrid
                    key={row.id}
                    columns={2}
                    gap={2}
                    minChildWidth="0"
                  >
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
                  </SimpleGrid>
                ),
              )}
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

          <Box flex="1" minW={0} w="100%">
            <Text fontWeight="semibold" fontSize="md" mb={1} color="gray.900">
              Listed Experience
            </Text>
            {isEditing ? (
              <Textarea
                size="sm"
                value={data.listedExperience ?? ""}
                onChange={(e) => update({ listedExperience: e.target.value })}
                placeholder="Enter listed experience."
                _placeholder={{ color: "#A1A1AA" }}
                minH="96px"
                resize="none"
                p={4}
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                w="100%"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
                overflowWrap="anywhere"
              />
            ) : (
              <Box
                p={4}
                w="100%"
                minW={0}
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                overflow="hidden"
              >
                <Text
                  fontSize="sm"
                  lineHeight="short"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  overflowWrap="anywhere"
                  color={data.listedExperience?.trim() ? "gray.900" : "gray.600"}
                >
                  {data.listedExperience?.trim() || 'No experience found, please click "Edit" to add more.'}
                </Text>
              </Box>
            )}
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
