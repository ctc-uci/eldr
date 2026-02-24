import { useEffect, useMemo, useRef, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Progress,
  Text,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import {
  LuArrowRight,
  LuChevronDown,
  LuFacebook,
  LuMail,
  LuX,
} from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
  volunteerId?: number;
};

type LanguageRow = {
  id: number;
  language: string;
};

const LanguageMultiSelect = ({
  label,
  items,
  selected,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  items: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleOpen = () => {
    if (disabled) return;
    if (!open) updateDropdownPosition();
    setOpen((o) => !o);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
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
    <Box position="relative">
      <Text
        fontSize={{ base: "14px", md: "16px" }}
        fontWeight={600}
        color="black"
        mb="6px"
      >
        {label}
      </Text>

      <Flex
        ref={triggerRef}
        align="center"
        justify="space-between"
        border="1px solid"
        borderColor={open ? "#4A90D9" : "#E4E4E7"}
        borderRadius="6px"
        px="12px"
        minH={{ base: "40px", md: "44px" }}
        py="6px"
        cursor={disabled ? "not-allowed" : "pointer"}
        onClick={handleOpen}
        bg={disabled ? "gray.50" : "white"}
        userSelect="none"
        flexWrap="wrap"
        gap="6px"
        opacity={disabled ? 0.6 : 1}
      >
        {selected.length === 0 ? (
          <Text
            fontSize={{ base: "13px", md: "14px" }}
            color="gray.400"
            flex="1"
          >
            {placeholder ?? "Search tags"}
          </Text>
        ) : (
          <Flex
            flex="1"
            flexWrap="wrap"
            gap="6px"
            align="center"
          >
            {selected.map((lang) => (
              <Flex
                key={lang}
                align="center"
                gap="4px"
                bg="white"
                border="1px solid"
                borderColor="#E4E4E7"
                borderRadius="full"
                px="10px"
                py="2px"
                fontSize="13px"
                color="black"
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
                  <LuX size={11} />
                </Box>
              </Flex>
            ))}
          </Flex>
        )}
        <LuChevronDown
          size={16}
          color="#9CA3AF"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        />
      </Flex>

      {open && (
        <Box
          ref={dropdownRef}
          style={dropdownStyle}
          bg="white"
          border="1px solid"
          borderColor="#E4E4E7"
          borderRadius="6px"
          boxShadow="lg"
          maxH="220px"
          overflowY="auto"
        >
          <Box
            px="12px"
            py="8px"
            borderBottom="1px solid"
            borderColor="#E4E4E7"
            position="sticky"
            top={0}
            bg="white"
            zIndex={1}
          >
            <Input
              placeholder="Search tags"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              border="none"
              p="0"
              fontSize={{ base: "13px", md: "14px" }}
              focusRingColor="transparent"
              onClick={(e) => e.stopPropagation()}
            />
          </Box>

          {filtered.length === 0 ? (
            <Text
              px="12px"
              py="10px"
              fontSize="13px"
              color="gray.400"
            >
              No results
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
                <Text
                  fontSize={{ base: "13px", md: "14px" }}
                  color="black"
                >
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

const LanguageStep = ({ onNext, volunteerId }: Props) => {
  const { backend } = useBackendContext();

  const [allLanguages, setAllLanguages] = useState<LanguageRow[]>([]);
  const [selectedLanguageNames, setSelectedLanguageNames] = useState<string[]>(
    []
  );
  const [literateLanguageNames, setLiterateLanguageNames] = useState<string[]>(
    []
  );

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
        const rows = (resp?.data ?? []) as any[];

        // Expecting keysToCamel output from backend:
        // [{ id, language }, ...]
        const parsed: LanguageRow[] = rows
          .map((r) => ({
            id: Number(r.id),
            language: String(r.language ?? "").trim(),
          }))
          .filter((r) => r.id && r.language);

        setAllLanguages(parsed);
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Failed to load languages.";
        setErrorMsg(
          typeof msg === "string" ? msg : "Failed to load languages."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, [backend]);

  // Name -> id map (for backend payload)
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

  // keep literate subset valid when selected changes
  useEffect(() => {
    setLiterateLanguageNames((prev) =>
      prev.filter((x) => selectedLanguageNames.includes(x))
    );
  }, [selectedLanguageNames]);

  const handleContinue = async () => {
    setErrorMsg(null);

    if (!effectiveVolunteerId) {
      setErrorMsg(
        "Missing volunteer id. Please go back and create your account again."
      );
      return;
    }

    // If nothing selected, just continue
    if (selectedLanguageNames.length === 0) {
      onNext();
      return;
    }

    const payload = {
      languages: selectedLanguageNames
        .map((name) => {
          const languageId = nameToId.get(name);
          if (!languageId) return null;
          return {
            languageId,
            isLiterate: literateLanguageNames.includes(name),
          };
        })
        .filter(Boolean),
    };

    if (!payload.languages.length) {
      onNext();
      return;
    }

    setIsSubmitting(true);
    try {
      await backend.post(
        `/volunteers/${effectiveVolunteerId}/languages`,
        payload
      );
      onNext();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Failed to save languages.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to save languages.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginLayout>
      <Flex
        w="100%"
        maxW="1091px"
        minH={{ base: "auto", lg: "914px" }}
        bg="#FFFFFF"
        borderRadius={{ base: "8px", md: "4px" }}
        border="1px solid"
        borderColor="#E4E4E7"
        direction="column"
      >
        {/* Top bar */}
        <Flex
          w="100%"
          h={{ base: "56px", md: "70px" }}
          bg="#E8E8E8"
          flexShrink={0}
          align="center"
          px={{ base: "16px", md: "24px" }}
        >
          <Image
            src={logo}
            alt="ELDR Logo"
            h={{ base: "32px", md: "45px" }}
            objectFit="contain"
          />
        </Flex>

        <Flex
          flex="1"
          direction={{ base: "column", md: "row" }}
        >
          {/* Left */}
          <Flex
            direction="column"
            justify="space-between"
            w={{ base: "100%", md: "50%" }}
            p={{ base: "24px", md: "40px", lg: "60px" }}
            borderRight={{ base: "none", md: "1px solid" }}
            borderBottom={{ base: "1px solid", md: "none" }}
            borderColor="#E4E4E7"
            gap={{ base: "32px", md: "0" }}
          >
            <Box>
              <Heading
                fontSize={{ base: "18px", md: "22px", lg: "28px" }}
                fontWeight={700}
                color="black"
                mb="16px"
              >
                Community Council Account Manager
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
                color="gray.600"
              >
                Select any languages you speak. Then indicate which of those you
                are literate in (can read and write).
              </Text>
            </Box>

            <Box>
              <Text
                fontWeight={700}
                fontSize={{ base: "16px", md: "18px", lg: "22px" }}
                color="black"
              >
                Need help?
              </Text>
              <Text
                fontWeight={700}
                fontSize={{ base: "16px", md: "18px", lg: "22px" }}
                color="black"
                mb="8px"
              >
                Visit our website
              </Text>
              <Link
                href="#"
                color="blue.500"
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
                textDecoration="underline"
              >
                Community Counsel Website
              </Link>
              <HStack
                gap={{ base: "12px", md: "16px" }}
                mt={{ base: "20px", md: "24px" }}
              >
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuFacebook size={20} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <FiLinkedin size={20} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <BsInstagram size={20} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuMail size={20} />
                </Box>
              </HStack>
            </Box>
          </Flex>

          {/* Right */}
          <Flex
            direction="column"
            justify="center"
            w={{ base: "100%", md: "50%" }}
            p={{ base: "24px", md: "40px", lg: "60px" }}
            gap={{ base: "16px", md: "18px" }}
          >
            <Progress.Root
              value={15}
              size="xs"
            >
              <Progress.Track>
                <Progress.Range bg="#4A90D9" />
              </Progress.Track>
            </Progress.Root>

            {errorMsg && (
              <Box
                border="1px solid"
                borderColor="red.200"
                bg="red.50"
                p="10px"
                borderRadius="8px"
              >
                <Text
                  color="red.700"
                  fontSize="14px"
                >
                  {errorMsg}
                </Text>
              </Box>
            )}

            <LanguageMultiSelect
              label="Select languages you speak"
              items={allLanguageNames}
              selected={selectedLanguageNames}
              onChange={setSelectedLanguageNames}
              disabled={isLoading}
              placeholder={isLoading ? "Loading..." : "Search tags"}
            />

            <LanguageMultiSelect
              label="Of the selected languages, which are you literate in?"
              items={selectedLanguageNames}
              selected={literateLanguageNames}
              onChange={setLiterateLanguageNames}
              disabled={selectedLanguageNames.length === 0}
              placeholder={
                selectedLanguageNames.length === 0
                  ? "Select languages above first"
                  : "Search tags"
              }
            />

            <Button
              bg="#4A90D9"
              color="white"
              h={{ base: "40px", md: "48px" }}
              borderRadius="8px"
              fontSize={{ base: "13px", md: "16px" }}
              fontWeight={600}
              _hover={{ bg: "#3a7bc8" }}
              justifyContent="space-between"
              px="20px"
              onClick={handleContinue}
              loading={isSubmitting}
            >
              Continue
              <LuArrowRight size={16} />
            </Button>
          </Flex>
        </Flex>

        <Box
          w="100%"
          h={{ base: "56px", md: "70px" }}
          bg="#E8E8E8"
          flexShrink={0}
        />
      </Flex>
    </LoginLayout>
  );
};

export default LanguageStep;
