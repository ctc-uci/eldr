import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { LuCircleUser, LuListFilter } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

interface VolunteerToolbarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterOpen: () => void;
}

export const VolunteerToolbar = ({ searchQuery, onSearchChange, onFilterOpen }: VolunteerToolbarProps) => {
  const navigate = useNavigate();

  return (
    <Flex gap={2} align="center" mb={4}>
      <Button
        size="md"
        variant="outline"
        backgroundColor="#FAFAFA"
        onClick={onFilterOpen}
      >
        <LuListFilter />
        Filter
      </Button>
      <Flex
        align="center"
        borderWidth="1px"
        borderColor="gray.300"
        borderRadius="sm"
        px={2}
        w="100%"
        h="40px"
      >
        <Input
          placeholder="Search..."
          fontSize="md"
          border="none"
          _placeholder={{ color: "#A1A1AA" }}
          _focusVisible={{ border: "none", boxShadow: "none", outline: "none" }}
          value={searchQuery}
          onChange={onSearchChange}
        />
        <Box color="gray.400" flexShrink={0} mr={2}>
          <FiSearch />
        </Box>
      </Flex>
      <Button
        size="md"
        bg="#5F80A0"
        color="white"
        borderRadius="md"
        py={4}
        gap={2}
        _hover={{ bg: "#487C9E" }}
        onClick={() => navigate("/volunteer-management/new")}
      >
        <LuCircleUser />
        Add Profile
        <FiArrowRight />
      </Button>
    </Flex>
  );
};
