import { useEffect, useRef, useState } from "react";
 
import {
  Box,
  Button,
  Flex,
  Heading,
  Progress,
  Text,
} from "@chakra-ui/react";
 
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
 
import { LuArrowRight, LuChevronDown } from "react-icons/lu";
 
import LoginLayout from "./BackgroundLayout";
 
type Props = {
  onNext: () => void;
  volunteerId?: number;
  selectedLanguages?: string[];
};
 
type Proficiency = "Professional" | "Fluent" | "Conversational";
 
const PROFICIENCY_OPTIONS: Proficiency[] = [
  "Professional",
  "Fluent",
  "Conversational",
];
 
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
    <Box position="relative" ref={containerRef}>
      <Flex
        align="center"
        justify="space-between"
        border="1px solid"
        borderColor={open ? "#3182CE" : "#E4E4E7"}
        borderRadius="6px"
        px="14px"
        h="44px"
        cursor="pointer"
        bg="white"
        userSelect="none"
        gap="10px"
        minW="180px"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        tabIndex={0}
      >
        <Text fontSize="14px" color="black">
          {value}
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
              px="14px"
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
                {opt}
              </Text>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
};
 
const LanguageProficiencyStep = ({
  onNext,
  volunteerId,
  selectedLanguages = [],
}: Props) => {
  const { backend } = useBackendContext();
 
  const [proficiencies, setProficiencies] = useState<Record<string, Proficiency>>(
    () => Object.fromEntries(selectedLanguages.map((lang) => [lang, "Professional"]))
  );
 
  useEffect(() => {
    setProficiencies((prev) => {
      const next: Record<string, Proficiency> = {};
      for (const lang of selectedLanguages) {
        next[lang] = prev[lang] ?? "Professional";
      }
      return next;
    });
  }, [selectedLanguages]);
 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
 
  const effectiveVolunteerId =
    volunteerId ?? Number(localStorage.getItem("volunteerId") || 0);
 
  const handleContinue = async () => {
    setErrorMsg(null);
 
    if (!effectiveVolunteerId) {
      setErrorMsg("Missing volunteer id. Please go back and create your account again.");
      return;
    }
 
    if (selectedLanguages.length === 0) {
      onNext();
      return;
    }
 
    const payload = {
      languages: selectedLanguages.map((lang) => ({
        language: lang,
        proficiency: proficiencies[lang] ?? "Professional",
      })),
    };
 
    setIsSubmitting(true);
    try {
      await backend.post(`/volunteers/${effectiveVolunteerId}/language-proficiency`, payload);
      onNext();
    } catch (e: unknown) {
      const err = e as {
        response?: { status?: number; data?: { message?: string } | string };
        message?: string;
      };

      // Backend route doesn't exist yet — just continue flow
      if (err?.response?.status === 404) {
        onNext();
        return;
      }

      const msg =
        (typeof err?.response?.data === "object"
          ? err.response?.data?.message
          : undefined) ||
        (typeof err?.response?.data === "string" ? err.response.data : undefined) ||
        err?.message ||
        "Failed to save proficiency.";

      setErrorMsg(typeof msg === "string" ? msg : "Failed to save proficiency.");
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
        {/* Top bar */}
        <Flex w="100%" h="70px" bg="#F6F6F6" flexShrink={0} align="center" px="2%" py="1%" />
 
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
                Indicate your level of proficiency for each language selected.
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

            {/* Language proficiency rows */}
            <Flex direction="column" gap="8px">
                {selectedLanguages.length === 0 ? (
                <Text fontSize="14px" color="gray.400">
                    No languages selected. Go back to select languages first.
                </Text>
                ) : (
                selectedLanguages.map((lang) => (
                    <Flex key={lang} align="center" gap="12px" w="100%" h="44px">
                    {/* Language box (50%) */}
                    <Flex
                        align="center"
                        w="50%"
                        px="14px"
                        h="100%"
                        border="1px solid"
                        borderColor="#E4E4E7"
                        borderRadius="6px"
                        overflow="hidden"
                    >
                        <Text
                        fontSize={{ base: "13px", md: "14px" }}
                        color="#52525B"
                        truncate
                        >
                        {lang}
                        </Text>
                    </Flex>

                    {/* Proficiency dropdown (50%) */}
                    <Box w="50%">
                        <ProficiencyDropdown
                        value={proficiencies[lang] ?? "Professional"}
                        onChange={(val) =>
                            setProficiencies((prev) => ({
                            ...prev,
                            [lang]: val,
                            }))
                        }
                        />
                    </Box>
                    </Flex>
                ))
                )}
            </Flex>

            <Button
                bg="white"
                borderColor="#E4E4E7"
                color="black"
                h={{ base: "40px", md: "48px" }}
                borderRadius="8px"
                fontSize={{ base: "13px", md: "16px" }}
                fontWeight={600}
                _active={{ bg: "black", color: "white" }}
                _hover={{
                bg: "#F4F4F5",
                _active: { bg: "black", color: "white" },
                }}
                position="relative"
                w="100%"
                px="20px"
                onClick={handleContinue}
                loading={isSubmitting}
            >
                <Box w="100%" textAlign="center">
                Continue
                </Box>
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
 
export default LanguageProficiencyStep;