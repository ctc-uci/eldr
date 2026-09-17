import { Fragment, useEffect, useMemo, useRef, useState } from "react";
 
import {
  Box,
  Button,
  Flex,
  Heading,
  Progress,
  Text,
} from "@chakra-ui/react";
 
import { LuChevronDown } from "react-icons/lu";
import LoginLayout from "./BackgroundLayout";
import { loadDraft, saveDraft } from "../volunteerSignupDraft";
import { TopBackButton, StepNavButtons } from "../NavigationButtons";

type Props = {
  onNext: () => void;
  onBack?: () => void;
};
 
type Proficiency =
  | "Native/Bilingual"
  | "Professional"
  | "Limited Working"
  | "Elementary";

const PROFICIENCY_OPTIONS: Proficiency[] = [
  "Native/Bilingual",
  "Professional",
  "Limited Working",
  "Elementary",
];

const normalizeProficiencyValue = (p: unknown): Proficiency => {
  if (!p) return "Professional";
  const str = String(p).trim().toLowerCase();
  if (
    str === "native/bilingual" ||
    str === "native/fluent" ||
    str === "native" ||
    str === "fluent" ||
    str === "bilingual"
  ) {
    return "Native/Bilingual";
  }
  if (str === "professional") return "Professional";
  if (
    str === "limited working" ||
    str === "intermediate" ||
    str === "advanced"
  ) {
    return "Limited Working";
  }
  if (str === "elementary" || str === "proficient") {
    return "Elementary";
  }
  const match = PROFICIENCY_OPTIONS.find((opt) => opt.toLowerCase() === str);
  return match ?? "Professional";
};

const proficiencyLabel = (p: Proficiency) => p;

const ProficiencyDropdown = ({
  value,
  onChange,
}: {
  value: Proficiency;
  onChange: (val: Proficiency) => void;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);
 
  return (
    <Box position="relative" ref={containerRef} w="100%" minW={0}>
      <Flex
        align="center"
        justify="space-between"
        border="1px solid"
        borderColor={open ? "#3182CE" : "#E4E4E7"}
        borderRadius="6px"
        px="12px"
        h="44px"
        cursor="pointer"
        bg="white"
        userSelect="none"
        gap="8px"
        w="100%"
        minW={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        tabIndex={0}
      >
        <Text fontSize="14px" color="black" truncate>
          {proficiencyLabel(value)}
        </Text>
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
          position="absolute"
          top="calc(100% + 4px)"
          left={0}
          right={0}
          bg="white"
          border="1px solid"
          borderColor="#E4E4E7"
          borderRadius="6px"
          boxShadow="md"
          zIndex={9999}
          overflow="hidden"
        >
          {PROFICIENCY_OPTIONS.map((opt) => (
            <Flex
              key={opt}
              px="12px"
              py="10px"
              cursor="pointer"
              bg={opt === value ? "#D4D4D8" : "white"}
              _hover={{ bg: "#F4F4F5" }}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <Text fontSize="14px" color="black">
                {proficiencyLabel(opt)}
              </Text>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
};
 
const LanguageProficiencyStep = ({ onNext, onBack }: Props) => {
  const selectedLanguages = useMemo(
    () => loadDraft()?.selectedLanguageNames ?? [],
    []
  );

  const [verbalProficiencies, setVerbalProficiencies] = useState<
    Record<string, Proficiency>
  >(() => {
    const draft = loadDraft();
    const map: Record<string, Proficiency> = {};
    for (const lang of selectedLanguages) {
      const v =
        draft?.verbalProficiencies?.[lang] ??
        draft?.languageProficiencies?.[lang];
      map[lang] = normalizeProficiencyValue(v);
    }
    return map;
  });

  const [writtenProficiencies, setWrittenProficiencies] = useState<
    Record<string, Proficiency>
  >(() => {
    const draft = loadDraft();
    const map: Record<string, Proficiency> = {};
    for (const lang of selectedLanguages) {
      const w =
        draft?.writtenProficiencies?.[lang] ??
        draft?.languageProficiencies?.[lang];
      map[lang] = normalizeProficiencyValue(w);
    }
    return map;
  });
 
  useEffect(() => {
    setVerbalProficiencies((prev) => {
      const next: Record<string, Proficiency> = {};
      for (const lang of selectedLanguages) {
        next[lang] = prev[lang] ?? "Professional";
      }
      return next;
    });
    setWrittenProficiencies((prev) => {
      const next: Record<string, Proficiency> = {};
      for (const lang of selectedLanguages) {
        next[lang] = prev[lang] ?? "Professional";
      }
      return next;
    });
  }, [selectedLanguages]);
 
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleContinue = () => {
    setErrorMsg(null);

    if (selectedLanguages.length === 0) {
      onNext();
      return;
    }

    const draft = loadDraft();
    const literateNames = draft?.literateLanguageNames ?? [];

    saveDraft({
      verbalProficiencies,
      writtenProficiencies,
      languageProficiencies: verbalProficiencies,
      literateLanguageNames: literateNames,
    });
    onNext();
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
        {/* Top bar */}
        <Flex
          w="100%"
          h="70px"
          bg="#F6F6F6"
          flexShrink={0}
          align="center"
          px={{ base: "16px", md: "24px" }}
        >
          <TopBackButton onClick={onBack} />
        </Flex>
 
        <Flex flex="1" direction={{ base: "column", md: "row" }}>
          {/* Left */}
          <Flex
            direction="column"
            justify="flex-start"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="8%"
            borderRight={{ base: "none", md: "1px solid #E4E4E7" }}
            borderBottom={{ base: "1px solid #E4E4E7", md: "none" }}
            borderColor="#E4E4E7"
            gap={{ base: "32px", md: "0" }}
          >
            <Box maxW="400px">
              <Heading
                fontSize={{ base: "17px", md: "22px", lg: "27px" }}
                fontWeight={700}
                color="black"
                mb="12px"
              >
                Volunteer Account Creation
              </Heading>
              <Text fontSize={{ base: "14px", md: "16px", lg: "20px" }} color="black">
                Indicate your verbal and written proficiency levels for each language selected.
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
            <Progress.Root value={35} size="xs">
              <Progress.Track>
                <Progress.Range bg="#0088FF" />
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
                <Text color="red.700" fontSize="14px">
                  {errorMsg}
                </Text>
              </Box>
            )}

            {/* Language proficiency grid */}
            {selectedLanguages.length === 0 ? (
              <Text fontSize="14px" color="gray.400">
                No languages selected. Go back to select languages first.
              </Text>
            ) : (
              <Box
                display="grid"
                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                columnGap="10px"
                rowGap="10px"
                w="100%"
                alignItems="center"
              >
                {/* Column headers aligned with inputs below */}
                <Text
                  fontSize="12px"
                  fontWeight="semibold"
                  color="#71717A"
                  textAlign="left"
                >
                  Language
                </Text>
                <Text
                  fontSize="12px"
                  fontWeight="semibold"
                  color="#71717A"
                  textAlign="left"
                >
                  Verbal Proficiency
                </Text>
                <Text
                  fontSize="12px"
                  fontWeight="semibold"
                  color="#71717A"
                  textAlign="left"
                >
                  Written Proficiency
                </Text>

                {/* Rows sharing the exact same 3 grid tracks */}
                {selectedLanguages.map((lang) => (
                  <Fragment key={lang}>
                    {/* Language box */}
                    <Flex
                      align="center"
                      px="14px"
                      h="44px"
                      border="1px solid"
                      borderColor="#E4E4E7"
                      borderRadius="6px"
                      bg="#FAFAFA"
                      overflow="hidden"
                      minW={0}
                      w="100%"
                    >
                      <Text
                        fontSize={{ base: "13px", md: "14px" }}
                        fontWeight="medium"
                        color="#27272A"
                        truncate
                      >
                        {lang}
                      </Text>
                    </Flex>

                    {/* Verbal Proficiency dropdown */}
                    <Box minW={0} w="100%">
                      <ProficiencyDropdown
                        value={verbalProficiencies[lang] ?? "Professional"}
                        onChange={(val) =>
                          setVerbalProficiencies((prev) => ({
                            ...prev,
                            [lang]: val,
                          }))
                        }
                      />
                    </Box>

                    {/* Written Proficiency dropdown */}
                    <Box minW={0} w="100%">
                      <ProficiencyDropdown
                        value={writtenProficiencies[lang] ?? "Professional"}
                        onChange={(val) =>
                          setWrittenProficiencies((prev) => ({
                            ...prev,
                            [lang]: val,
                          }))
                        }
                      />
                    </Box>
                  </Fragment>
                ))}
              </Box>
            )}

            <StepNavButtons onBack={onBack} onContinue={handleContinue} />

          </Flex>
        </Flex>
 
        <Box w="100%" h="70px" bg="#F6F6F6" flexShrink={0} />
      </Flex>
    </LoginLayout>
  );
};
 
export default LanguageProficiencyStep;