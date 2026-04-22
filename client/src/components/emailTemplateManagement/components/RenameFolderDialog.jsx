import { useState } from "react";
import { Button, CloseButton, Dialog, Flex, Input, Portal, Text } from "@chakra-ui/react";
import { Pencil } from "lucide-react";

/**
 * An inline edit (pencil) button that opens a "Rename Folder" modal.
 * The trigger is just an icon — no labelled button — so it sits cleanly
 * next to the folder title text (matching Figma 1519-83577).
 */
export const RenameFolderDialog = ({ folderName = "", onRename }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleOpen = () => {
    setInputValue(folderName);
    setIsOpen(true);
  };

  const handleOpenChange = ({ open }) => {
    setIsOpen(open);
    if (!open) setInputValue("");
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onRename(inputValue.trim());
    setIsOpen(false);
    setInputValue("");
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      placement="center"
      lazyMount
    >
      {/* Pencil trigger — sits inline next to the folder name */}
      <Dialog.Trigger asChild>
        <Button
          variant="ghost"
          size="xs"
          p="4px"
          minW="unset"
          h="unset"
          color="#71717A"
          _hover={{ color: "#3D6B89", bg: "transparent" }}
          onClick={handleOpen}
          aria-label="Rename folder"
        >
          <Pencil size={16} strokeWidth={1.75} />
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
            <Dialog.CloseTrigger position="absolute" top="0" right="0" asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>

            {/* Header */}
            <Dialog.Header pt="24px" pb="16px" px="24px">
              <Dialog.Title
                fontSize="18px"
                fontWeight="600"
                lineHeight="28px"
                color="black"
              >
                Rename Folder
              </Dialog.Title>
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body pt="8px" pb="16px" px="24px">
              <Flex direction="column" gap="4px">
                <Text
                  fontSize="14px"
                  fontWeight="500"
                  lineHeight="20px"
                  color="black"
                >
                  New Folder Name
                </Text>
                <Input
                  autoFocus
                  placeholder="Untitled Folder"
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
                _hover={{ bg: "#3D6B89" }}
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
