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
  useListCollection,
  useBreakpointValue,
} from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuArrowRight, LuFacebook, LuMail, LuPlus } from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

type Props = {
  onNext: () => void;
  onBack: () => void;
  volunteerId?: number; // <-- pass from CreateAccountStep; fallback to localStorage if missing
};

const BAR_HEIGHT = { base: "56px", md: "70px" };
const BAR_BG = "#E8E8E8";

type Area = {
  id: number;
  areasOfInterest?: string; // keysToCamel output
  areas_of_interest?: string; // just in case
};

const LawInterestStep = ({ onNext, onBack, volunteerId }: Props) => {
  const { backend } = useBackendContext();

  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedAreaIds, setSelectedAreaIds] = useState<(number | null)[]>([null]);

  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const leftPad = useBreakpointValue({ base: "24px", md: "60px" });
  const rightPad = useBreakpointValue({ base: "24px", md: "60px" });

  const effectiveVolunteerId =
    volunteerId ?? Number(localStorage.getItem("volunteerId") || 0);

  // Fetch dropdown options from GET /areas-of-interest
  useEffect(() => {
    const run = async () => {
      setErrorMsg(null);
      setIsLoadingAreas(true);
      try {
        const resp = await backend.get("/areas-of-interest");
        const data: Area[] = resp?.data || [];
        setAreas(Array.isArray(data) ? data : []);
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Failed to load areas of interest.";
        setErrorMsg(typeof msg === "string" ? msg : "Failed to load areas of interest.");
      } finally {
        setIsLoadingAreas(false);
      }
    };

    run();
  }, [backend]);

  const areaItems = useMemo(() => {
    // Convert objects -> strings for combobox list
    return areas
      .map((a) => ({
        id: a.id,
        label: a.areasOfInterest ?? a.areas_of_interest ?? String(a.id),
      }))
      .filter((x) => x.label);
  }, [areas]);

  const collection = useListCollection({
    initialItems: areaItems.map((x) => x.label),
    filter: (item, inputValue) =>
      item.toLowerCase().includes(inputValue.toLowerCase()),
  });

  const labelToId = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of areaItems) map.set(item.label, item.id);
    return map;
  }, [areaItems]);

  const handleAddInterest = () => {
    setSelectedAreaIds((prev) => [...prev, null]);
  };

  const setSelectionAtIndex = (index: number, label: string) => {
    const id = labelToId.get(label) ?? null;
    setSelectedAreaIds((prev) => {
      const copy = [...prev];
      copy[index] = id;
      return copy;
    });
  };

  const handleContinue = async () => {
    setErrorMsg(null);

    if (!effectiveVolunteerId) {
      setErrorMsg("Missing volunteer id. Please go back and create your account again.");
      return;
    }

    const uniqueIds = Array.from(
      new Set(selectedAreaIds.filter((x): x is number => typeof x === "number" && x > 0))
    );

    // If they didn't select anything, just move on
    if (uniqueIds.length === 0) {
      onNext();
      return;
    }

    setIsSubmitting(true);
    try {
      // POST each selected area to join table endpoint
      await Promise.all(
        uniqueIds.map((areaId) =>
          backend.post(`/volunteers/${effectiveVolunteerId}/areas-of-practice`, {
            areaOfInterestId: areaId,
          })
        )
      );

      onNext();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Failed to save areas of interest.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to save areas of interest.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginLayout>
      <Flex w="full" minH="100vh" align="center" justify="center" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
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
            {/* Left side */}
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
                  Community Counsel Account Manager
                </Heading>
                <Text fontSize={{ base: "15px", md: "20px" }} color="gray.600">
                  Select any areas of law you have interest or experience working in. It is recommended to only specify
                  areas you're comfortable advising in.
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

            {/* Right side */}
            <Flex
              direction="column"
              w={{ base: "100%", md: "50%" }}
              p={rightPad}
              gap="16px"
              justify="center"
            >
              <Progress.Root value={50} size="xs">
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

              <Flex direction="column" gap="12px" opacity={isLoadingAreas ? 0.7 : 1}>
                {selectedAreaIds.map((_, index) => (
                  <InterestCombobox
                    key={index}
                    collection={collection.collection}
                    filter={collection.filter}
                    isDisabled={isLoadingAreas || areaItems.length === 0}
                    onSelect={(label) => setSelectionAtIndex(index, label)}
                  />
                ))}

                <HStack gap="8px" w="100%" mt="4px" flexWrap="wrap">
                  <Button
                    bg="#4A90D9"
                    color="white"
                    h="48px"
                    flex={{ base: "1 1 100%", sm: "1 1 auto" }}
                    borderRadius="8px"
                    fontSize="16px"
                    fontWeight={600}
                    _hover={{ bg: "#3a7bc8" }}
                    justifyContent="space-between"
                    px="20px"
                    onClick={handleAddInterest}
                    isDisabled={isLoadingAreas}
                  >
                    Add interest
                    <LuPlus size={16} />
                  </Button>

                  <Button
                    bg="#F3F4F6"
                    color="black"
                    h="48px"
                    flex={{ base: "1 1 100%", sm: "1 1 auto" }}
                    borderRadius="8px"
                    fontSize="16px"
                    fontWeight={600}
                    _hover={{ bg: "#E5E7EB" }}
                    justifyContent="space-between"
                    px="20px"
                    onClick={handleContinue}
                    loading={isSubmitting}
                  >
                    Continue
                    <LuArrowRight size={16} />
                  </Button>

                  <Button
                    variant="ghost"
                    h="48px"
                    flex={{ base: "1 1 100%", sm: "0 0 auto" }}
                    onClick={onBack}
                  >
                    Back
                  </Button>
                </HStack>
              </Flex>
            </Flex>
          </Flex>

          <Box w="100%" h={BAR_HEIGHT} bg={BAR_BG} flexShrink={0} />
        </Flex>
      </Flex>
    </LoginLayout>
  );
};

const InterestCombobox = ({
  collection,
  filter,
  onSelect,
  isDisabled,
}: {
  collection: any;
  filter: (inputValue: string) => void;
  onSelect: (label: string) => void;
  isDisabled?: boolean;
}) => {
  return (
    <Box>
      <Text fontSize="14px" fontWeight={600} color="black" mb="6px">
        If any, select an area of law you are interested in.
      </Text>
      <Combobox.Root
        collection={collection}
        onInputValueChange={({ inputValue }: { inputValue: string }) => filter(inputValue)}
        css={{ "--focus-color": "colors.gray.200" }}
        openOnClick
        onValueChange={({ value }: { value: string[] }) => {
          // Chakra Combobox gives an array; we only care about first selection
          if (value?.[0]) onSelect(value[0]);
        }}
        disabled={isDisabled}
      >
        <Combobox.Control>
          <Combobox.Input placeholder={isDisabled ? "Loading..." : "Type to search"} />
          <Combobox.Trigger />
        </Combobox.Control>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No results found</Combobox.Empty>
            {collection.items.map((item: string) => (
              <Combobox.Item key={item} item={item}>
                <Combobox.ItemText>{item}</Combobox.ItemText>
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox.Root>
    </Box>
  );
};

export default LawInterestStep;