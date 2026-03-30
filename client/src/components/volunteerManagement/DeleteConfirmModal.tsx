import { Box, Button, Dialog, Flex, Icon, Portal } from "@chakra-ui/react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface DeleteConfirmModalProps {
  open: boolean;
  count: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmModal = ({ open, count, onClose, onConfirm }: DeleteConfirmModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose(); }}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="xl" p={6} maxW="480px">
            <Flex justify="space-between" align="flex-start" mb={4}>
              <Flex align="center" gap={2}>
                <Icon as={FiAlertTriangle} boxSize={6} color="#27272A" />
                <Dialog.Title fontSize="xl" fontWeight="bold" color="#27272A">Warning!</Dialog.Title>
              </Flex>
              <Dialog.CloseTrigger asChild>
                <Icon as={FiX} boxSize={5} cursor="pointer" color="gray.500" _hover={{ color: "gray.800" }} mr={2} mt={2} />
              </Dialog.CloseTrigger>
            </Flex>

            <Dialog.Body px={0} pb={6}>
              <Box fontSize="md" color="#2D3748">
                Are you sure you want to delete {count === 1 ? "this profile" : `these ${count} profiles`}? This action cannot be undone.
              </Box>
            </Dialog.Body>

            <Dialog.Footer p={0}>
              <Button
                flex={1}
                bg="#F1F5F9"
                color="#27272A"
                fontWeight="bold"
                fontSize="md"
                borderRadius="lg"
                _hover={{ bg: "#E2E8F0" }}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                bg="#3182CE"
                color="white"
                fontWeight="bold"
                borderRadius="lg"
                _hover={{ bg: "#487C9E" }}
                fontSize="md"
                onClick={onConfirm}
              >
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
