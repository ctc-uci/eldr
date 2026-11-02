import { useEffect, useMemo, useState } from "react";
import { Box, Button, Checkbox, Drawer, Flex, Icon, Text } from "@chakra-ui/react";
import { FiX, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { Volunteer } from "@/types/volunteer";

import { DEFAULT_TOP_LANGUAGES } from "@eldr/shared";

// TODO Need to change data to more applicable to app
const ROLES = ["Attorney", "General Volunteer", "Law Student", "Notary", "Paralegal/Legal Worker", "Paralegal Student", "Undergraduate Student"];
const INTERESTS = ["Immigration Law", "Housing", "Family", "Civil Rights & Discrimination", "Labor", "Criminal Justice"];


export interface FilterState {
  roles: Set<string>;
  interests: Set<string>;
  languages: Set<string>;
}

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  volunteers: Volunteer[];
  onApply?: (filters: FilterState) => void;
}

const computeCount = (
  volunteers: Volunteer[],
  roles: Set<string>,
  interests: Set<string>,
  languages: Set<string>
) => {
  const lowerLanguages = new Set(Array.from(languages).map((l) => l.toLowerCase()));
  return volunteers.filter((v) => {
    if (roles.size > 0 && !v.roles?.some((r) => roles.has(r))) return false;
    if (interests.size > 0 && !v.areasOfPractice?.some((a) => interests.has(a))) return false;
    if (
      lowerLanguages.size > 0 &&
      !v.languages?.some((l) => lowerLanguages.has(l.toLowerCase()))
    )
      return false;
    return true;
  }).length;
};

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

export const FilterDrawer = ({ open, onClose, volunteers, onApply }: FilterDrawerProps) => {
  const { backend } = useBackendContext();
  const [catalogLanguages, setCatalogLanguages] = useState<string[]>([]);
  const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());
  const [checkedInterests, setCheckedInterests] = useState<Set<string>>(new Set());
  const [checkedLanguages, setCheckedLanguages] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    const loadLanguages = async () => {
      try {
        const res = await backend.get("/languages");
        if (cancelled) return;
        const rows: unknown[] = Array.isArray(res?.data) ? res.data : [];
        const names = rows
          .map((r) => String((r as { language?: unknown })?.language ?? "").trim())
          .filter(Boolean);
        setCatalogLanguages(names);
      } catch (err) {
        console.error("Failed to load languages for filter drawer:", err);
      }
    };
    void loadLanguages();
    return () => {
      cancelled = true;
    };
  }, [backend]);

  const languageItems = useMemo(() => {
    const volunteerLanguages = volunteers
      .flatMap((v) => v.languages ?? [])
      .map((l) => l.trim())
      .filter(Boolean);

    const seen = new Map<string, string>();
    for (const lang of [
      ...DEFAULT_TOP_LANGUAGES,
      ...catalogLanguages,
      ...volunteerLanguages,
    ]) {
      const key = lang.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, lang);
      }
    }

    const topSet = new Set(DEFAULT_TOP_LANGUAGES.map((l) => l.toLowerCase()));
    const topList = DEFAULT_TOP_LANGUAGES.map(
      (t) => seen.get(t.toLowerCase()) ?? t
    );
    const remaining = Array.from(seen.values())
      .filter((lang) => !topSet.has(lang.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));

    return [...topList, ...remaining];
  }, [catalogLanguages, volunteers]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (item: string) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  };

  const allSelected = [
    ...checkedRoles,
    ...checkedInterests,
    ...checkedLanguages,
  ];

  const resultCount = computeCount(volunteers, checkedRoles, checkedInterests, checkedLanguages);

  const removeFilter = (f: string) => {
    if (checkedRoles.has(f)) toggle(setCheckedRoles)(f);
    else if (checkedInterests.has(f)) toggle(setCheckedInterests)(f);
    else toggle(setCheckedLanguages)(f);
  };

  const handleClear = () => {
    setCheckedRoles(new Set());
    setCheckedInterests(new Set());
    setCheckedLanguages(new Set());
    onApply?.({ roles: new Set(), interests: new Set(), languages: new Set() });
  };

  return (
    <Drawer.Root open={open} onOpenChange={(e) => { if (!e.open) onClose(); }} placement="end">
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content maxW="380px" display="flex" flexDir="column">
          {/* Header */}
          <Drawer.Header borderBottomWidth="1px" borderColor="gray.200" pb={4}>
            <Flex justify="space-between" align="center" w="100%">
              <Drawer.Title fontSize="xl" fontWeight="bold">Filter</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <Icon as={FiX} boxSize={5} cursor="pointer" color="gray.500" _hover={{ color: "gray.800" }} />
              </Drawer.CloseTrigger>
            </Flex>
          </Drawer.Header>

          {/* Body */}
          <Drawer.Body flex="1" overflowY="auto" px={4} py={4}>
            {/* Selected Filters */}
            <Text fontWeight="bold" fontSize="md" mb={2}>Selected Filters</Text>
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
            <Text fontWeight="bold" fontSize="md" mb={2}>Filter Categories</Text>
            <FilterSection label="Role" items={ROLES} checked={checkedRoles} onToggle={toggle(setCheckedRoles)} />
            <FilterSection label="Interest" items={INTERESTS} checked={checkedInterests} onToggle={toggle(setCheckedInterests)} />
            <FilterSection label="Language" items={languageItems} checked={checkedLanguages} onToggle={toggle(setCheckedLanguages)} />
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
                bg={allSelected.length > 0 ? "brand.navy" : "#A1A1AA"}
                color="white"
                fontFamily="heading"
                _hover={{ bg: allSelected.length > 0 ? "brand.navyHover" : "#71717A" }}
                gap={2}
                onClick={() => {
                  onApply?.({ roles: checkedRoles, interests: checkedInterests, languages: checkedLanguages });
                  onClose();
                }}
              >
                <MdFilterList />
                {allSelected.length > 0 ? `See ${resultCount} Results` : "See Results"}
              </Button>
            </Flex>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
