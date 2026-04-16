import { Input, InputGroup } from "@chakra-ui/react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <InputGroup
      flex="1"
      endElement={
        <FaMagnifyingGlass
          color="#9CA3AF"
          size="20px"
        />
      }
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
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </InputGroup>
  );
};

export default SearchBar;
