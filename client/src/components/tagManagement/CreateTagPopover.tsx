import { useEffect, useRef, useState } from "react";

import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";

import { Check, ChevronDown } from "lucide-react";

import { TAG_CATEGORY_OPTIONS } from "./types";

type CreateTagPayload = {
  name: string;
  category: string;
};

export function CreateTagPopover({
  onSave,
}: {
  onSave: (tag: CreateTagPayload) => Promise<void> | void;
}) {
  const [tagName, setTagName] = useState("");
  const [category, setCategory] = useState("");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (!isCategoryMenuOpen) return;

    const options =
      categoryMenuRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
    options?.[activeOptionIndex]?.focus();
  }, [activeOptionIndex, isCategoryMenuOpen]);

  const openCategoryMenu = (optionIndex?: number) => {
    const selectedIndex = TAG_CATEGORY_OPTIONS.findIndex(
      (option) => option === category
    );
    setActiveOptionIndex(
      optionIndex ?? (selectedIndex >= 0 ? selectedIndex : 0)
    );
    setIsCategoryMenuOpen(true);
  };

  const selectCategory = (option: string) => {
    setCategory(option);
    setIsCategoryMenuOpen(false);
    requestAnimationFrame(() => categoryTriggerRef.current?.focus());
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent,
    optionIndex: number
  ) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveOptionIndex((optionIndex + 1) % TAG_CATEGORY_OPTIONS.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveOptionIndex(
          (optionIndex - 1 + TAG_CATEGORY_OPTIONS.length) %
            TAG_CATEGORY_OPTIONS.length
        );
        break;
      case "Home":
        event.preventDefault();
        setActiveOptionIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveOptionIndex(TAG_CATEGORY_OPTIONS.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (TAG_CATEGORY_OPTIONS[optionIndex]) {
          selectCategory(TAG_CATEGORY_OPTIONS[optionIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsCategoryMenuOpen(false);
        requestAnimationFrame(() => categoryTriggerRef.current?.focus());
        break;
      case "Tab":
        setIsCategoryMenuOpen(false);
        break;
    }
  };

  const handleSubmit = async () => {
    if (!tagName.trim() || !category) return;

    try {
      setIsSaving(true);
      await onSave({ name: tagName.trim(), category });
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
      border="1px solid"
      borderColor="gray.200"
      borderRadius="8px"
      boxShadow="lg"
      _before={{
        content: '""',
        position: "absolute",
        top: "-7px",
        right: "30px",
        w: "12px",
        h: "12px",
        bg: "white",
        borderLeft: "1px solid",
        borderLeftColor: "gray.200",
        borderTop: "1px solid",
        borderTopColor: "gray.200",
        transform: "rotate(45deg)",
      }}
    >
      <VStack
        align="stretch"
        gap="16px"
      >
        <Box>
          <Text
            mb="6px"
            fontSize="14px"
            fontWeight={500}
            color="gray.900"
          >
            Tag Category
          </Text>
          <Box
            ref={categoryMenuRef}
            position="relative"
          >
            <Button
              ref={categoryTriggerRef}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isCategoryMenuOpen}
              aria-controls="tag-category-listbox"
              aria-label="Tag Category"
              w="full"
              h="40px"
              justifyContent="space-between"
              px="12px"
              bg="white"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="4px"
              color={category ? "gray.700" : "gray.500"}
              fontSize="14px"
              fontWeight={400}
              _hover={{ bg: "white" }}
              _focusVisible={{
                borderColor: "gray.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-gray-500)",
              }}
              onClick={() => {
                if (isCategoryMenuOpen) {
                  setIsCategoryMenuOpen(false);
                } else {
                  openCategoryMenu();
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  openCategoryMenu(
                    event.key === "ArrowUp"
                      ? TAG_CATEGORY_OPTIONS.length - 1
                      : undefined
                  );
                } else if (event.key === "Escape") {
                  setIsCategoryMenuOpen(false);
                }
              }}
            >
              {category || "Select a category"}
              <ChevronDown
                size={18}
                color="var(--chakra-colors-gray-800)"
                style={{
                  transform: isCategoryMenuOpen ? "rotate(180deg)" : "none",
                  transition: "transform 120ms ease",
                }}
              />
            </Button>

            {isCategoryMenuOpen && (
              <Box
                id="tag-category-listbox"
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
                border="1px solid"
                borderColor="gray.200"
                borderRadius="4px"
                boxShadow="md"
              >
                {TAG_CATEGORY_OPTIONS.map((option, optionIndex) => {
                  const isSelected = category === option;

                  return (
                    <Box
                      as="li"
                      key={option}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={optionIndex === activeOptionIndex ? 0 : -1}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      minH="40px"
                      px="10px"
                      cursor="pointer"
                      color="gray.900"
                      fontSize="14px"
                      bg={isSelected ? "gray.100" : "white"}
                      _hover={{ bg: "gray.100" }}
                      _focusVisible={{
                        bg: "gray.100",
                        outline: "2px solid",
                        outlineColor: "brand.navy",
                      }}
                      onClick={() => selectCategory(option)}
                      onKeyDown={(event) =>
                        handleOptionKeyDown(event, optionIndex)
                      }
                    >
                      {option}
                      {isSelected && (
                        <Check
                          size={17}
                          strokeWidth={2}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </Box>

        <Box>
          <Text
            mb="6px"
            fontSize="14px"
            fontWeight={500}
            color="gray.900"
          >
            Tag Name
          </Text>
          <Input
            aria-label="Tag Name"
            placeholder="Type your new tag’s name"
            value={tagName}
            onChange={(event) => setTagName(event.target.value)}
            h="40px"
            px="12px"
            borderColor="gray.300"
            borderRadius="4px"
            fontSize="14px"
            _placeholder={{ color: "gray.400" }}
          />
        </Box>

        <Button
          alignSelf="flex-end"
          bg="brand.navy"
          color="white"
          h="36px"
          px="14px"
          borderRadius="4px"
          fontSize="14px"
          fontWeight={500}
          _hover={{ bg: "primary.500" }}
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
