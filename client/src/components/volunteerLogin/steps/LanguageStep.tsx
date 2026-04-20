import { useEffect, useMemo, useRef, useState } from "react";
 
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  Progress,
  Text,
} from "@chakra-ui/react";
 
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { LuArrowRight, LuSearch, LuX } from "react-icons/lu";
import LoginLayout from "./BackgroundLayout";
 
type Props = {
  onNext: () => void;
  volunteerId?: number;
  onLanguagesSelected?: (languages: string[]) => void;
};
 
type LanguageRow = {
  id: number;
  language: string;
};
 
const getErrorMessage = (e: unknown, fallback: string) => {
  const err = e as {
    response?: { data?: { message?: string } | string };
    message?: string;
  };
  const msg =
    (typeof err?.response?.data === "object" ? err.response?.data?.message : undefined) ||
    (typeof err?.response?.data === "string" ? err.response.data : undefined) ||
    err?.message;
  return typeof msg === "string" && msg.trim() ? msg : fallback;
};

const LanguageMultiSelect = ({
  label,
  items,
  selected,
  onChange,
  disabled,
  placeholder,
}: {
  label: React.ReactNode;
  items: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((l) =>
    l.toLowerCase().includes(search.toLowerCase())
  );
 
  const toggle = (lang: string) => {
    onChange(
      selected.includes(lang)
        ? selected.filter((s) => s !== lang)
        : [...selected, lang]
    );
  };
 
  const remove = (lang: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== lang));
  };
 
  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setSearch("");
  };
 
  const updateDropdownPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  };
 
  const handleFocus = () => {
    if (disabled) return;
    updateDropdownPosition();
    setOpen(true);
  };
 
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  useEffect(() => {
    if (!open) return;
    const handleReposition = () => updateDropdownPosition();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open]);
 
  return (
    <Box position="relative" ref={containerRef}>
      <Text
        fontSize={{ base: "14px", md: "16px" }}
        fontWeight={600}
        color="black"
        mb="6px"
      >
        {label}
      </Text>
 
      {/* Trigger bar — contains tags + live search input */}
      <Flex
        ref={triggerRef}
        align="center"
        border="1px solid"
        borderColor={open ? "#3182CE" : "#E4E4E7"}
        borderRadius="6px"
        px="12px"
        minH={{ base: "40px", md: "44px" }}
        py="6px"
        bg={disabled ? "gray.50" : "white"}
        flexWrap="wrap"
        gap="6px"
        opacity={disabled ? 0.6 : 1}
        onClick={() => inputRef.current?.focus()}
        cursor={disabled ? "not-allowed" : "text"}
      >
        {/* Search icon */}
        <Box color="gray.400" display="flex" alignItems="center" flexShrink={0}>
          <LuSearch size={15} />
        </Box>
 
        {/* Selected tags */}
        {selected.map((lang) => (
          <Flex
            key={lang}
            align="center"
            gap="4px"
            bg="#F4F4F5"
            border="1px solid"
            borderColor="#E4E4E7"
            borderRadius="2px"
            px="8px"
            py="2px"
            fontSize="12px"
            color="black"
            flexShrink={0}
          >
            {lang}
            <Box
              as="span"
              onClick={(e: React.MouseEvent) => remove(lang, e)}
              cursor="pointer"
              color="gray.400"
              _hover={{ color: "gray.600" }}
              display="flex"
              alignItems="center"
            >
              <LuX size={10} />
            </Box>
          </Flex>
        ))}
 
        {/* The actual search input */}
        <Input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            handleFocus();
          }}
          placeholder={
            selected.length === 0
              ? (placeholder ?? "Search for languages")
              : open
                ? "Add tag..."
                : ""
          }
          disabled={disabled}
          border="none"
          p="0"
          h="auto"
          minW="80px"
          flex="1"
          fontSize={{ base: "13px", md: "14px" }}
          color="black"
          focusRingColor="transparent"
          bg="transparent"
          _placeholder={{ color: "gray.400" }}
          cursor={disabled ? "not-allowed" : "text"}
        />
 
        {/* Clear all */}
        {selected.length > 0 && (
          <Box
            as="span"
            onClick={clearAll}
            cursor="pointer"
            color="gray.400"
            _hover={{ color: "gray.600" }}
            display="flex"
            alignItems="center"
            flexShrink={0}
          >
            <LuX size={15} />
          </Box>
        )}
      </Flex>
 
      {/* Dropdown list */}
      {open && (
        <Box
          ref={dropdownRef}
          style={dropdownStyle}
          bg="white"
          border="1px solid"
          borderColor="#E4E4E7"
          borderRadius="6px"
          boxShadow="lg"
          maxH="240px"
          overflowY="auto"
        >
          {filtered.length === 0 ? (
            <Text px="12px" py="10px" fontSize="13px" color="gray.400">
              No results found
            </Text>
          ) : (
            filtered.map((lang) => (
              <Flex
                key={lang}
                align="center"
                px="12px"
                py="10px"
                cursor="pointer"
                _hover={{ bg: "gray.50" }}
                onClick={() => toggle(lang)}
                gap="10px"
              >
                <Checkbox.Root
                  checked={selected.includes(lang)}
                  colorPalette="blue"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => toggle(lang)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control
                    borderColor={selected.includes(lang) ? "black" : "#D1D5DB"}
                    bg={selected.includes(lang) ? "black" : "white"}
                  >
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                </Checkbox.Root>
                <Text fontSize={{ base: "13px", md: "14px" }} color="black">
                  {lang}
                </Text>
              </Flex>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};
 
const LanguageStep = ({ onNext, volunteerId, onLanguagesSelected }: Props) => {
  const { backend } = useBackendContext();
 
  const [allLanguages, setAllLanguages] = useState<LanguageRow[]>([]);
  const [selectedLanguageNames, setSelectedLanguageNames] = useState<string[]>([]);
  const [literateLanguageNames, setLiterateLanguageNames] = useState<string[]>([]);
 
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
 
  const effectiveVolunteerId =
    volunteerId ?? Number(localStorage.getItem("volunteerId") || 0);
 
  useEffect(() => {
    const fetchLanguages = async () => {
      setErrorMsg(null);
      setIsLoading(true);
      try {
        const resp = await backend.get("/languages");
        const rows: unknown[] = Array.isArray(resp?.data) ? resp.data : [];
        const parsed: LanguageRow[] = rows
          .map((r) => {
            const row = r as { id?: unknown; language?: unknown };
            return {
              id: Number(row.id),
              language: String(row.language ?? "").trim(),
            };
          })
          .filter((r) => r.id && r.language);
        setAllLanguages(parsed);
      } catch (e: unknown) {
        setErrorMsg(getErrorMessage(e, "Failed to load languages."));
      } finally {
        setIsLoading(false);
      }
    };
    fetchLanguages();
  }, [backend]);
 
  const nameToId = useMemo(() => {
    const m = new Map<string, number>();
    for (const row of allLanguages) m.set(row.language, row.id);
    return m;
  }, [allLanguages]);
 
  const allLanguageNames = useMemo(() => {
    return [...new Set(allLanguages.map((l) => l.language))].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [allLanguages]);

  // "Literate in" must be a subset of the selected languages
  const literateOptions = useMemo(
    () => selectedLanguageNames,
    [selectedLanguageNames]
  );

  // If selected languages change, keep literate selections valid.
  useEffect(() => {
    setLiterateLanguageNames((prev) =>
      prev.filter((n) => selectedLanguageNames.includes(n))
    );
  }, [selectedLanguageNames]);
 
  const handleContinue = async () => {
    setErrorMsg(null);
 
    if (!effectiveVolunteerId) {
      setErrorMsg("Missing volunteer id. Please go back and create your account again.");
      return;
    }
 
    if (selectedLanguageNames.length === 0) {
      localStorage.setItem("volunteerSelectedLanguages", JSON.stringify([]));
      localStorage.setItem("volunteerLiterateLanguages", JSON.stringify([]));
      onLanguagesSelected?.([]);
      onNext();
      return;
    }
 
    const payload = {
      languages: selectedLanguageNames
        .map((name) => {
          const languageId = nameToId.get(name);
          if (!languageId) return null;
          return { languageId, isLiterate: literateLanguageNames.includes(name) };
        })
        .filter(Boolean),
    };
 
    if (!payload.languages.length) {
      onLanguagesSelected?.([]);
      onNext();
      return;
    }
 
    setIsSubmitting(true);
    try {
      await backend.post(`/volunteers/${effectiveVolunteerId}/languages`, payload);
      localStorage.setItem(
        "volunteerSelectedLanguages",
        JSON.stringify(selectedLanguageNames)
      );
      localStorage.setItem(
        "volunteerLiterateLanguages",
        JSON.stringify(literateLanguageNames)
      );
      onLanguagesSelected?.(selectedLanguageNames);
      onNext();
    } catch (e: unknown) {
      setErrorMsg(getErrorMessage(e, "Failed to save languages."));
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <LoginLayout>
      <Flex
        w="80vw"
        maxW="1200px"
        minH="80vh"
        bg="#FFFFFF"
        borderRadius="sm"
        border="1px solid"
        borderColor="#E4E4E7"
        direction="column"
        overflow="hidden"
      >
        <Flex w="100%" h="70px" bg="#F6F6F6" flexShrink={0} align="center" px="2%" py="1%" />
 
        <Flex flex="1" direction={{ base: "column", md: "row" }}>
          {/* Left */}
          <Flex
            direction="column"
            justify="space-between"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="8%"
            borderRight={{ base: "none", md: "1px solid #E4E4E7" }}
            borderBottom={{ base: "1px solid #E4E4E7", md: "none" }}
            borderColor="#E4E4E7"
            gap={{ base: "32px", md: "0" }}
          >
            <Box maxW="350px">
              <Heading
                fontSize={{ base: "17px", md: "22px", lg: "27px" }}
                fontWeight={700}
                color="black"
                mb="28px"
              >
                Volunteer Account Creation
              </Heading>
              <Text fontSize={{ base: "14px", md: "16px", lg: "20px" }} color="black">
                Select any languages you speak and your level of proficiency.
                <br /><br />
                Be as accurate as possible. Volunteers may be asked to assist/dictate in languages they indicate.
              </Text>
            </Box>
          </Flex>
 
          {/* Right */}
          <Flex
            direction="column"
            justify="flex-start"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="10%"
            gap={{ base: "16px", md: "18px" }}
          >
            <Progress.Root value={2} size="xs">
              <Progress.Track>
                <Progress.Range bg="#0088FF" />
              </Progress.Track>
            </Progress.Root>
 
            {errorMsg && (
              <Box border="1px solid" borderColor="red.200" bg="red.50" p="10px" borderRadius="8px">
                <Text color="red.700" fontSize="14px">{errorMsg}</Text>
              </Box>
            )}
 
            <LanguageMultiSelect
              label={
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>Select any non-english languages you speak</span>
                  <span style={{ backgroundColor: "#F4F4F5", color: "black", fontSize: 12, padding: "2px 6px", borderRadius: 4 }}>
                    optional
                  </span>
                </span>
              }
              items={allLanguageNames}
              selected={selectedLanguageNames}
              onChange={setSelectedLanguageNames}
              disabled={isLoading}
              placeholder={isLoading ? "Loading..." : "Search for languages"}
            />
 
            <LanguageMultiSelect
              label={
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>Indicate in which you are literate</span>
                  <span style={{ backgroundColor: "#F4F4F5", color: "black", fontSize: 12, padding: "2px 6px", borderRadius: 4 }}>
                    optional
                  </span>
                </span>
              }
              items={literateOptions}
              selected={literateLanguageNames}
              onChange={setLiterateLanguageNames}
              disabled={isLoading}
              placeholder={isLoading ? "Loading..." : "Search for languages"}
            />
 
            <Button
              bg="white"
              borderColor="#E4E4E7"
              color="black"
              h={{ base: "40px", md: "48px" }}
              borderRadius="8px"
              fontSize={{ base: "13px", md: "16px" }}
              fontWeight={600}
              _active={{ bg: "black", color: "white" }}
              _hover={{ bg: "#F4F4F5", _active: { bg: "black", color: "white" } }}
              position="relative"
              w="100%"
              px="20px"
              onClick={handleContinue}
              loading={isSubmitting}
            >
              <Box w="100%" textAlign="center">Continue</Box>
              <Box position="absolute" right="12px">
                <LuArrowRight size={16} />
              </Box>
            </Button>
          </Flex>
        </Flex>
 
        <Box w="100%" h="70px" bg="#F6F6F6" flexShrink={0} />
      </Flex>
    </LoginLayout>
  );
};
 
export default LanguageStep;