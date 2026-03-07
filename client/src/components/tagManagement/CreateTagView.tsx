import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { APPLY_TO_OPTIONS } from "./types";

type CreateTagPayload = {
  name: string;
  applyTo: string;
  description: string;
};

export function CreateTagView({
  onCancel,
  onSave,
  initialValues,
  pageTitle = "Create New Tag",
  submitLabel = "Create & Save",
}: {
  onCancel: () => void;
  onSave: (tag: CreateTagPayload) => Promise<void> | void;
  initialValues?: CreateTagPayload;
  pageTitle?: string;
  submitLabel?: string;
}) {
  const [tagName, setTagName] = useState(initialValues?.name ?? "");
  const [applyTo, setApplyTo] = useState(initialValues?.applyTo ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [applyDropdownOpen, setApplyDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTagName(initialValues?.name ?? "");
    setApplyTo(initialValues?.applyTo ?? "");
    setDescription(initialValues?.description ?? "");
  }, [initialValues]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setApplyDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    if (!tagName.trim() || !applyTo || !description.trim()) return;

    try {
      setIsSaving(true);
      await onSave({
        name: tagName.trim(),
        applyTo,
        description: description.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isEditMode = submitLabel.toLowerCase().includes("save");

  return (
    <Box flex={1} overflow="auto" px="70px" py="60px">
      <HStack gap="8px" mb="10px">
        <Button
          variant="ghost"
          px="16px"
          h="40px"
          fontSize="16px"
          fontWeight="bold"
          color="#27272a"
          borderRadius="4px"
          onClick={onCancel}
        >
          Tag Management
        </Button>
        <ChevronRight size={16} color="#27272a" opacity={0.8} />
        <Button
          variant="ghost"
          px="20px"
          h="48px"
          fontSize="16px"
          fontWeight="bold"
          color="#5797bd"
          borderRadius="4px"
          textDecoration="underline"
        >
          {isEditMode ? "Edit Tag" : "Create Tag"}
        </Button>
      </HStack>

      <Box
        borderBottomWidth="1px"
        borderColor="#d4d4d8"
        pb="30px"
        pt="16px"
        pl="0"
        mb="50px"
      >
        <Text fontSize="30px" fontWeight="bold" lineHeight="38px" color="#294a5f">
          {pageTitle}
        </Text>
      </Box>

      <Flex gap="57px" align="flex-start" pl="0">
        <VStack align="start" gap="47px" flex={1} maxW="571px">
          <VStack align="start" gap="6px" w="full">
            <HStack gap="4px">
              <Text fontSize="18px" fontWeight={500} lineHeight="28px" color="black">
                Tag Name
              </Text>
              <Text fontSize="10px" color="#991919" lineHeight="14px">*</Text>
            </HStack>
            <Input
              placeholder="Type here"
              h="52px"
              borderColor="#e4e4e7"
              borderRadius="4px"
              px="18px"
              fontSize="16px"
              _placeholder={{ color: "#a1a1aa" }}
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
          </VStack>

          <VStack align="start" gap="6px" w="full">
            <HStack gap="4px">
              <Text fontSize="18px" fontWeight={500} lineHeight="28px" color="black">
                Description
              </Text>
              <Text fontSize="10px" color="#991919" lineHeight="14px">*</Text>
            </HStack>
            <Textarea
              placeholder="Type here"
              h="320px"
              borderColor="#e4e4e7"
              borderRadius="4px"
              px="18px"
              py="14px"
              fontSize="16px"
              resize="vertical"
              _placeholder={{ color: "#a1a1aa" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </VStack>
        </VStack>

        <VStack align="start" gap="6px" w="379px" flexShrink={0}>
          <HStack gap="4px">
            <Text fontSize="18px" fontWeight={500} lineHeight="28px" color="black">
              Apply to
            </Text>
            <Text fontSize="10px" color="#991919" lineHeight="14px">*</Text>
          </HStack>

          <Box ref={dropdownRef} position="relative" w="full">
            <Flex
              align="center"
              justify="space-between"
              h="54px"
              px="8px"
              border="1px solid #e4e4e7"
              borderRadius="4px"
              cursor="pointer"
              onClick={() => setApplyDropdownOpen((prev) => !prev)}
            >
              <Text
                fontSize="16px"
                color={applyTo ? "black" : "#a1a1aa"}
                lineHeight="24px"
              >
                {applyTo || "Type to search"}
              </Text>
              <ChevronDown size={20} color="#71717a" />
            </Flex>

            {applyDropdownOpen && (
              <Box
                position="absolute"
                top="58px"
                left={0}
                right={0}
                bg="white"
                border="1px solid #e4e4e7"
                borderRadius="4px"
                boxShadow="0 4px 12px rgba(0,0,0,0.08)"
                zIndex={10}
              >
                {APPLY_TO_OPTIONS.map((option) => (
                  <Box
                    key={option}
                    px="12px"
                    py="10px"
                    cursor="pointer"
                    fontSize="14px"
                    color="#27272a"
                    bg={applyTo === option ? "#f4f4f5" : "transparent"}
                    _hover={{ bg: "#f4f4f5" }}
                    onClick={() => {
                      setApplyTo(option);
                      setApplyDropdownOpen(false);
                    }}
                  >
                    {option}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </VStack>
      </Flex>

      <Flex justify="flex-end" gap="23px" mt="50px">
        <Button
          bg="#5797bd"
          color="white"
          h="48px"
          px="20px"
          borderRadius="4px"
          fontSize="16px"
          fontWeight={500}
          _hover={{ bg: "#4a86a8" }}
          onClick={handleSubmit}
          loading={isSaving}
          loadingText="Saving..."
        >
          {submitLabel}
        </Button>

        <Button
          bg="#e4e4e7"
          color="#27272a"
          h="48px"
          px="20px"
          borderRadius="4px"
          fontSize="16px"
          fontWeight={500}
          _hover={{ bg: "#d4d4d8" }}
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </Flex>
    </Box>
  );
}