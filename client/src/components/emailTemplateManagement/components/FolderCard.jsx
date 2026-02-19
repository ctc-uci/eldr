import { Flex, Text } from "@chakra-ui/react";

import { FaGripLines } from "react-icons/fa";

export const FolderCard = ({ name, onClick }) => (
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
    <FaGripLines
      size={24}
      color="black"
      cursor="pointer"
    />
  </Flex>
);
