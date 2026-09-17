import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Pencil, Trash2, X } from "lucide-react";

export type TagSelectionRow = {
  sectionTitle: string;
  row: {
    id: number;
    name: string;
    clinicCount: number;
    volunteerCount: number;
  };
};

export function MultiSelectActionBar({
  selectedRows,
  onEdit,
  onDelete,
  onClear,
}: {
  selectedRows: TagSelectionRow[];
  onEdit: () => void;
  onDelete: () => void;
  onClear: () => void;
}) {
  if (selectedRows.length === 0) return null;

  return (
    <Box
      position="fixed"
      left="50%"
      bottom="24px"
      transform="translateX(-50%)"
      zIndex={40}
      w="min(560px, calc(100vw - 48px))"
    >
      <Flex
        align="center"
        justify="space-between"
        gap="12px"
        px="12px"
        py="10px"
        borderWidth="1px"
        border="1px solid #d4d4d8"
        borderRadius="4px"
        bg="white"
        boxShadow="0 8px 24px rgba(15, 23, 42, 0.12)"
      >
        <Text fontSize="14px" fontWeight={500} color="#18181b">
          {selectedRows.length} selected
        </Text>

        <Flex gap="8px">
          <Button
            variant="outline"
            size="sm"
            h="32px"
            px="12px"
            borderColor="#d4d4d8"
            color="#18181b"
            bg="white"
            fontSize="12px"
            fontWeight={500}
            _hover={{ bg: "#f4f4f5" }}
            onClick={onEdit}
            disabled={selectedRows.length !== 1}
          >
            <Pencil size={14} style={{ marginRight: "6px" }} />
            Edit
          </Button>

          <Button
            size="sm"
            h="32px"
            px="12px"
            bg="#fee2e2"
            color="#b91c1c"
            fontSize="12px"
            fontWeight={500}
            _hover={{ bg: "#fecaca" }}
            onClick={onDelete}
          >
            <Trash2 size={14} style={{ marginRight: "6px" }} />
            Delete
          </Button>

          <Button
            variant="ghost"
            size="sm"
            h="32px"
            w="32px"
            minW="32px"
            p="0"
            color="#18181b"
            bg="white"
            aria-label="Exit multi-select mode"
            title="Exit multi-select mode"
            _hover={{ bg: "#f4f4f5" }}
            onClick={onClear}
          >
            <X size={16} />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
