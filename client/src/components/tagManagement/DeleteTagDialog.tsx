import { Box, Button, CloseButton, Dialog, Portal, Text, VStack } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";

type SelectedTag = {
  sectionTitle: string;
  row: {
    id: number;
    name: string;
    clinicCount?: number;
    volunteerCount?: number;
  };
};

type DeleteTagDialogProps = {
  open: boolean;
  count: number;
  isDeleting: boolean;
  selectedRows?: SelectedTag[];
  onClose: () => void;
  onConfirm: () => Promise<void>;
  onDetachAndDelete?: () => Promise<void>;
};

export const DeleteTagDialog = ({
  open,
  count,
  isDeleting,
  selectedRows = [],
  onClose,
  onConfirm,
  onDetachAndDelete,
}: DeleteTagDialogProps) => {
  const label = count === 1 ? "Tag" : "Tags";

  const tiedLanguages = selectedRows.filter(
    (s) => s.sectionTitle === "Languages" && (s.row.clinicCount ?? 0) > 0
  );
  const hasTiedLanguages = tiedLanguages.length > 0;

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
            maxW={hasTiedLanguages ? "440px" : "356px"}
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
                color={hasTiedLanguages ? "red.700" : "gray.900"}
                display="flex"
                alignItems="center"
                gap="8px"
              >
                {hasTiedLanguages && <LuTriangleAlert size={18} color="#C53030" />}
                {hasTiedLanguages ? "Language Tied to Events" : `Delete ${label}`}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
              pt="4px"
              pb="20px"
              px="20px"
            >
              {hasTiedLanguages ? (
                <VStack align="start" gap={3}>
                  <Text fontSize="13px" color="gray.700">
                    The following language{tiedLanguages.length > 1 ? "s are" : " is"} currently tied to past events:
                  </Text>
                  <Box
                    w="100%"
                    p="10px 12px"
                    bg="red.50"
                    border="1px solid"
                    borderColor="red.200"
                    borderRadius="4px"
                  >
                    {tiedLanguages.map((t) => (
                      <Text key={t.row.id} fontSize="13px" fontWeight="600" color="red.800">
                        • {t.row.name} ({t.row.clinicCount} event{t.row.clinicCount === 1 ? "" : "s"})
                      </Text>
                    ))}
                  </Box>
                  <Text fontSize="12px" color="gray.600">
                    Standard deletion is blocked. To remove a used language, you must detach it from past events first. You can detach it from all events and delete now, or cancel and review past events.
                  </Text>
                </VStack>
              ) : (
                <Text
                  fontSize="12px"
                  color="gray.600"
                >
                  Are you sure? You can&apos;t undo this action afterwards.
                </Text>
              )}
            </Dialog.Body>

            <Dialog.Footer
              pt="0"
              pb="16px"
              px="20px"
              gap="8px"
              justifyContent="flex-end"
              flexWrap="wrap"
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

              {hasTiedLanguages ? (
                onDetachAndDelete && (
                  <Button
                    h="32px"
                    px="14px"
                    bg="red.600"
                    color="white"
                    borderRadius="4px"
                    fontSize="12px"
                    fontWeight="500"
                    loading={isDeleting}
                    loadingText="Detaching & Deleting..."
                    _hover={{ bg: "red.700" }}
                    onClick={() => void onDetachAndDelete()}
                  >
                    Detach language from all events and delete
                  </Button>
                )
              ) : (
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
              )}
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
