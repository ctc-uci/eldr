import { useEffect, useMemo, useRef, useState } from "react";

import {
  Box,
  CloseButton,
  Input,
  InputGroup,
  List,
  Text,
} from "@chakra-ui/react";

import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = ({ searchQuery, setSearchQuery, events = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || !events.length) return [];
    const q = searchQuery.toLowerCase();
    // Get unique event names that match
    const matches = events
      .filter((e) => e.name && e.name.toLowerCase().includes(q))
      .map((e) => e.name);
    return Array.from(new Set(matches)).slice(0, 5);
  }, [searchQuery, events]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (name) => {
    setSearchQuery(name);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearButton = searchQuery ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setSearchQuery("");
        setIsOpen(false);
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
    <Box
      ref={containerRef}
      position="relative"
      flex="1"
    >
      <InputGroup endElement={clearButton}>
        <Input
          ref={inputRef}
          placeholder="Search for whatever floats your boat, matey"
          backgroundColor="white"
          borderColor="#D1D5DB"
          borderRadius="8px"
          h="44px"
          fontSize="16px"
          _placeholder={{ color: "#9CA3AF" }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.currentTarget.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
      </InputGroup>

      {isOpen && searchQuery.trim() && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          mt="4px"
          bg="white"
          boxShadow="lg"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="#E5E7EB"
          zIndex={100}
          overflow="hidden"
        >
          {suggestions.length > 0 ? (
            <List.Root variant="plain">
              {suggestions.map((name, index) => (
                <List.Item
                  key={index}
                  px="16px"
                  py="10px"
                  cursor="pointer"
                  _hover={{ bg: "#F3F4F6" }}
                  _active={{ bg: "#E5E7EB" }}
                  onClick={() => handleSelect(name)}
                >
                  <Text
                    fontSize="14px"
                    color="#111827"
                    truncate
                  >
                    {name}
                  </Text>
                </List.Item>
              ))}
            </List.Root>
          ) : (
            <Box
              px="16px"
              py="10px"
            >
              <Text
                fontSize="14px"
                color="#6B7280"
              >
                No events found
              </Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
