import { Flex, NativeSelect, Tag, Text } from "@chakra-ui/react";

export const InterestTagField = ({
  tags = [],
  options = [],
  editable = false,
  emptyMessage = "No tags added yet.",
  addPlaceholder = "Add tag...",
  onAdd,
  onRemove,
}) => {
  const availableOptions = options.filter((option) => !tags.includes(option));

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
            <Tag.Root key={tag} size="sm" bg="gray.100" color="gray.900">
              <Tag.Label>{tag}</Tag.Label>
              <Tag.EndElement>
                <Tag.CloseTrigger
                  disabled={!editable}
                  aria-label={editable ? `Remove ${tag}` : undefined}
                  onClick={editable ? () => onRemove?.(tag) : undefined}
                />
              </Tag.EndElement>
            </Tag.Root>
          ))}
          {editable ? (
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
                  const value = e.target.value;
                  if (!value) return;
                  onAdd?.(value);
                  e.target.value = "";
                }}
              >
                <option value="" disabled>
                  {addPlaceholder}
                </option>
                {availableOptions.map((option) => (
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
  );
};
