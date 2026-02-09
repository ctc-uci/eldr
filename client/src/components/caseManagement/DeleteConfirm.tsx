import { useRef } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from "@chakra-ui/react";

import { IoIosWarning } from "react-icons/io";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
};

const DeleteConfirm = ({ isOpen, onClose, onDeleteConfirm }: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent
          border="2px solid #DC6262"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          py={8}
          bg="#F6D0D0"
          rounded="2rem"
          maxW="380px"
        >
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            display="flex"
            gap={2}
            alignItems="center"
            justifyContent="center"
          >
            <IoIosWarning size={26} />
            <Text fontSize="2xl">WARNING!</Text>
          </AlertDialogHeader>

          <AlertDialogBody
            w="70%"
            fontSize="xl"
          >
            Are you sure you want to delete this case?
          </AlertDialogBody>

          <AlertDialogFooter>
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
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteConfirm;
