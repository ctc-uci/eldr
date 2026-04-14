import { Flex, Input } from "@chakra-ui/react";

import { Search } from "lucide-react";

export const SearchBar = ({ placeholder = "Search for a file or folder", maxW = "100%", mb = 1, ...props }) => (
  <Flex
    align="center"
    borderWidth="1px"
    borderColor="#D4D4D8"
    borderRadius="4px"
    h="48px"
    px="20px"
    bg="white"
    mb={mb}
    maxW={maxW}
    gap="10px"
  >
    <Input
      placeholder={placeholder}
      variant="unstyled"
      fontSize="16px"
      pl="0"
      fontWeight={400}
      color="black"
      _placeholder={{ color: "#A1A1AA" }}
      flex="1"
      {...props}
    />
    <Search size={20} color="#A1A1AA" style={{ flexShrink: 0 }} />
  </Flex>
);
