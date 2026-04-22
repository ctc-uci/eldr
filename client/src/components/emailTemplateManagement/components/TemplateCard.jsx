import { Flex, Text } from "@chakra-ui/react";

export const TemplateCard = ({ name, onClick, onContextMenu }) => (
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
    _hover={{ bg: "#E4E4E7" }}
    onClick={onClick}
    onContextMenu={(e) => {
      e.preventDefault();
      onContextMenu?.(e);
    }}
  >
    <Text fontWeight="medium" fontSize="lg">
      {name}
    </Text>
  </Flex>
);
