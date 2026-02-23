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
  onBack: () => void;
  volunteerId?: number; // pass from CreateAccountStep; fallback to localStorage if missing
};

type Area = {
  id: number;
  areasOfInterest?: string; // keysToCamel output
  areas_of_interest?: string; // just in case
};

const LawMultiSelect = ({
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

  const toggle = (area: string) => {
    onChange(
      selected.includes(area)
        ? selected.filter((s) => s !== area)
        : [...selected, area]
    );
  };

  const remove = (area: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== area));
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
            {selected.map((area) => (
              <Flex
                key={area}
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
                {area}
                <Box
                  as="span"
                  onClick={(e: React.MouseEvent) => remove(area, e)}
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
            filtered.map((area) => (
              <Flex
                key={area}
                align="center"
                px="12px"
                py="10px"
                cursor="pointer"
                _hover={{ bg: "gray.50" }}
                onClick={() => toggle(area)}
                gap="10px"
              >
                <Checkbox.Root
                  checked={selected.includes(area)}
                  colorPalette="blue"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => toggle(area)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control
                    borderColor={selected.includes(area) ? "black" : "#D1D5DB"}
                    bg={selected.includes(area) ? "black" : "white"}
                  >
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                </Checkbox.Root>
                <Text
                  fontSize={{ base: "13px", md: "14px" }}
                  color="black"
                >
                  {area}
                </Text>
              </Flex>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

const LawInterestStep = ({ onNext, onBack, volunteerId }: Props) => {
  const { backend } = useBackendContext();

  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedAreaLabels, setSelectedAreaLabels] = useState<string[]>([]);

  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        setErrorMsg(
          typeof msg === "string" ? msg : "Failed to load areas of interest."
        );
      } finally {
        setIsLoadingAreas(false);
      }
    };

    run();
  }, [backend]);

  const areaItems = useMemo(() => {
    // Convert objects -> strings for list
    return areas
      .map((a) => ({
        id: a.id,
        label: a.areasOfInterest ?? a.areas_of_interest ?? String(a.id),
      }))
      .filter((x) => x.label);
  }, [areas]);

  const areaLabels = useMemo(() => areaItems.map((x) => x.label), [areaItems]);

  const labelToId = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of areaItems) map.set(item.label, item.id);
    return map;
  }, [areaItems]);

  const handleContinue = async () => {
    setErrorMsg(null);

    if (!effectiveVolunteerId) {
      setErrorMsg(
        "Missing volunteer id. Please go back and create your account again."
      );
      return;
    }

    const uniqueIds = Array.from(
      new Set(
        selectedAreaLabels
          .map((label) => labelToId.get(label))
          .filter((id): id is number => typeof id === "number" && id > 0)
      )
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
          backend.post(
            `/volunteers/${effectiveVolunteerId}/areas-of-practice`,
            {
              areaOfInterestId: areaId,
            }
          )
        )
      );

      onNext();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Failed to save areas of interest.";
      setErrorMsg(
        typeof msg === "string" ? msg : "Failed to save areas of interest."
      );
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
        overflow="hidden"
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
          {/* Left side */}
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
                Community Counsel Account Manager
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
                color="gray.600"
              >
                Select any areas of law you have interest or experience working
                in. It is recommended to only specify areas you're comfortable
                advising in.
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

          {/* Right side */}
          <Flex
            direction="column"
            w={{ base: "100%", md: "50%" }}
            p={{ base: "24px", md: "40px", lg: "60px" }}
            gap={{ base: "16px", md: "18px" }}
            justify="center"
          >
            <Progress.Root
              value={50}
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

            <LawMultiSelect
              label="If any, select areas of law you are interested working in."
              items={areaLabels}
              selected={selectedAreaLabels}
              onChange={setSelectedAreaLabels}
              disabled={isLoadingAreas}
              placeholder={isLoadingAreas ? "Loading..." : "Search tags"}
            />

            <HStack
              gap="8px"
              w="100%"
              flexWrap="wrap"
            >
              <Button
                bg="#F3F4F6"
                color="black"
                h={{ base: "40px", md: "48px" }}
                flex={{ base: "1 1 100%", sm: "1 1 auto" }}
                borderRadius="8px"
                fontSize={{ base: "13px", md: "16px" }}
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
                h={{ base: "40px", md: "48px" }}
                flex={{ base: "1 1 100%", sm: "0 0 auto" }}
                onClick={onBack}
              >
                Back
              </Button>
            </HStack>
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

export default LawInterestStep;
