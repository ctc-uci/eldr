import { useState } from "react";
import { Button, HStack, Input, Popover, Text } from "@chakra-ui/react";

import { FaPlus } from "react-icons/fa";

export const InputPopover = ({
  isOpen,
  onOpenChange,
  onSubmit,
  onTriggerClick,
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
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleTriggerClick = async (e) => {
    if (onTriggerClick) {
      e.preventDefault();
      await onTriggerClick();
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onSubmit(inputValue.trim());
    setInputValue("");
  };

  const handleOpenChange = (e) => {
    onOpenChange(e.open);
    if (!e.open) {
      setInputValue("");
    }
  };

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      placement={placement}
    >
      <Popover.Trigger asChild>
        <Button
          backgroundColor="#5797BD"
          color="white"
          w={triggerWidth}
          onClick={handleTriggerClick}
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
              autoFocus
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              size="md"
              fontSize="xs"
              bg="white"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <FaPlus
              size={24}
              cursor={inputValue.trim() ? "pointer" : "not-allowed"}
              color={inputValue.trim() ? "black" : "#ccc"}
              onClick={handleSubmit}
              title={inputValue.trim() ? `Create ${triggerLabel?.toLowerCase() || "item"}` : "Enter a name first"}
            />
          </HStack>
        </Popover.Body>
      </Popover.Content>
    </Popover.Positioner>
  </Popover.Root>
  );
};
