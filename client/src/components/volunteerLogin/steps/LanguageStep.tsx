import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Combobox,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Progress,
  Text,
  useBreakpointValue,
  useListCollection,
} from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuArrowRight, LuFacebook, LuMail } from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

type Props = {
  onNext: () => void;
  volunteerId?: number;
};

type LanguageRow = {
  id: number;
  language: string;
};

const BAR_HEIGHT = { base: "56px", md: "70px" };
const BAR_BG = "#E8E8E8";

const LanguageStep = ({ onNext, volunteerId }: Props) => {
  const { backend } = useBackendContext();

  const [allLanguages, setAllLanguages] = useState<LanguageRow[]>([]);
  const [selectedLanguageNames, setSelectedLanguageNames] = useState<string[]>([]);
  const [literateLanguageNames, setLiterateLanguageNames] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const leftPad = useBreakpointValue({ base: "24px", md: "60px" });
  const rightPad = useBreakpointValue({ base: "24px", md: "60px" });

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
        setErrorMsg(typeof msg === "string" ? msg : "Failed to load languages.");
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
    setLiterateLanguageNames((prev) => prev.filter((x) => selectedLanguageNames.includes(x)));
  }, [selectedLanguageNames]);

  const allCollection = useListCollection({
    initialItems: allLanguageNames,
    filter: (item, inputValue) => item.toLowerCase().includes(inputValue.toLowerCase()),
  });

  const selectedCollection = useListCollection({
    initialItems: selectedLanguageNames,
    filter: (item, inputValue) => item.toLowerCase().includes(inputValue.toLowerCase()),
  });

  // Keep collections updated when items change
  useEffect(() => {
    allCollection.setItems(allLanguageNames);
  }, [allLanguageNames]); 

  useEffect(() => {
    selectedCollection.setItems(selectedLanguageNames);
  }, [selectedLanguageNames]);

  const handleContinue = async () => {
    setErrorMsg(null);

    if (!effectiveVolunteerId) {
      setErrorMsg("Missing volunteer id. Please go back and create your account again.");
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
      await backend.post(`/volunteers/${effectiveVolunteerId}/languages`, payload);
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
        w="full"
        minH="100vh"
        align="center"
        justify="center"
        px={{ base: 4, md: 8 }}
        py={{ base: 6, md: 10 }}
      >
        <Flex
          w="full"
          maxW="6xl"
          bg="#FFFFFF"
          borderRadius={{ base: "12px", md: "10px" }}
          border="1px solid"
          borderColor="#E4E4E7"
          overflow="hidden"
          direction="column"
        >
          {/* Top bar */}
          <Flex w="100%" h={BAR_HEIGHT} bg={BAR_BG} flexShrink={0} align="center" px={{ base: 4, md: 6 }}>
            <Image src={logo} alt="ELDR Logo" h={{ base: "34px", md: "45px" }} objectFit="contain" />
          </Flex>

          <Flex flex="1" direction={{ base: "column", md: "row" }}>
            {/* Left */}
            <Flex
              direction="column"
              justify="space-between"
              w={{ base: "100%", md: "50%" }}
              p={leftPad}
              borderRight={{ base: "none", md: "1px solid" }}
              borderBottom={{ base: "1px solid", md: "none" }}
              borderColor="#E4E4E7"
              gap={{ base: 10, md: 0 }}
            >
              <Box>
                <Heading fontSize={{ base: "22px", md: "28px" }} fontWeight={700} color="black" mb="16px">
                  Community Council Account Manager
                </Heading>
                <Text fontSize={{ base: "15px", md: "20px" }} color="gray.600">
                  Select any languages you speak. Then indicate which of those you are literate in (can read and write).
                </Text>
              </Box>

              <Box>
                <Text fontWeight={700} fontSize={{ base: "16px", md: "22px" }} color="black">
                  Need help?
                </Text>
                <Text fontWeight={700} fontSize={{ base: "16px", md: "22px" }} color="black" mb="8px">
                  Visit our website
                </Text>
                <Link href="#" color="blue.500" fontSize={{ base: "14px", md: "20px" }} textDecoration="underline">
                  Community Counsel Website
                </Link>

                <HStack gap="16px" mt="24px">
                  <Box as="a" href="#" color="gray.600" cursor="pointer">
                    <LuFacebook size={22} />
                  </Box>
                  <Box as="a" href="#" color="gray.600" cursor="pointer">
                    <FiLinkedin size={22} />
                  </Box>
                  <Box as="a" href="#" color="gray.600" cursor="pointer">
                    <BsInstagram size={22} />
                  </Box>
                  <Box as="a" href="#" color="gray.600" cursor="pointer">
                    <LuMail size={22} />
                  </Box>
                </HStack>
              </Box>
            </Flex>

            {/* Right */}
            <Flex direction="column" justify="center" w={{ base: "100%", md: "50%" }} p={rightPad} gap="18px">
              <Progress.Root value={15} size="xs">
                <Progress.Track>
                  <Progress.Range bg="#4A90D9" />
                </Progress.Track>
              </Progress.Root>

              {errorMsg && (
                <Box border="1px solid" borderColor="red.200" bg="red.50" p="10px" borderRadius="8px">
                  <Text color="red.700" fontSize="14px">
                    {errorMsg}
                  </Text>
                </Box>
              )}

              <Box opacity={isLoading ? 0.7 : 1}>
                <Text fontSize="14px" fontWeight={600} color="black" mb="6px">
                  Select languages you speak
                </Text>

                <Combobox.Root
                  collection={allCollection.collection}
                  multiple
                  openOnClick
                  disabled={isLoading || allLanguageNames.length === 0}
                  onInputValueChange={({ inputValue }) => allCollection.filter(inputValue)}
                  onValueChange={({ value }: { value: string[] }) => setSelectedLanguageNames(value)}
                >
                  <Combobox.Control>
                    <Combobox.Input placeholder={isLoading ? "Loading..." : "Type to search"} />
                    <Combobox.Trigger />
                  </Combobox.Control>

                  <Combobox.Positioner>
                    <Combobox.Content>
                      <Combobox.Empty>No results found</Combobox.Empty>
                      {allCollection.collection.items.map((item: string) => (
                        <Combobox.Item key={item} item={item}>
                          <Combobox.ItemText>{item}</Combobox.ItemText>
                        </Combobox.Item>
                      ))}
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Combobox.Root>

                {selectedLanguageNames.length > 0 && (
                  <Text fontSize="13px" color="gray.600" mt="8px">
                    Selected: {selectedLanguageNames.join(", ")}
                  </Text>
                )}
              </Box>

              <Box>
                <Text fontSize="14px" fontWeight={600} color="black" mb="6px">
                  Of the selected languages, which are you literate in?
                </Text>

                <Combobox.Root
                  collection={selectedCollection.collection}
                  multiple
                  openOnClick
                  disabled={selectedLanguageNames.length === 0}
                  onInputValueChange={({ inputValue }) => selectedCollection.filter(inputValue)}
                  onValueChange={({ value }: { value: string[] }) => setLiterateLanguageNames(value)}
                >
                  <Combobox.Control>
                    <Combobox.Input
                      placeholder={selectedLanguageNames.length === 0 ? "Select languages above first" : "Type to search"}
                    />
                    <Combobox.Trigger />
                  </Combobox.Control>

                  <Combobox.Positioner>
                    <Combobox.Content>
                      <Combobox.Empty>No results found</Combobox.Empty>
                      {selectedCollection.collection.items.map((item: string) => (
                        <Combobox.Item key={item} item={item}>
                          <Combobox.ItemText>{item}</Combobox.ItemText>
                        </Combobox.Item>
                      ))}
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Combobox.Root>

                {literateLanguageNames.length > 0 && (
                  <Text fontSize="13px" color="gray.600" mt="8px">
                    Literate in: {literateLanguageNames.join(", ")}
                  </Text>
                )}
              </Box>

              <Button
                bg="#4A90D9"
                color="white"
                h="48px"
                borderRadius="8px"
                fontSize="16px"
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

          <Box w="100%" h={BAR_HEIGHT} bg={BAR_BG} flexShrink={0} />
        </Flex>
      </Flex>
    </LoginLayout>
  );
};

export default LanguageStep;