import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { APPLIED_BORDER_COLORS, type TagAppliedTo, type TagItem } from "./types";

function AppliedChip({ type, count }: TagAppliedTo) {
  return (
    <Flex
      align="center"
      justify="center"
      h="32px"
      px="10px"
      borderRadius="4px"
      border="1px solid"
      borderColor={APPLIED_BORDER_COLORS[type]}
    >
      <Text fontSize="12px" fontWeight={500} color="#27272a" whiteSpace="nowrap">
        {type} ({count})
      </Text>
    </Flex>
  );
}

export function TagRow({
  tag,
  expandedId,
  onToggleExpand,
  onDelete,
  onEdit,
}: {
  tag: TagItem;
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  const isExpanded = expandedId === tag.id;

  return (
    <Box w="full">
      <Flex
        align="center"
        gap="10px"
        px="10px"
        py="10px"
        borderBottomWidth={isExpanded ? "0" : "1px"}
        borderColor="#f4f4f5"
        w="full"
      >
        <Flex align="center" px="16px" w="257px" flexShrink={0}>
          <Flex
            align="center"
            justify="center"
            h="36px"
            px="14px"
            borderRadius="4px"
            bg="#f4f4f5"
            border="1px solid #d4d4d8"
          >
            <Text fontSize="14px" fontWeight={500} color="black" whiteSpace="nowrap">
              {tag.name}
            </Text>
          </Flex>
        </Flex>

        <Flex align="center" px="16px" w="300px" flexShrink={0}>
          <Text fontSize="14px" fontWeight={500} color="black" lineHeight="20px">
            {tag.description}
          </Text>
        </Flex>

        <Flex align="center" gap="10px" px="16px" flex={1}>
          {tag.appliedTo.map((applied) => (
            <AppliedChip key={applied.type} {...applied} />
          ))}
        </Flex>

        <IconButton
          aria-label={isExpanded ? "Collapse" : "Expand"}
          variant="ghost"
          size="sm"
          color="#71717a"
          onClick={() => onToggleExpand(tag.id)}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </IconButton>
      </Flex>

      {isExpanded && (
        <Flex
          align="center"
          justify="space-between"
          ml="26px"
          pl="10px"
          pr="10px"
          py="10px"
          borderBottomWidth="1px"
          borderColor="#f4f4f5"
          bg="#fafafa"
          borderRadius="3px"
        >
          <Box
            borderBottomWidth="1px"
            borderColor="#e4e4e7"
            pb="6px"
          >
            <Text fontSize="14px" fontWeight={400} color="black">
              {tag.name}
            </Text>
          </Box>
          <HStack gap="12px">
            <Button
              size="sm"
              h="32px"
              px="12px"
              bg="#fefce8"
              border="1px solid #fef08a"
              color="#27272a"
              fontSize="12px"
              fontWeight={500}
              borderRadius="4px"
              _hover={{ bg: "#fef9c3" }}
              onClick={() => onEdit(tag.id)}
            >
              <TriangleAlert size={14} />
              Edit
            </Button>
            <Button
              size="sm"
              h="32px"
              px="12px"
              bg="#fee2e2"
              border="1px solid #fecaca"
              color="#27272a"
              fontSize="12px"
              fontWeight={500}
              borderRadius="4px"
              _hover={{ bg: "#fecaca" }}
              onClick={() => onDelete(tag.id)}
            >
              <Trash2 size={14} color="#ef4444" />
              Delete
            </Button>
          </HStack>
        </Flex>
      )}
    </Box>
  );
}
