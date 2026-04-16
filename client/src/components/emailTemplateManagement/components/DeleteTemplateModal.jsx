import {
  Button,
  CloseButton,
  Dialog,
  HStack,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";

export const DeleteTemplateModal = ({
  isOpen,
  onClose,
  onDelete,
}) => (
  <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
    <Portal>
      <Dialog.Backdrop bg="blackAlpha.400" />
      <Dialog.Positioner>
        <Dialog.Content
          w="380px"
          boxShadow="xl"
          borderRadius="md"
          p={0}
          bg="white"
        >
          <Dialog.CloseTrigger position="absolute" top="0" right="0" asChild>
            <CloseButton size="sm" onClick={onClose} />
          </Dialog.CloseTrigger>
          <Dialog.Body p={6}>
            <VStack align="stretch" gap={4}>
              <Text fontSize="md" fontWeight="bold">
                Delete template
              </Text>
              <Text fontSize="sm" color="gray.600">
                Are you sure? You can&apos;t undo this action afterwards.
              </Text>
              <HStack gap={3} justify="flex-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  bg="#DC2626"
                  color="white"
                  size="sm"
                  _hover={{ bg: "#991919" }}
                  onClick={onDelete}
                >
                  Yes, Delete
                </Button>
              </HStack>
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);
