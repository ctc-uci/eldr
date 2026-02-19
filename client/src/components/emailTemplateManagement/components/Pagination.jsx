import { Box, Button, Flex, HStack } from "@chakra-ui/react";

import { FaArrowRight } from "react-icons/fa";

export const Pagination = ({ totalPages, currentPage, onPageChange }) => (
  <Box mt="auto">
    <Flex
      justify="flex-end"
      align="flex-end"
      alignContent="end"
    >
      <HStack
        spacing={1}
        bg="white"
        borderRadius="md"
        p={2}
        boxShadow="sm"
      >
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i}
            size="sm"
            variant={i + 1 === currentPage ? "solid" : "ghost"}
            borderColor="#E4E4E7"
            borderWidth={2}
            bgColor={i + 1 === currentPage ? "#D5D5D8" : "transparent"}
            fontWeight={i + 1 === currentPage ? "bold" : "normal"}
            fontSize="20px"
            color="black"
            px={4}
            py={2}
            onClick={() => onPageChange?.(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPageChange?.(currentPage + 1)}
        >
          <FaArrowRight size={24} />
        </Button>
      </HStack>
    </Flex>
  </Box>
);
