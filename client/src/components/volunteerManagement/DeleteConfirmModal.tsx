import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";

interface DeleteConfirmModalProps {
  open: boolean;
  count: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  const handleDelete = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error deleting volunteer(s):", error);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="center"
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.400" />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Profile</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text
                fontSize="sm"
                color="gray.700"
              >
                Are you sure? You can't undo this action afterwards.
              </Text>
            </Dialog.Body>
            <Dialog.Footer
              gap={3}
              justifyContent="flex-end"
            >
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  borderColor="#CBD5E0"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={handleDelete}
                colorPalette="red"
              >
                Yes, Delete
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
