import { useState } from "react";
import { Box, Button, Checkbox, Drawer, Flex, Icon, Text } from "@chakra-ui/react";
import { FiX, FiChevronUp, FiChevronDown, FiSliders } from "react-icons/fi";

// TODO Need to change data to more applicable to app
const OCCUPATIONS = ["Attorney", "General Volunteer", "Law Student", "Notary", "Paralegal/Legal Worker", "Paralegal Student", "Undergraduate Student"];
const INTERESTS = ["Immigration Law", "Housing", "Family", "Civil Rights & Discrimination", "Labor", "Criminal Justice"];
const LANGUAGES = ["Arabic", "English", "French", "Japanese", "Korean", "Mandarin", "Portuguese", "Spanish"];


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

  return (
    <Box borderTopWidth="1px" borderColor="gray.200" pt={3} pb={3}>
      <Flex
        justify="space-between"
        align="center"
        cursor="pointer"
        onClick={() => setExpanded((v) => !v)}
        mb={expanded ? 3 : 0}
        px={2}
      >
        <Text fontWeight="semibold" fontSize="sm">{label}</Text>
        <Icon as={expanded ? FiChevronUp : FiChevronDown} boxSize={4} color="gray.500" />
      </Flex>

      {expanded && (
        <Box>
          {items.map((item) => (
            <Flex
              key={item}
              align="center"
              gap={3}
              py={2}
              px={2}
              cursor="pointer"
              onClick={() => onToggle(item)}
            >
              <Checkbox.Root
                cursor="pointer"
                size="sm"
                checked={checked.has(item)}
                onCheckedChange={() => onToggle(item)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control borderColor="gray.300" borderRadius="sm" />
              </Checkbox.Root>
              <Text fontSize="sm">{item}</Text>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
};

export const SortFilterDrawer = ({ open, onClose, totalCount }: SortFilterDrawerProps) => {
  const [sortBy, setSortBy] = useState<"active" | "inactive">("active");
  const [checkedOccupations, setCheckedOccupations] = useState<Set<string>>(new Set());
  const [checkedInterests, setCheckedInterests] = useState<Set<string>>(new Set());
  const [checkedLanguages, setCheckedLanguages] = useState<Set<string>>(new Set());

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (item: string) => {
    setter((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const allSelected = [
    ...checkedOccupations,
    ...checkedInterests,
    ...checkedLanguages,
  ];

  const removeFilter = (f: string) => {
    if (checkedOccupations.has(f)) toggle(setCheckedOccupations)(f);
    else if (checkedInterests.has(f)) toggle(setCheckedInterests)(f);
    else toggle(setCheckedLanguages)(f);
  };

  const handleClear = () => {
    setSortBy("active");
    setCheckedOccupations(new Set());
    setCheckedInterests(new Set());
    setCheckedLanguages(new Set());
  };

  return (
    <Drawer.Root open={open} onOpenChange={(e) => { if (!e.open) onClose(); }} placement="end">
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content maxW="380px" display="flex" flexDir="column">
          {/* Header */}
          <Drawer.Header borderBottomWidth="1px" borderColor="gray.200" pb={4}>
            <Flex justify="space-between" align="center" w="100%">
              <Drawer.Title fontSize="xl" fontWeight="bold">Sort and Filter</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <Icon as={FiX} boxSize={5} cursor="pointer" color="gray.500" _hover={{ color: "gray.800" }} />
              </Drawer.CloseTrigger>
            </Flex>
          </Drawer.Header>

          {/* Body */}
          <Drawer.Body flex="1" overflowY="auto" px={4} py={4}>
            {/* Sort By */}
            <Text fontWeight="bold" fontSize="sm" mb={3}>Sort By</Text>
            <Flex mb={5} bg="gray.100" borderRadius="md" p="2px" w="fit-content">
              {(["active", "inactive"] as const).map((opt) => (
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
            <Text fontWeight="bold" fontSize="sm" mb={2}>Selected Filters</Text>
            <Box borderWidth="1px" borderColor="gray.200" borderRadius="md" minH="40px" p={2} mb={5}>
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
                      onClick={() => removeFilter(f)}
                    />
                  </Flex>
                ))}
              </Flex>
            </Box>

            {/* Filter Categories */}
            <Text fontWeight="bold" fontSize="sm" mb={2}>Filter Categories</Text>
            <FilterSection label="Occupation" items={OCCUPATIONS} checked={checkedOccupations} onToggle={toggle(setCheckedOccupations)} />
            <FilterSection label="Interest" items={INTERESTS} checked={checkedInterests} onToggle={toggle(setCheckedInterests)} />
            <FilterSection label="Language" items={LANGUAGES} checked={checkedLanguages} onToggle={toggle(setCheckedLanguages)} />
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
                bg="#52525B"
                color="white"
                _hover={{ bg: "#3F3F46" }}
                gap={2}
              >
                <FiSliders />
                See Results
              </Button>
            </Flex>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
