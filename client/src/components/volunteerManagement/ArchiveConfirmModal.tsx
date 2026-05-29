import { useState } from "react";

import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
} from "@chakra-ui/react";

interface ArchiveConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (note: string) => Promise<void>;
}

export const ArchiveConfirmModal = ({
  open,
  onClose,
  onConfirm,
}: ArchiveConfirmModalProps) => {
  const [note, setNote] = useState("");

  const close = () => {
    setNote("");
    onClose();
  };

  const handleArchive = async () => {
    try {
      await onConfirm(note.trim());
      setNote("");
    } catch (error) {
      console.error("Error archiving profile(s):", error);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        if (!e.open) close();
      }}
      placement="center"
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.400" />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Archive Profile</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root>
                <Field.Label>Note</Field.Label>
                <Input
                  placeholder="Type archive note here"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleArchive();
                  }}
                />
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer
              gap={3}
              justifyContent="flex-end"
            >
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  borderColor="#CBD5E0"
                  onClick={close}
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={handleArchive}
                colorPalette="red"
              >
                Yes, Archive
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
