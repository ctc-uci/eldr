import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { X } from "lucide-react";

const FilterTag = ({ label, onRemove }) => {
  return (
    <Box
      bg="#F3F4F6"
      borderRadius="10px"
      px="14px"
      py="10px"
      minH="44px"
      transition="background 0.15s"
      _hover={{ bg: "#E5E7EB" }}
    >
      <HStack gap="10px">
        <Text color="#111827" fontSize="15px" fontWeight={500}>
          {label}
        </Text>

        <IconButton
          aria-label={`Remove ${label}`}
          onClick={onRemove}
          variant="ghost"
          size="sm"
          minW="24px"
          h="24px"
          p={0}
          borderRadius="full"
          cursor="pointer"
          color="#6B7280"
          _hover={{ bg: "#D1D5DB", color: "#111827" }}
        >
          <X size={18} />
        </IconButton>
      </HStack>
    </Box>
  );
};

export default FilterTag;