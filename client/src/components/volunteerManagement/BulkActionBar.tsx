import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { LuArchive, LuTrash2, LuX } from "react-icons/lu";

interface BulkActionBarProps {
  count: number;
  onDelete: () => void;
  onArchive: () => void;
  onClear: () => void;
}

export const BulkActionBar = ({ count, onDelete, onArchive, onClear }: BulkActionBarProps) => {
  return (
    <Flex
      position="fixed"
      bottom={6}
      left="50%"
      transform="translateX(-50%) translateY(-100%)"
      align="center"
      gap={3}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      px={5}
      py={3}
      boxShadow="md"
      zIndex={10}
    >
      <Text fontSize="sm" fontWeight="medium" color="gray.700" border="1px dashed #E4E4E7" px={2} py={2} borderRadius="md">
        {count} selected
      </Text>
      <Box w="1px" h={5} bg="gray.200" />
      <Button size="sm" variant="ghost" color="gray.700" gap={1.5} border="1px solid #E4E4E7" onClick={onArchive}>
        <LuArchive size={15} />
        Archive
      </Button>
      <Button
        size="sm"
        variant="ghost"
        color="#991919"
        gap={1.5}
        _hover={{ bg: "red.50" }}
        onClick={onDelete}
        bg="#FEE2E2"
      >
        <LuTrash2 size={15} />
        Delete
      </Button>
      <Box w="1px" h={5} bg="gray.200" />
      <Button
        size="sm"
        variant="ghost"
        color="#27272A"
        p={1}
        minW="auto"
        _hover={{ bg: "gray.100", color: "gray.700" }}
        onClick={onClear}
      >
        <LuX size={15} />
      </Button>
    </Flex>
  );
};
