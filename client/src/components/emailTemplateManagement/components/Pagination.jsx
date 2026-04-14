import { Box, Flex, Text } from "@chakra-ui/react";

import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ totalPages, currentPage, onPageChange, totalItems, itemsPerPage }) => {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const btnStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    h: "36px",
    borderRightWidth: "1px",
    borderRightColor: "#E4E4E7",
  };

  return (
    <Flex direction="column" gap="10px" alignItems="flex-end" py="10px" mt="auto">
      {/* Showing text */}
      {totalItems !== undefined && (
        <Text fontSize="14px" fontWeight={400} lineHeight="20px" color="#52525B">
          Showing {startItem} to {endItem} of {totalItems}
        </Text>
      )}

      {/* Pagination buttons — single outer border, overflow hidden keeps corners clean */}
      <Flex
        align="center"
        h="36px"
        borderWidth="1px"
        borderColor="#E4E4E7"
        borderRadius="4px"
        overflow="hidden"
      >
        {/* Previous */}
        <Box
          as="button"
          {...btnStyle}
          w="36px"
          cursor={currentPage > 1 ? "pointer" : "default"}
          opacity={currentPage > 1 ? 1 : 0.5}
          onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
          _hover={currentPage > 1 ? { bg: "#F4F4F5" } : {}}
        >
          <ChevronLeft size={16} color="#27272A" />
        </Box>

        {/* Page numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          const isLast = page === totalPages;
          return (
            <Box
              key={page}
              as="button"
              {...btnStyle}
              borderRightWidth={isLast ? 0 : "1px"}
              minW="36px"
              px="14px"
              bg={isActive ? "#18181B" : "transparent"}
              cursor="pointer"
              onClick={() => onPageChange?.(page)}
              _hover={!isActive ? { bg: "#F4F4F5" } : {}}
            >
              <Text
                fontSize="14px"
                fontWeight={500}
                lineHeight="20px"
                color={isActive ? "white" : "#27272A"}
                textAlign="center"
              >
                {page}
              </Text>
            </Box>
          );
        })}

        {/* Next */}
        <Box
          as="button"
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="36px"
          w="36px"
          cursor={currentPage < totalPages ? "pointer" : "default"}
          opacity={currentPage < totalPages ? 1 : 0.5}
          onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
          _hover={currentPage < totalPages ? { bg: "#F4F4F5" } : {}}
        >
          <ChevronRight size={16} color="#27272A" />
        </Box>
      </Flex>
    </Flex>
  );
};
