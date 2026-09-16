import { useState } from "react";
import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import { APPLY_TO_OPTIONS } from "./types";

type CreateTagPayload = {
  name: string;
  applyTo: string;
  description: string;
};

export function CreateTagPopover({
  onSave,
}: {
  onSave: (tag: CreateTagPayload) => Promise<void> | void;
}) {
  const [tagName, setTagName] = useState("");
  const [applyTo, setApplyTo] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!tagName.trim() || !applyTo) return;

    try {
      setIsSaving(true);
      await onSave({ name: tagName.trim(), applyTo, description: "" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      position="absolute"
      top="52px"
      right="0"
      zIndex={20}
      w="320px"
      p="20px"
      bg="white"
      border="1px solid #e4e4e7"
      borderRadius="8px"
      boxShadow="0 8px 20px rgba(0, 0, 0, 0.1)"
      _before={{
        content: '""',
        position: "absolute",
        top: "-7px",
        right: "30px",
        w: "12px",
        h: "12px",
        bg: "white",
        borderLeft: "1px solid #e4e4e7",
        borderTop: "1px solid #e4e4e7",
        transform: "rotate(45deg)",
      }}
    >
      <VStack align="stretch" gap="16px">
        <Box>
          <Text mb="6px" fontSize="14px" fontWeight={500} color="#18181b">
            Tag Category
          </Text>
          <Box position="relative">
            <select
              aria-label="Tag Category"
              value={applyTo}
              onChange={(event) => setApplyTo(event.target.value)}
              style={{
                width: "100%",
                height: "40px",
                appearance: "none",
                padding: "0 38px 0 12px",
                border: "1px solid #d4d4d8",
                borderRadius: "4px",
                color: applyTo ? "#3f3f46" : "#71717a",
                background: "white",
                fontSize: "14px",
                outline: "none",
              }}
            >
              <option value="" disabled>
                Select a category
              </option>
              {APPLY_TO_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              color="#27272a"
              style={{
                position: "absolute",
                right: "12px",
                top: "11px",
                pointerEvents: "none",
              }}
            />
          </Box>
        </Box>

        <Box>
          <Text mb="6px" fontSize="14px" fontWeight={500} color="#18181b">
            Tag Name
          </Text>
          <Input
            aria-label="Tag Name"
            placeholder="Type your new tag’s name"
            value={tagName}
            onChange={(event) => setTagName(event.target.value)}
            h="40px"
            px="12px"
            borderColor="#d4d4d8"
            borderRadius="4px"
            fontSize="14px"
            _placeholder={{ color: "#a1a1aa" }}
          />
        </Box>

        <Button
          alignSelf="flex-end"
          bg="#002992"
          color="white"
          h="36px"
          px="14px"
          borderRadius="4px"
          fontSize="14px"
          fontWeight={500}
          _hover={{ bg: "#001E6C" }}
          onClick={handleSubmit}
          loading={isSaving}
          loadingText="Creating..."
        >
          Create New Tag
        </Button>
      </VStack>
    </Box>
  );
}
