import {
    Modal,
    ModalOverlay,
    ModalContent,
    Text,
    ModalBody,
    ModalFooter,
    VStack,
    HStack,
    Flex,
    IconButton
} from "@chakra-ui/react";

import { FaArrowCircleLeft } from "react-icons/fa";

export const CreateEvent = ({isOpen, onClose}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <HStack>
                    <Flex w="100%" align="center" p={2}>
                        <IconButton
                            icon={<FaArrowCircleLeft size={24} />}
                            onClick={onClose}
                            bg = "white"
                            mr={2}
                        />
                        <Text color = "black"> Back to ELDR event catalog </Text>
                    </Flex>
                </HStack>
            <ModalBody>
                <VStack>
                    <Flex 
                        w = "80%"
                        bg = "grey"
                    >

                    </Flex>
                    <Flex>

                    </Flex>
                    <Flex>

                    </Flex>
                </VStack>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
  );
}
