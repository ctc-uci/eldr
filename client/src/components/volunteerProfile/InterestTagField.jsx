import { useEffect, useMemo, useState } from "react";

import {
  Combobox,
  Flex,
  Portal,
  Tag,
  Text,
  createListCollection,
} from "@chakra-ui/react";

export const InterestTagField = ({
  tags = [],
  options = [],
  editable = false,
  emptyMessage = "No tags added yet.",
  addPlaceholder = "Add tag...",
  addPlaceholderColor = "#A1A1AA",
  onAdd,
  onRemove,
}) => {
  const availableOptions = options.filter((option) => !tags.includes(option));
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
  }, [tags.length]);

  const filteredOptions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    return availableOptions.filter(
      (option) => !query || option.toLowerCase().includes(query),
    );
  }, [availableOptions, inputValue]);

  const collection = useMemo(
    () => createListCollection({ items: filteredOptions }),
    [filteredOptions],
  );

  const handleSelect = (details) => {
    const selected = details.value?.[0];
    if (!selected) return;
    onAdd?.(selected);
    setInputValue("");
  };

  const handleInputValueChange = (details) => {
    setInputValue(details.inputValue ?? "");
  };

  return (
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
      {!editable && tags.length === 0 ? (
        <Text fontSize="sm" color="gray.600" px={1}>
          {emptyMessage}
        </Text>
      ) : (
        <>
          {tags.map((tag) => (
            <Tag.Root
              key={tag}
              size="sm"
              h="32px"
              px={2}
              gap={1}
              borderWidth="1px"
              borderStyle="solid"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.100"
              color="gray.900"
              fontSize="sm"
              fontWeight="normal"
              boxShadow="none"
            >
              <Tag.Label fontSize="sm" lineHeight="short">
                {tag}
              </Tag.Label>
              <Tag.EndElement>
                <Tag.CloseTrigger
                  disabled={!editable}
                  color="gray.500"
                  _hover={{ color: "gray.700" }}
                  aria-label={editable ? `Remove ${tag}` : undefined}
                  onClick={editable ? () => onRemove?.(tag) : undefined}
                />
              </Tag.EndElement>
            </Tag.Root>
          ))}
          {editable ? (
            <Combobox.Root
              key={`tag-add-${tags.length}`}
              collection={collection}
              value={[]}
              inputValue={inputValue}
              openOnClick
              closeOnSelect
              width="auto"
              minW="160px"
              maxW="220px"
              onInputValueChange={handleInputValueChange}
              onValueChange={handleSelect}
            >
              <Combobox.Control
                border="none"
                boxShadow="none"
                bg="transparent"
                h="32px"
                minH="32px"
                px={1}
              >
                <Combobox.Input
                  placeholder={addPlaceholder}
                  fontSize="sm"
                  border="none"
                  outline="none"
                  _placeholder={{ color: addPlaceholderColor }}
                />
                <Combobox.IndicatorGroup>
                  <Combobox.ClearTrigger />
                  <Combobox.Trigger />
                </Combobox.IndicatorGroup>
              </Combobox.Control>
              <Portal>
                <Combobox.Positioner>
                  <Combobox.Content>
                    <Combobox.Empty>No matches found</Combobox.Empty>
                    {collection.items.map((item) => (
                      <Combobox.Item key={item} item={item}>
                        {item}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))}
                  </Combobox.Content>
                </Combobox.Positioner>
              </Portal>
            </Combobox.Root>
          ) : null}
        </>
      )}
    </Flex>
  );
};
