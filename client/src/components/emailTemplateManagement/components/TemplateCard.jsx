import { Flex, Text, Icon } from "@chakra-ui/react";
import { FaGripLines } from "react-icons/fa";

export const TemplateCard = ({ name, onClick }) => (
  <Flex
    align="center"
    bg="white"
    borderRadius="md"
    borderColor="#E4E4E7"
    borderWidth="1px"
    px={6}
    py={4}
    justify="space-between"
    cursor="pointer"
    _hover={{ bg: "gray.50" }}
    onClick={onClick}
  >
    <Text
      fontWeight="medium"
      fontSize="lg"
    >
      {name}
    </Text>
    <Icon as={FaGripLines} boxSize={5} color="gray.500" />
  </Flex>
);
