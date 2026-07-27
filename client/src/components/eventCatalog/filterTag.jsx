import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { X } from "lucide-react";

const FilterTag = ({ label, onRemove }) => {
  return (
    <Box
      bg="#F3F4F6"
      borderRadius="sm"
      px={2}
      py={1}
      transition="background 0.15s"
      _hover={{ bg: "#E5E7EB" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="2rem"
    >
      <HStack gap={1} align="center">
        <Text
          color="#111827"
          fontSize="sm"
          fontWeight="500"
          lineHeight="1"
        >
          {label}
        </Text>

        <IconButton
          aria-label={`Remove ${label}`}
          onClick={onRemove}
          variant="ghost"
          size="xs"
          p={0}
          minW="auto"
          h="auto"
          borderRadius="full"
          color="#6B7280"
          _hover={{ bg: "#D1D5DB", color: "#111827" }}
        >
          <X size={14} />
        </IconButton>
      </HStack>
    </Box>
  );
};

export default FilterTag;