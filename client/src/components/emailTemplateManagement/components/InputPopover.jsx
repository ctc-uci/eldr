import { useState } from "react";
import { Button, CloseButton, Dialog, Flex, Input, Portal, Text } from "@chakra-ui/react";

/**
 * A reusable modal dialog for creating new items (folders, templates, etc.).
 * Replaces the old InputPopover using a centered Dialog with backdrop.
 */
export const InputDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  onTriggerClick,
  // Trigger button props
  triggerIcon,
  triggerLabel,
  buttonProps = {},
  // Dialog content props
  dialogTitle,
  inputLabel = "Folder Name",
  inputPlaceholder = "Untitled Folder",
  submitLabel = "Create Folder",
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
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={handleOpenChange}
      placement="center"
    >
      <Dialog.Trigger asChild>
        <Button
          backgroundColor={isOpen ? "#294A5F" : "#487C9E"}
          color="white"
          _hover={{ bg: "#294A5F" }}
          onClick={handleTriggerClick}
          {...buttonProps}
        >
          {triggerIcon}
          {triggerLabel}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.400" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="448px"
            w="448px"
            borderRadius="6px"
            boxShadow="0px 0px 1px 0px rgba(24,24,27,0.3), 0px 8px 16px 0px rgba(24,24,27,0.1)"
            bg="white"
            overflow="hidden"
          >
            {/* Close button */}
            <Dialog.CloseTrigger
              position="absolute"
              top="0"
              right="0"
              asChild
            >
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>

            {/* Header */}
            <Dialog.Header
              pt="24px"
              pb="16px"
              px="24px"
            >
              <Dialog.Title
                fontSize="18px"
                fontWeight="600"
                lineHeight="28px"
                color="black"
              >
                {dialogTitle}
              </Dialog.Title>
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body
              pt="8px"
              pb="16px"
              px="24px"
            >
              <Flex direction="column" gap="4px">
                <Text
                  fontSize="14px"
                  fontWeight="500"
                  lineHeight="20px"
                  color="black"
                >
                  {inputLabel}
                </Text>
                <Input
                  autoFocus
                  placeholder={inputPlaceholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  h="40px"
                  px="12px"
                  py="10px"
                  fontSize="14px"
                  borderWidth="1px"
                  borderColor="#E4E4E7"
                  borderRadius="4px"
                  bg="white"
                  _placeholder={{ color: "#A1A1AA" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                />
              </Flex>
            </Dialog.Body>

            {/* Footer */}
            <Dialog.Footer
              pt="8px"
              pb="16px"
              px="24px"
              justifyContent="flex-end"
              gap="12px"
            >
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  h="40px"
                  px="16px"
                  fontSize="14px"
                  fontWeight="500"
                  borderWidth="1px"
                  borderColor="#E4E4E7"
                  borderRadius="4px"
                  color="#27272A"
                  bg="white"
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                h="40px"
                px="16px"
                fontSize="14px"
                fontWeight="500"
                borderRadius="4px"
                bg="#487C9E"
                color="white"
                _hover={{ bg: "#294A5F" }}
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
              >
                {submitLabel}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

// Keep backward compat alias
export const InputPopover = InputDialog;
