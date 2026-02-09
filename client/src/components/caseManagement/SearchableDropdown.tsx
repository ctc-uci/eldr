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

type Props = {
  options?: string[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

function SearchableDropdown({
  options = [],
  placeholder = "Select an option",
  value = "",
  onChange,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    setSearchTerm("");
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <Menu
      closeOnSelect={true}
      onOpen={() => {
        setSearchTerm("");
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }}
    >
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon boxSize={7} />}
        bg="#ADADAD"
        border="2px solid black"
        px="8px"
        py="2px"
        h="auto"
        borderRadius="2px"
        textAlign="left"
      >
        {value || placeholder}
      </MenuButton>
      <MenuList
        maxH="300px"
        overflowY="auto"
      >
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
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <MenuItem
              key={option}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => searchInputRef.current?.focus()}
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
      </MenuList>
    </Menu>
  );
}

export default SearchableDropdown;
