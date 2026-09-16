import { useEffect, useRef, useState } from "react";
import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import { Check, ChevronDown } from "lucide-react";
import { TAG_CATEGORY_OPTIONS } from "./types";

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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsCategoryMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
          <Box ref={categoryMenuRef} position="relative">
            <Button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isCategoryMenuOpen}
              aria-label="Tag Category"
              w="full"
              h="40px"
              justifyContent="space-between"
              px="12px"
              bg="white"
              border="1px solid #d4d4d8"
              borderRadius="4px"
              color={applyTo ? "#3f3f46" : "#71717a"}
              fontSize="14px"
              fontWeight={400}
              _hover={{ bg: "white" }}
              _focusVisible={{ borderColor: "#71717a", boxShadow: "0 0 0 1px #71717a" }}
              onClick={() => setIsCategoryMenuOpen((isOpen) => !isOpen)}
            >
              {applyTo || "Select a category"}
              <ChevronDown
                size={18}
                color="#27272a"
                style={{
                  transform: isCategoryMenuOpen ? "rotate(180deg)" : "none",
                  transition: "transform 120ms ease",
                }}
              />
            </Button>

            {isCategoryMenuOpen && (
              <Box
                as="ul"
                role="listbox"
                aria-label="Tag categories"
                position="absolute"
                top="44px"
                left="0"
                right="0"
                zIndex={2}
                m="0"
                p="4px 0"
                bg="white"
                border="1px solid #e4e4e7"
                borderRadius="4px"
                boxShadow="0 4px 8px rgba(0, 0, 0, 0.12)"
              >
                {TAG_CATEGORY_OPTIONS.map((option) => {
                  const isSelected = applyTo === option;

                  return (
                    <Box
                      as="li"
                      key={option}
                      role="option"
                      aria-selected={isSelected}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      minH="40px"
                      px="10px"
                      cursor="pointer"
                      color="#18181b"
                      fontSize="14px"
                      bg={isSelected ? "#f4f4f5" : "white"}
                      _hover={{ bg: "#f4f4f5" }}
                      onClick={() => {
                        setApplyTo(option);
                        setIsCategoryMenuOpen(false);
                      }}
                    >
                      {option}
                      {isSelected && <Check size={17} strokeWidth={2} />}
                    </Box>
                  );
                })}
              </Box>
            )}
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
