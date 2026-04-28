import { useEffect, useState } from "react";
import { Box, Button, Checkbox, Drawer, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

const CLINIC_TYPES = ["Estate Planning", "Limited Conservatorship", "Probate Note Clearing"];
const EVENT_FORMATS = [
  { value: "in-person", label: "In-Person" },
  { value: "hybrid",    label: "Hybrid" },
  { value: "online",    label: "Online" },
];

const FilterSection = ({ label, items, checked, onToggle }) => {
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
          {items.map(({ value, label: itemLabel }) => (
            <Flex
              key={value}
              align="center"
              gap={3}
              py={2}
              px={2}
              cursor="pointer"
              onClick={() => onToggle(value)}
            >
              <Checkbox.Root cursor="pointer" size="sm" checked={checked.has(value)}>
                <Checkbox.HiddenInput />
                <Checkbox.Control borderColor="gray.300" borderRadius="sm" />
              </Checkbox.Root>
              <Text fontSize="sm">{itemLabel}</Text>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
};

const computeCount = (clinics, clinicTypes, eventFormats, languages) =>
  clinics.filter((c) => {
    if (clinicTypes.size > 0 && !clinicTypes.has(c.type)) return false;
    if (eventFormats.size > 0 && !eventFormats.has(c.locationType)) return false;
    if (languages.size > 0 && !(c.languages ?? []).some((l) => languages.has(l.language))) return false;
    return true;
  }).length;

export const EventFilterDrawer = ({ open, onClose, onApply, clinics = [] }) => {
  const { backend } = useBackendContext();
  const [languages, setLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);

  const [checkedTypes, setCheckedTypes]     = useState(new Set());
  const [checkedFormats, setCheckedFormats] = useState(new Set());
  const [checkedLangs, setCheckedLangs]     = useState(new Set());

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingLanguages(true);
    backend.get("/languages")
      .then((res) => {
        if (!cancelled) setLanguages(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingLanguages(false); });
    return () => { cancelled = true; };
  }, [open, backend]);

  const toggle = (setter) => (value) => {
    setter((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  const allSelected = [
    ...[...checkedTypes].map((v) => ({ key: v, label: v, remove: () => toggle(setCheckedTypes)(v) })),
    ...[...checkedFormats].map((v) => {
      const fmt = EVENT_FORMATS.find((f) => f.value === v);
      return { key: v, label: fmt?.label ?? v, remove: () => toggle(setCheckedFormats)(v) };
    }),
    ...[...checkedLangs].map((v) => ({ key: v, label: v, remove: () => toggle(setCheckedLangs)(v) })),
  ];

  const handleClear = () => {
    setCheckedTypes(new Set());
    setCheckedFormats(new Set());
    setCheckedLangs(new Set());
    onApply?.({ clinicTypes: new Set(), eventFormats: new Set(), languages: new Set() });
  };

  const handleApply = () => {
    onApply?.({ clinicTypes: checkedTypes, eventFormats: checkedFormats, languages: checkedLangs });
    onClose();
  };

  const resultCount = computeCount(clinics, checkedTypes, checkedFormats, checkedLangs);

  const clinicTypeItems = CLINIC_TYPES.map((t) => ({ value: t, label: t }));
  const languageItems   = languages.map((l) => ({ value: l.language, label: l.language }));

  return (
    <Drawer.Root open={open} onOpenChange={(e) => { if (!e.open) onClose(); }} placement="end">
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content maxW="380px" display="flex" flexDir="column">
          <Drawer.Header borderBottomWidth="1px" borderColor="gray.200" pb={4}>
            <Flex justify="space-between" align="center" w="100%">
              <Drawer.Title fontSize="xl" fontWeight="bold">Filter</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <Icon as={FiX} boxSize={5} cursor="pointer" color="gray.500" _hover={{ color: "gray.800" }} />
              </Drawer.CloseTrigger>
            </Flex>
          </Drawer.Header>

          <Drawer.Body flex="1" overflowY="auto" px={4} py={4}>
            <Text fontWeight="bold" fontSize="md" mb={2}>Selected Filters</Text>
            <Box borderWidth="1px" borderColor="gray.200" borderRadius="4px" minH="40px" p={2} mb={5}>
              <Flex gap={2} wrap="wrap">
                {allSelected.map(({ key, label, remove }) => (
                  <Flex key={key} align="center" gap={1} px={2} py={0.5} bg="gray.100" borderRadius="sm" fontSize="xs">
                    {label}
                    <Icon as={FiX} boxSize={3} cursor="pointer" color="gray.400" _hover={{ color: "gray.700" }} onClick={remove} />
                  </Flex>
                ))}
              </Flex>
            </Box>

            <Text fontWeight="bold" fontSize="md" mb={2}>Filter Categories</Text>

            <FilterSection
              label="Clinic Type"
              items={clinicTypeItems}
              checked={checkedTypes}
              onToggle={toggle(setCheckedTypes)}
            />
            <FilterSection
              label="Event Format"
              items={EVENT_FORMATS}
              checked={checkedFormats}
              onToggle={toggle(setCheckedFormats)}
            />
            {loadingLanguages ? (
              <Flex justify="center" py={4}><Spinner size="sm" /></Flex>
            ) : (
              <FilterSection
                label="Language"
                items={languageItems}
                checked={checkedLangs}
                onToggle={toggle(setCheckedLangs)}
              />
            )}
          </Drawer.Body>

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
                bg={allSelected.length > 0 ? "#487C9E" : "#A1A1AA"}
                color="white"
                _hover={{ bg: allSelected.length > 0 ? "#294A5F" : "#71717A" }}
                gap={2}
                onClick={handleApply}
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
