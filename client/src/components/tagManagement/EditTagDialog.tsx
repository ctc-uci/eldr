import { useEffect, useState } from "react";

import {
  Button,
  CloseButton,
  Dialog,
  Flex,
  Input,
  Portal,
  Text,
} from "@chakra-ui/react";

type EditTagDialogProps = {
  open: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
};

export const EditTagDialog = ({
  open,
  currentName,
  onClose,
  onSave,
}: EditTagDialogProps) => {
  const [name, setName] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) setName(currentName);
  }, [currentName, open]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName || isSaving) return;

    try {
      setIsSaving(true);
      await onSave(trimmedName);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open: nextOpen }) => {
        if (!nextOpen) onClose();
      }}
      placement="center"
      lazyMount
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.400" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="350px"
            w="calc(100% - 32px)"
            borderRadius="6px"
            bg="white"
          >
            <Dialog.CloseTrigger
              position="absolute"
              top="8px"
              right="8px"
              asChild
            >
              <CloseButton
                size="sm"
                aria-label="Close edit tag dialog"
              />
            </Dialog.CloseTrigger>

            <Dialog.Header
              pt="20px"
              pb="12px"
              px="20px"
            >
              <Dialog.Title
                fontSize="16px"
                fontWeight="600"
                color="gray.900"
              >
                Edit Tag Name
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
              pt="4px"
              pb="18px"
              px="20px"
            >
              <Flex
                direction="column"
                gap="6px"
              >
                <Text
                  fontSize="12px"
                  fontWeight="600"
                  color="gray.800"
                >
                  Tag Name
                </Text>
                <Input
                  autoFocus
                  aria-label="Tag Name"
                  placeholder="Type your new tag's name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void handleSave();
                  }}
                  h="34px"
                  px="10px"
                  fontSize="12px"
                  borderColor="gray.300"
                  borderRadius="4px"
                  _placeholder={{ color: "gray.400" }}
                />
              </Flex>
            </Dialog.Body>

            <Dialog.Footer
              pt="0"
              pb="14px"
              px="20px"
              gap="8px"
              justifyContent="flex-end"
            >
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  h="32px"
                  px="14px"
                  borderColor="gray.200"
                  borderRadius="4px"
                  fontSize="12px"
                  fontWeight="500"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                h="32px"
                px="14px"
                bg="brand.navy"
                color="white"
                borderRadius="4px"
                fontSize="12px"
                fontWeight="500"
                loading={isSaving}
                loadingText="Saving..."
                disabled={!name.trim()}
                _hover={{ bg: "primary.500" }}
                onClick={() => void handleSave()}
              >
                Save Changes
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
