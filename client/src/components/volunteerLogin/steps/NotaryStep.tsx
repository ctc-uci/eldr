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
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuArrowRight, LuFacebook, LuMail } from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
  volunteerId?: number;
};

const NOTARY_STATUSES = ["Active Notary", "Non-Active (Not a Notary)"];

const NotaryStep = ({ onNext, volunteerId }: Props) => {
  const { backend } = useBackendContext();

  const [selected, setSelected] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      setErrorMsg(
        "Missing volunteer id. Please go back and create your account again."
      );
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
      setErrorMsg(
        typeof msg === "string" ? msg : "Failed to save notary status."
      );
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
        <Flex
          w="100%"
          h="70px"
          bg="#F6F6F6"
          flexShrink={0}
          align="center"
          px="2%"
          py="1%"
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
            px="5%"
            py="10%"
            borderRight={{ base: "none", md: "1px solid #E4E4E7" }}
            borderBottom={{ base: "1px solid #E4E4E7", md: "none" }}
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
                Please indicate whether or not you are an active notary.
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
                href="https://eldrcenter.org/"
                color="#3182CE"
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
                textDecoration="underline"
              >
                Community Counsel Website
              </Link>
              <HStack
                gap={{ base: "12px", md: "16px" }}
                mt={{ base: "20px", md: "24px" }}
              >
                <Link
                  href="https://www.facebook.com/ELDRCenter/photos/"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuFacebook size={20} />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/elderlawanddisabilityrightscenter/"
                  color="gray.600"
                  cursor="pointer"
                >
                  <FiLinkedin size={20} />
                </Link>
                <Link
                  href="https://www.instagram.com/eldr_center/?hl=en"
                  color="gray.600"
                  cursor="pointer"
                >
                  <BsInstagram size={20} />
                </Link>
                <Link
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuMail size={20} />
                </Link>
              </HStack>
            </Box>
          </Flex>

          {/* Right side */}
          <Flex
            direction="column"
            justify="center"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="10%"
            gap={{ base: "16px", md: "18px" }}
          >
            <Progress.Root
              value={75}
              size="xs"
            >
              <Progress.Track>
                <Progress.Range bg="#3182CE" />
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

            <Box>
              <Text
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight={600}
                color="black"
                mb="6px"
              >
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
                      <Combobox.Item
                        key={item}
                        item={item}
                      >
                        <Combobox.ItemText>{item}</Combobox.ItemText>
                      </Combobox.Item>
                    ))}
                  </Combobox.Content>
                </Combobox.Positioner>
              </Combobox.Root>
            </Box>

            <Button
              bg="#3182CE"
              color="white"
              h={{ base: "40px", md: "48px" }}
              w="100%"
              borderRadius="8px"
              fontSize={{ base: "13px", md: "16px" }}
              fontWeight={600}
              _hover={{ bg: "#5797BD" }}
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
          h="70px"
          bg="#F6F6F6"
          flexShrink={0}
        />
      </Flex>
    </LoginLayout>
  );
};

export default NotaryStep;
