import { useRef } from "react";

import { Steps, Button, Text, Dialog, Portal } from "@chakra-ui/react";

import { IoIosWarning } from "react-icons/io";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
};

const DeleteConfirm = ({ isOpen, onClose, onDeleteConfirm }: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog.Root
      open={isOpen}
      initialFocusEl={() => cancelRef.current}
      placement='center'
      role='alertdialog'
      onOpenChange={e => {
        if (!e.open) {
          onClose();
        }
      }}>
      <Portal>

        <Dialog.Backdrop>
          <Dialog.Positioner>
            <Dialog.Content
              border="2px solid #DC6262"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              py={8}
              bg="#F6D0D0"
              rounded="2rem"
              maxW="380px">
              <Dialog.Header
                fontSize="lg"
                fontWeight="bold"
                display="flex"
                gap={2}
                alignItems="center"
                justifyContent="center"
              >
                <IoIosWarning size={26} />
                <Text fontSize="2xl">WARNING!</Text>
              </Dialog.Header>
              <Dialog.Body
                w="70%"
                fontSize="xl"
              >
                Are you sure you want to delete this case?
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  onClick={() => {
                    onDeleteConfirm();
                    onClose();
                  }}
                  borderRadius="0"
                  mr={4}
                  bg="transparent"
                  border="1px solid"
                  rounded="8px"
                  _hover="none"
                  _focus={{
                    bg: "transparent",
                  }}
                >
                  Delete
                </Button>
                <Button
                  ref={cancelRef}
                  onClick={onClose}
                  variant="ghost"
                  bg="black"
                  rounded="8px"
                  textColor="white"
                  _hover="none"
                  _focus={{
                    bg: "black",
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Backdrop>

      </Portal>
    </Dialog.Root>
  );
};

export default DeleteConfirm;
