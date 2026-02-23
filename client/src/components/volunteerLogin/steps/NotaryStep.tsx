import { useMemo, useState } from "react";
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
import { LuArrowRight, LuFacebook, LuMail } from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

type Props = {
  onNext: () => void;
  volunteerId?: number;
};

const BAR_HEIGHT = { base: "56px", md: "70px" };
const BAR_BG = "#E8E8E8";

const NOTARY_STATUSES = ["Active Notary", "Non-Active (Not a Notary)"];

const NotaryStep = ({ onNext, volunteerId }: Props) => {
  const { backend } = useBackendContext();

  const [selected, setSelected] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const leftPad = useBreakpointValue({ base: "24px", md: "60px" });
  const rightPad = useBreakpointValue({ base: "24px", md: "60px" });

  const effectiveVolunteerId =
    volunteerId ?? Number(localStorage.getItem("volunteerId") || 0);

  const { collection, filter } = useListCollection({
    initialItems: NOTARY_STATUSES,
    filter: (item, inputValue) =>
      item.toLowerCase().includes(inputValue.toLowerCase()),
  });

  const isNotary = useMemo(() => selected === "Active Notary", [selected]);

  const handleContinue = async () => {
    setErrorMsg(null);

    if (!effectiveVolunteerId) {
      setErrorMsg("Missing volunteer id. Please go back and create your account again.");
      return;
    }

    if (!selected) {
      // If they skip selection, just move forward (or you can require it)
      onNext();
      return;
    }

    setIsSubmitting(true);
    try {
      // Update volunteer record. (Your volunteersRouter uses PUT /volunteers/:id)
      await backend.put(`/volunteers/${effectiveVolunteerId}`, {
        is_notary: isNotary,
      });

      onNext();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Failed to save notary status.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to save notary status.");
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
                  Please indicate whether or not you are an active notary.
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
              justify="center"
              w={{ base: "100%", md: "50%" }}
              p={rightPad}
              gap="16px"
            >
              <Progress.Root value={75} size="xs">
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

              <Box>
                <Text fontSize="14px" fontWeight={600} color="black" mb="6px">
                  What is your notary status?
                </Text>
                <Combobox.Root
                  collection={collection}
                  onInputValueChange={({ inputValue }) => filter(inputValue)}
                  css={{ "--focus-color": "colors.gray.200" }}
                  openOnClick
                  onValueChange={({ value }: { value: string[] }) => {
                    if (value?.[0]) setSelected(value[0]);
                  }}
                >
                  <Combobox.Control>
                    <Combobox.Input placeholder="Type to search" />
                    <Combobox.Trigger />
                  </Combobox.Control>
                  <Combobox.Positioner>
                    <Combobox.Content>
                      <Combobox.Empty>No results found</Combobox.Empty>
                      {collection.items.map((item) => (
                        <Combobox.Item key={item} item={item}>
                          <Combobox.ItemText>{item}</Combobox.ItemText>
                        </Combobox.Item>
                      ))}
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Combobox.Root>
              </Box>

              <Button
                bg="#4A90D9"
                color="white"
                h="48px"
                w="100%"
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

export default NotaryStep;