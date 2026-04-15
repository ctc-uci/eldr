import { Flex, Text } from "@chakra-ui/react";

export const FolderCard = ({ name, onClick, onContextMenu }) => (
  <Flex
    align="center"
    bg="white"
    borderRadius="6px"
    borderColor="#E4E4E7"
    borderWidth="1px"
    px={6}
    py="15px"
    cursor="pointer"
    _hover={{ bg: "gray.50" }}
    onClick={onClick}
    onContextMenu={(e) => {
      e.preventDefault();
      onContextMenu?.(e);
    }}
  >
    <Text
      fontWeight={600}
      fontSize="16px"
      lineHeight="24px"
      color="black"
    >
      {name}
    </Text>
  </Flex>
);
