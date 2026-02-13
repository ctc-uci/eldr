import { useRef, useState } from "react";

import { Steps, Box, Button, Input, Menu, Text, Icon, Portal } from "@chakra-ui/react";
import { LuChevronDown } from 'react-icons/lu';

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
    <Menu.Root
      closeOnSelect={true}
      onOpen={() => {
        setSearchTerm("");
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }}
    >
      <Menu.Trigger asChild><Button
          bg="#ADADAD"
          border="2px solid black"
          px="8px"
          py="2px"
          h="auto"
          borderRadius="2px"
          textAlign="left">
          {value || placeholder}
          <Icon boxSize={7} asChild><LuChevronDown /></Icon></Button></Menu.Trigger>
      <Portal><Menu.Positioner><Menu.Content>
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
                value={String(searchTerm)}
                onValueChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                size="sm"
              />
            </Box>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <Menu.Item
                  key={option}
                  onSelect={() => handleSelect(option)}
                  onMouseEnter={() => searchInputRef.current?.focus()}
                  value='item-0'>
                  {option}
                </Menu.Item>
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
          </Menu.Content></Menu.Positioner></Portal>
    </Menu.Root>
  );
}

export default SearchableDropdown;
