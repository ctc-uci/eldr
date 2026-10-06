import { useState, useRef, useEffect } from "react";
import { Box, Input, InputGroup } from "@chakra-ui/react";
import { Search } from "lucide-react";

export function SearchAutocomplete({
  searchQuery,
  onSearchChange,
  suggestions,
  onSelectSuggestion,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  suggestions: string[];
  onSelectSuggestion: (value: string) => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box ref={wrapperRef} position="relative" flex={1}>
      <InputGroup startElement={<Search size={16} color="#a1a1aa" />}>
        <Input
          placeholder="Search for a tag..."
          borderColor="#ccccd1"
          borderRadius="4px"
          h="48px"
          fontSize="16px"
          _placeholder={{ color: "#a1a1aa" }}
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setShowSuggestions(e.target.value.trim().length > 0);
          }}
          onFocus={() => {
            if (searchQuery.trim().length > 0) setShowSuggestions(true);
          }}
        />
      </InputGroup>

      {showSuggestions && suggestions.length > 0 && (
        <Box
          position="absolute"
          top="52px"
          left={0}
          right={0}
          bg="white"
          border="1px solid #e4e4e7"
          borderRadius="4px"
          boxShadow="0 4px 12px rgba(0,0,0,0.08)"
          zIndex={10}
          maxH="240px"
          overflowY="auto"
        >
          {suggestions.map((s) => (
            <Box
              key={s}
              px="18px"
              py="10px"
              cursor="pointer"
              fontSize="14px"
              color="#27272a"
              _hover={{ bg: "#f4f4f5" }}
              onClick={() => {
                onSelectSuggestion(s);
                setShowSuggestions(false);
              }}
            >
              {s}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
