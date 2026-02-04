import { useRef, useState } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";

const SearchableDropdown = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const searchInputRef = useRef(null);

  // Your options
  const options = [
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Elderberry",
    "Fig",
    "Grape",
    "Honeydew",
  ];

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setSearchTerm("");
  };

  return (
    <Menu
      closeOnSelect={true}
      onOpen={() => {
        setSearchTerm("");
        // Focus the search input when menu opens
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }}
    >
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
      >
        {selectedOption || "Select an option"}
      </MenuButton>
      <MenuList maxH="300px">
        <Box
          px={3}
          pb={2}
          position="sticky"
          top={0}
          bg="white"
          zIndex={1}
        >
          <Input
            ref={searchInputRef}
            placeholder="Search for an option"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            size="sm"
          />
        </Box>
        <Box
          overflowY="auto"
          maxH="200px"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleSelect(option)}
              >
                {option}
              </MenuItem>
            ))
          ) : (
            <Box
              px={3}
              py={2}
            >
              <Text
                color="gray.500"
                fontSize="sm"
              >
                No results found
              </Text>
            </Box>
          )}
        </Box>
      </MenuList>
    </Menu>
  );
};

export default SearchableDropdown;
