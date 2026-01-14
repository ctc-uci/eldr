import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    VStack
} from "@chakra-ui/react";

import { FaArrowCircleLeft } from "react-icons/fa";

export const CreateEvent = ({isOpen, onClose}) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton 
            top="8px" 
            left="8px" 
            right="auto" 
            children={<FaArrowCircleLeft size = {20}/>}
          />
          <ModalBody>
            <VStack>
                <Flex>

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
