import { useState, useEffect } from "react";
import { Button, CloseButton, Dialog, Flex, Input, Portal, Text } from "@chakra-ui/react";

/**
 * A rename dialog that is controlled externally (no trigger button).
 * Parent opens it by setting isOpen=true and provides the current name.
 *
 * Props:
 *  isOpen        – controlled open state
 *  onClose       – called when dialog should close
 *  currentName   – pre-fills the input
 *  title         – dialog title (e.g. "Rename Folder" or "Rename Template")
 *  onRename      – called with the new name string on submit
 */
export const RenameDialog = ({ isOpen, onClose, currentName = "", title = "Rename", onRename }) => {
  const [inputValue, setInputValue] = useState(currentName);

  // Sync input when dialog opens with a new name
  useEffect(() => {
    if (isOpen) setInputValue(currentName);
  }, [isOpen, currentName]);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onRename(inputValue.trim());
    onClose();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => { if (!open) onClose(); }}
      placement="center"
      lazyMount
    >
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
            <Dialog.CloseTrigger position="absolute" top="0" right="0" asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>

            <Dialog.Header pt="24px" pb="16px" px="24px">
              <Dialog.Title fontSize="18px" fontWeight="600" lineHeight="28px" color="black">
                {title}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="8px" pb="16px" px="24px">
              <Flex direction="column" gap="4px">
                <Text fontSize="14px" fontWeight="500" lineHeight="20px" color="black">
                  New {title === "Rename Folder" ? "Folder" : "Template"} Name
                </Text>
                <Input
                  autoFocus
                  placeholder={title === "Rename Folder" ? "Untitled Folder" : "Untitled Template"}
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
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                />
              </Flex>
            </Dialog.Body>

            <Dialog.Footer pt="8px" pb="16px" px="24px" justifyContent="flex-end" gap="12px">
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
                  onClick={onClose}
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
                Rename
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
