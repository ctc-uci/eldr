import { useEffect, useRef, useState } from "react";

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
import {
  LuChevronDown,
  LuFileText,
  LuPencil,
  LuTriangleAlert,
  LuX,
} from "react-icons/lu";
import InputMask from "react-input-mask";

import {
  NOTARY_OPTIONS,
  PROFICIENCY_OPTIONS,
} from "./profileState.js";

const ModernDropdown = ({
  value,
  options = [],
  placeholder = "Select...",
  onChange,
  flex = 1,
  minW = 0,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <Box position="relative" ref={containerRef} flex={flex} minW={minW} w="100%">
      <Flex
        align="center"
        justify="space-between"
        border="1px solid"
        borderColor={open ? "#3182CE" : "#E4E4E7"}
        borderRadius="6px"
        px="12px"
        h="42px"
        cursor="pointer"
        bg="white"
        userSelect="none"
        gap="8px"
        w="100%"
        minW={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        tabIndex={0}
        _hover={{ borderColor: open ? "#3182CE" : "#D4D4D8" }}
        transition="border-color 0.15s ease"
      >
        <Text fontSize="14px" color={value ? "#27272A" : "#A1A1AA"} truncate>
          {value || placeholder}
        </Text>
        <LuChevronDown
          size={16}
          color="#9CA3AF"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            flexShrink: 0,
          }}
        />
      </Flex>

      {open && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          left={0}
          right={0}
          bg="white"
          border="1px solid"
          borderColor="#E4E4E7"
          borderRadius="6px"
          boxShadow="lg"
          zIndex={9999}
          maxH="220px"
          overflowY="auto"
          py={1}
        >
          {options.map((opt) => (
            <Flex
              key={opt}
              px="12px"
              py="9px"
              cursor="pointer"
              align="center"
              bg={opt === value ? "#F4F4F5" : "white"}
              fontWeight={opt === value ? "semibold" : "normal"}
              _hover={{ bg: "#F4F4F5" }}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <Text fontSize="14px" color="#27272A" truncate>
                {opt}
              </Text>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
};


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
          verbalProficiency: PROFICIENCY_OPTIONS[0],
          writtenProficiency: PROFICIENCY_OPTIONS[0],
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
          <Box flex={{ base: "1", md: "1.75" }} minW={0} w="100%">
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
                Select the languages and your verbal and written proficiency levels.
              </Text>
            ) : null}
            {!isEditing && data.languages.length === 0 ? (
              <Text fontSize="sm" color="gray.600">
                No languages found, please click &quot;Edit&quot; to add more.
              </Text>
            ) : (
            <VStack gap={2} align="stretch">
              {isEditing && data.languages.length > 0 ? (
                <Flex gap={2} mb={1} px={1} align="center">
                  <Text fontSize="12px" fontWeight="semibold" color="#71717A" flex={1.2}>
                    Language
                  </Text>
                  <Text fontSize="12px" fontWeight="semibold" color="#71717A" flex={1}>
                    Verbal
                  </Text>
                  <Text fontSize="12px" fontWeight="semibold" color="#71717A" flex={1}>
                    Written
                  </Text>
                  <Box w="36px" flexShrink={0} />
                </Flex>
              ) : null}
              {!isEditing && data.languages.length > 0 ? (
                <SimpleGrid columns={{ base: 1, sm: 3 }} gap={2} mb={1} px={1}>
                  <Text fontSize="12px" fontWeight="semibold" color="#71717A">
                    Language
                  </Text>
                  <Text fontSize="12px" fontWeight="semibold" color="#71717A">
                    Verbal
                  </Text>
                  <Text fontSize="12px" fontWeight="semibold" color="#71717A">
                    Written
                  </Text>
                </SimpleGrid>
              ) : null}
              {data.languages.map((row) =>
                isEditing ? (
                  <Flex key={row.id} gap={2} align="center" minW={0}>
                    <ModernDropdown
                      value={row.language}
                      options={languageOptions}
                      placeholder="Select language"
                      flex={1.2}
                      onChange={(val) =>
                        updateLanguage(row.id, {
                          language: val,
                        })
                      }
                    />
                    <ModernDropdown
                      value={row.verbalProficiency ?? PROFICIENCY_OPTIONS[0]}
                      options={PROFICIENCY_OPTIONS}
                      flex={1}
                      onChange={(val) =>
                        updateLanguage(row.id, {
                          verbalProficiency: val,
                        })
                      }
                    />
                    <ModernDropdown
                      value={row.writtenProficiency ?? PROFICIENCY_OPTIONS[0]}
                      options={PROFICIENCY_OPTIONS}
                      flex={1}
                      onChange={(val) =>
                        updateLanguage(row.id, {
                          writtenProficiency: val,
                        })
                      }
                    />
                    <IconButton
                      aria-label={`Remove ${row.language}`}
                      variant="ghost"
                      size="sm"
                      h="42px"
                      w="36px"
                      color="gray.400"
                      _hover={{ bg: "#F4F4F5", color: "red.500" }}
                      borderRadius="6px"
                      flexShrink={0}
                      onClick={() => removeLanguageRow(row.id)}
                    >
                      <LuX size={16} />
                    </IconButton>
                  </Flex>
                ) : (
                  <SimpleGrid
                    key={row.id}
                    columns={{ base: 1, sm: 3 }}
                    gap={2}
                    minChildWidth="0"
                  >
                    <Flex
                      align="center"
                      px="12px"
                      h="42px"
                      border="1px solid"
                      borderColor="#E4E4E7"
                      borderRadius="6px"
                      bg="#FAFAFA"
                      overflow="hidden"
                      minW={0}
                    >
                      <Text fontSize="14px" fontWeight="medium" color="#27272A" truncate>
                        {row.language}
                      </Text>
                    </Flex>
                    <Flex
                      align="center"
                      px="12px"
                      h="42px"
                      border="1px solid"
                      borderColor="#E4E4E7"
                      borderRadius="6px"
                      bg="white"
                      overflow="hidden"
                      minW={0}
                    >
                      <Text fontSize="14px" color="#27272A" truncate>
                        {row.verbalProficiency || "—"}
                      </Text>
                    </Flex>
                    <Flex
                      align="center"
                      px="12px"
                      h="42px"
                      border="1px solid"
                      borderColor="#E4E4E7"
                      borderRadius="6px"
                      bg="white"
                      overflow="hidden"
                      minW={0}
                    >
                      <Text fontSize="14px" color="#27272A" truncate>
                        {row.writtenProficiency || "—"}
                      </Text>
                    </Flex>
                  </SimpleGrid>
                ),
              )}
            </VStack>
            )}
            {isEditing ? (
              <Button
                variant="outline"
                size="sm"
                borderColor="#E4E4E7"
                color="#27272A"
                bg="white"
                fontWeight="medium"
                _hover={{ bg: "#F4F4F5", borderColor: "#D4D4D8" }}
                mt={3}
                h="36px"
                borderRadius="6px"
                onClick={addLanguageRow}
              >
                + Add Language
              </Button>
            ) : null}
            </Box>
          </Box>

          <Box flex={{ base: "1", md: "1" }} minW={0} w="100%">
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
                resize="vertical"
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
                minH="96px"
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                overflow="auto"
                resize="vertical"
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
