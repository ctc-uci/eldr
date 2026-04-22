import { Button, Flex } from "@chakra-ui/react";
import { X } from "lucide-react";

import FilterTag from "./filterTag";

const AppliedFilters = ({
  selectedFilters,
  setSelectedFilters,
  px = "16px",
  pb = "12px",
}) => {
  if (!selectedFilters || selectedFilters.length === 0) return null;

  const handleRemove = (item) => {
    setSelectedFilters((prev) => prev.filter((f) => f.id !== item.id));
  };

  const handleClearAll = () => setSelectedFilters([]);

  return (
    <Flex w="100%" px={px} pb={pb} gap="8px" wrap="wrap" bg="white" align="center">
      {selectedFilters.map((item) => (
        <FilterTag
          key={item.id}
          label={item.text}
          onRemove={() => handleRemove(item)}
        />
      ))}

      {selectedFilters.length >= 2 && (
        <Button
          onClick={handleClearAll}
          variant="ghost"
          size="sm"
          h="44px"
          px="10px"
          fontSize="14px"
          fontWeight={500}
          color="#6B7280"
          _hover={{ bg: "#F3F4F6", color: "#111827" }}
        >
          <X size={16} />
          Clear all
        </Button>
      )}
    </Flex>
  );
};

export default AppliedFilters;