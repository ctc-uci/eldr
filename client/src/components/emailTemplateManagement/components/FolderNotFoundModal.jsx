import {
  Button,
  Dialog,
  HStack,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";

export const FolderNotFoundModal = ({
  isOpen,
  onClose,
  folderName,
  onCreateFolder,
}) => (
  <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
    <Portal>
      <Dialog.Backdrop bg="blackAlpha.400" />
      <Dialog.Positioner>
        <Dialog.Content
          w="320px"
          boxShadow="xl"
          borderRadius="md"
          p={0}
          bg="white"
        >
          <Dialog.CloseTrigger />
          <Dialog.Body p={6}>
            <VStack align="stretch" gap={4}>
              <Text fontSize="md" fontWeight="bold">
                Folder not found!
              </Text>
              <Text fontSize="sm" color="gray.600">
                There doesn&apos;t seem to be a folder named [{folderName}]. Would you like to create a new folder to store this template?
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
                  backgroundColor="#5797BD"
                  color="white"
                  size="sm"
                  onClick={onCreateFolder}
                >
                  Create
                </Button>
              </HStack>
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);
