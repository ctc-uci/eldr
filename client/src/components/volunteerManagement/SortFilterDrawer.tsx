import { useState } from "react";
import { Box, Button, Checkbox, Drawer, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { FiX, FiChevronUp, FiChevronDown } from "react-icons/fi";

const LANGUAGES = ["English", "Spanish", "French", "Mandarin", "Japanese", "Arabic"];
const INTERESTS = ["Immigration", "Criminal", "Family", "Housing", "Employment", "Civil Rights"];

interface SortFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  totalCount: number;
}

interface FilterSectionProps {
  label: string;
  items: string[];
  checked: Set<string>;
  onToggle: (item: string) => void;
}

const FilterSection = ({ label, items, checked, onToggle }: FilterSectionProps) => {
  const [expanded, setExpanded] = useState(true);
  const [search, setSearch] = useState("");
  const filtered = items.filter((i) => i.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box borderTopWidth="1px" borderColor="gray.200" pt={3} pb={3}>
      <Flex justify="space-between" align="center" cursor="pointer" onClick={() => setExpanded((v) => !v)} mb={expanded ? 3 : 0}>
        <Text fontSize="md">{label}</Text>
        <Icon as={expanded ? FiChevronUp : FiChevronDown} boxSize={4} color="gray.500" />
      </Flex>

      {expanded && (
        <>
          <Input
            placeholder="Type to search"
            fontSize="sm"
            bg="#F4F4F5"
            border="none"
            borderRadius="md"
            mb={3}
            h="36px"
            _placeholder={{ color: "#A1A1AA" }}
            _focusVisible={{ outline: "none", boxShadow: "none" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Box maxH="220px" overflowY="auto">
            {filtered.map((item) => (
              <Flex
                key={item}
                align="center"
                gap={2}
                py={1.5}
                cursor="pointer"
                onClick={() => onToggle(item)}
              >
                <Checkbox.Root
                  checked={checked.has(item)}
                  onCheckedChange={() => onToggle(item)}
                  size="sm"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control borderColor="gray.300" />
                </Checkbox.Root>
                <Text fontSize="sm">{item}</Text>
              </Flex>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export const SortFilterDrawer = ({ open, onClose, totalCount }: SortFilterDrawerProps) => {
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [checkedLangs, setCheckedLangs] = useState<Set<string>>(new Set());
  const [checkedInterests, setCheckedInterests] = useState<Set<string>>(new Set());

  const toggleLang = (item: string) => {
    setCheckedLangs((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const toggleInterest = (item: string) => {
    setCheckedInterests((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const allSelected = [...checkedLangs, ...checkedInterests];

  const handleClear = () => {
    setSortBy("newest");
    setCheckedLangs(new Set());
    setCheckedInterests(new Set());
  };

  return (
    <Drawer.Root open={open} onOpenChange={(e) => { if (!e.open) onClose(); }} placement="end">
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content maxW="380px" display="flex" flexDir="column">
          {/* Header */}
          <Drawer.Header borderBottomWidth="0" pb={4}>
            <Flex justify="space-between" align="center" w="100%">
              <Drawer.Title fontSize="xl" fontWeight="bold">Sort and Filter</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <Icon as={FiX} boxSize={5} cursor="pointer" color="gray.500" _hover={{ color: "gray.800" }} />
              </Drawer.CloseTrigger>
            </Flex>
          </Drawer.Header>

          {/* Body */}
          <Drawer.Body flex="1" overflowY="auto" px={6} py={4}>
            {/* Sort By */}
            <Text fontSize="md" mb={3}>Sort By</Text>
            <Flex mb={4} bg="gray.100" borderRadius="md" p="2px" w="fit-content">
              {(["newest", "oldest"] as const).map((opt) => (
                <Box
                  key={opt}
                  px={4}
                  py={1.5}
                  borderRadius="md"
                  fontSize="sm"
                  bg={sortBy === opt ? "white" : "transparent"}
                  boxShadow={sortBy === opt ? "sm" : "none"}
                  color={sortBy === opt ? "gray.800" : "gray.500"}
                  cursor="pointer"
                  userSelect="none"
                  onClick={() => setSortBy(opt)}
                  transition="all 0.15s"
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </Box>
              ))}
            </Flex>

            {/* Selected Filters */}
            <Box borderTopWidth="1px" borderColor="gray.200" pt={4} mb={4}>
              <Text fontSize="md" mb={2}>Selected Filters</Text>
              <Box borderWidth="1px" borderColor="gray.200" borderRadius="md" minH="40px" p={2}>
                <Flex gap={2} wrap="wrap">
                  {allSelected.map((f) => (
                    <Flex key={f} align="center" gap={1} px={2} py={0.5} bg="gray.100" borderRadius="sm" fontSize="xs">
                      {f}
                      <Icon
                        as={FiX}
                        boxSize={3}
                        cursor="pointer"
                        color="gray.400"
                        _hover={{ color: "gray.700" }}
                        onClick={() => {
                          if (checkedLangs.has(f)) toggleLang(f);
                          else toggleInterest(f);
                        }}
                      />
                    </Flex>
                  ))}
                </Flex>
              </Box>
            </Box>

            {/* Filter Categories */}
            <Text fontSize="md" mb={3}>Filter Categories</Text>
            <FilterSection label="Language" items={LANGUAGES} checked={checkedLangs} onToggle={toggleLang} />
            <FilterSection label="Area of Interest" items={INTERESTS} checked={checkedInterests} onToggle={toggleInterest} />
          </Drawer.Body>

          {/* Footer */}
          <Drawer.Footer borderTopWidth="1px" borderColor="gray.200" px={6} py={4}>
            <Flex gap={3}>
              <Button
                variant="outline"
                borderColor="gray.300"
                color="gray.700"
                bg="white"
                _hover={{ bg: "#F4F4F5" }}
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                bg="#18181B"
                color="white"
                _hover={{ bg: "#27272A" }}
              >
                See {totalCount} Results
              </Button>
            </Flex>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
