import { Button, Flex, Text } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { PAGE_SIZE, getPageItems } from "./VolunteerList";

interface PaginationProps {
  page: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalCount, onPageChange }: PaginationProps) => {
  if (totalCount <= PAGE_SIZE) return null;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const showingStart = (page - 1) * PAGE_SIZE + 1;
  const showingEnd = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <Flex direction="column" align="flex-end" py={3} gap={2}>
      <Text fontSize="sm" color="gray.500">
        Showing {showingStart} to {showingEnd} of {totalCount}
      </Text>
      <Flex>
        <Button
          size="sm"
          variant="ghost"
          borderRadius="none"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          border="1px solid #E4E4E7"
          _hover={{ bg: "gray.100" }}
          _active={{ bg: "gray.200" }}
          p={0}
        >
          <LuChevronLeft />
        </Button>
        {getPageItems(page, totalPages).map((item, i) =>
          typeof item === "object" ? (
            <Button
              key={`ellipsis-${i}`}
              size="sm"
              variant="ghost"
              borderRadius="none"
              border="1px solid #E4E4E7"
              _hover={{ bg: "gray.100" }}
              _active={{ bg: "gray.200" }}
              onClick={() => onPageChange(item.target)}
              p={0}
            >
              ...
            </Button>
          ) : (
            <Button
              key={item}
              size="sm"
              borderRadius="none"
              border="1px solid #E4E4E7"
              variant={item === page ? "solid" : "ghost"}
              bg={item === page ? "black" : undefined}
              color={item === page ? "white" : undefined}
              _hover={item === page ? { bg: "black" } : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          )
        )}
        <Button
          size="sm"
          variant="ghost"
          borderRadius="none"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          border="1px solid #E4E4E7"
          _hover={{ bg: "gray.100" }}
          _active={{ bg: "gray.200" }}
          p={0}
        >
          <LuChevronRight />
        </Button>
      </Flex>
    </Flex>
  );
};
