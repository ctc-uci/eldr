import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Text,
} from "@chakra-ui/react";

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  body = "Are you sure? You can't undo this action afterwards.",
  confirmLabel = "Confirm",
  confirmColorPalette = "red",
  onConfirm,
  loading = false,
}) => (
  <Dialog.Root
    open={open}
    onOpenChange={onOpenChange}
    placement="center"
    size="sm"
  >
    <Portal>
      <Dialog.Backdrop bg="blackAlpha.400" />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text fontSize="sm" color="gray.700">
              {body}
            </Text>
          </Dialog.Body>
          <Dialog.Footer gap={3} justifyContent="flex-end">
            <Dialog.ActionTrigger asChild>
              <Button
                variant="outline"
                borderColor="#CBD5E0"
                disabled={loading}
              >
                Cancel
              </Button>
            </Dialog.ActionTrigger>
            <Button
              colorPalette={confirmColorPalette}
              loading={loading}
              onClick={onConfirm}
            >
              {confirmLabel}
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
