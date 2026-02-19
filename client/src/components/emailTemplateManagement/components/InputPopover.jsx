import { Button, HStack, Input, Popover, Text } from "@chakra-ui/react";

import { FaPlus } from "react-icons/fa";

export const InputPopover = ({
  isOpen,
  onOpenChange,
  inputRef,
  inputValue,
  onInputChange,
  onSubmit,
  // Trigger button props
  triggerIcon,
  triggerLabel,
  triggerWidth = "292px",
  buttonProps = {},
  // Popover content props
  popoverTitle,
  inputPlaceholder,
  popoverWidth = "292px",
  placement = "bottom-start",
}) => (
  <Popover.Root
    open={isOpen}
    onOpenChange={(e) => onOpenChange(e.open)}
    placement={placement}
    initialFocusEl={() => inputRef?.current}
  >
    <Popover.Trigger asChild>
      <Button
        backgroundColor="#5797BD"
        color="white"
        w={triggerWidth}
        {...buttonProps}
      >
        {triggerIcon}
        {triggerLabel}
      </Button>
    </Popover.Trigger>
    <Popover.Positioner zIndex={1000}>
      <Popover.Content
        w={popoverWidth}
        boxShadow="lg"
        borderRadius="md"
        mt={2}
        p={0}
        bg="white"
      >
        <Popover.CloseTrigger />
        <Popover.Body p={4}>
          <Text fontSize="xs" fontWeight="bold" mb={2}>
            {popoverTitle}
          </Text>
          <HStack gap="10px">
            <Input
              ref={inputRef}
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              size="md"
              fontSize="xs"
              bg="white"
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  onSubmit();
                }
              }}
            />
            <FaPlus
              size={24}
              cursor={inputValue.trim() ? "pointer" : "not-allowed"}
              color={inputValue.trim() ? "black" : "#ccc"}
              onClick={inputValue.trim() ? onSubmit : undefined}
              title={inputValue.trim() ? `Create ${triggerLabel?.toLowerCase() || "item"}` : "Enter a name first"}
            />
          </HStack>
        </Popover.Body>
      </Popover.Content>
    </Popover.Positioner>
  </Popover.Root>
);
