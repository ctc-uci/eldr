import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";

type DeleteTagDialogProps = {
  open: boolean;
  count: number;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export const DeleteTagDialog = ({
  open,
  count,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteTagDialogProps) => {
  const label = count === 1 ? "Tag" : "Tags";

  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open: nextOpen }) => {
        if (!nextOpen && !isDeleting) onClose();
      }}
      placement="center"
      lazyMount
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.400" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="356px"
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
                aria-label={`Close delete ${label.toLowerCase()} dialog`}
                disabled={isDeleting}
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
                Delete {label}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
              pt="4px"
              pb="22px"
              px="20px"
            >
              <Text
                fontSize="12px"
                color="gray.600"
              >
                Are you sure? You can&apos;t undo this action afterwards.
              </Text>
            </Dialog.Body>

            <Dialog.Footer
              pt="0"
              pb="16px"
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
                  disabled={isDeleting}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                h="32px"
                px="14px"
                bg="red.600"
                color="white"
                borderRadius="4px"
                fontSize="12px"
                fontWeight="500"
                loading={isDeleting}
                loadingText="Deleting..."
                _hover={{ bg: "red.700" }}
                onClick={() => void onConfirm()}
              >
                Yes, Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
