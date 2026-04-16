import { useRef } from "react";

import { CloseButton, Input, InputGroup } from "@chakra-ui/react";

import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const inputRef = (useRef < HTMLInputElement) | (null > null);

  const clearButton = searchQuery ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setSearchQuery("");
        inputRef.current?.focus();
      }}
      me="-2"
    />
  ) : (
    <FaMagnifyingGlass
      color="#9CA3AF"
      size="20px"
    />
  );

  return (
    <InputGroup
      flex="1"
      endElement={clearButton}
    >
      <Input
        placeholder="Search for whatever floats your boat, matey"
        backgroundColor="white"
        borderColor="#D1D5DB"
        borderRadius="8px"
        h="44px"
        fontSize="16px"
        _placeholder={{ color: "#9CA3AF" }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
      />
    </InputGroup>
  );
};

export default SearchBar;
