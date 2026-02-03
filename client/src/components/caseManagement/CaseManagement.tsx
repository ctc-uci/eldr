import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import CreateCase from "./views/CreateCase";

type Props = {};

export const CaseManagement = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex>
      <Button onClick={onOpen}>Create new case</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <CreateCase />
        </ModalContent>
      </Modal>
    </Flex>
  );
};
