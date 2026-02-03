import {
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { FiArrowRight, FiEdit3, FiTrash2 } from "react-icons/fi";

import Case from "./views/CaseView";

type Props = {
  title: string;
  assignee: string;
  description: string;
  tags: string[];
};

const CaseCard = ({ title, assignee, description, tags }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      bg="white"
      h="230px"
      w="full"
      justify="space-between"
      align="flex-start"
      p="30px"
    >
      <Text
        fontWeight="bold"
        fontSize="lg"
      >
        {title}
      </Text>

      {/* Buttons Area */}
      <HStack spacing={2}>
        <IconButton
          aria-label="Delete case"
          icon={<FiTrash2 />}
          variant="ghost"
          colorScheme="red"
          size="lg"
        />
        <IconButton
          aria-label="Edit case"
          icon={<FiEdit3 />}
          variant="ghost"
          colorScheme="gray"
          size="lg"
        />
        <IconButton
          aria-label="View case"
          icon={<FiArrowRight />}
          variant="ghost"
          colorScheme="blue"
          size="lg"
          onClick={onOpen}
        />
        <Modal
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <Case />
          </ModalContent>
        </Modal>
      </HStack>
    </Flex>
  );
};

export default CaseCard;
