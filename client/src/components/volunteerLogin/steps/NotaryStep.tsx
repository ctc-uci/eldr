import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Select,
  Flex,
  Heading,
  Progress,
  Text,
  useListCollection,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { LuArrowRight, LuChevronDown } from "react-icons/lu";

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
        </Flex>

        <Flex
          flex="1"
          direction={{ base: "column", md: "row" }}
        >
          {/* Left side */}
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
            <Box maxW="350px">
              <Heading
                fontSize={{ base: "17px", md: "22px", lg: "27px" }}
                fontWeight={700}
                color="black"
                mb="12px"
              >
                Volunteer Account Creation
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
                color="gray.600"
              >
                Please indicate whether or not you are an active notary.
              </Text>
            </Box>
          </Flex>

          {/* Right side */}
          <Flex
            direction="column"
            justify="flex-start"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="10%"
            gap={{ base: "16px", md: "18px" }}
            align="center"
          >
            <Progress.Root
              value={75}
              size="xs"
              w="30vw"
              minW="320px"
              maxW="460px"
              mb="24px"
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
                w="30vw"
                minW="320px"
                maxW="460px"
              >
                <Text
                  color="red.700"
                  fontSize="14px"
                >
                  {errorMsg}
                </Text>
              </Box>
            )}

            <Box w="30vw" minW="320px" maxW="460px">
              <Text
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight={600}
                color="black"
                mb="6px"
              >
                Notary Status
              </Text>

              <Box position="relative">
              <Select.Root
                collection={collection}
                value={selected ? [selected] : []}
                onValueChange={(e) => setSelected(e.value[0] || "")}
              >

                <Select.Trigger
                  h="44px"
                  border="1px solid"
                  borderColor="#E4E4E7"
                  borderRadius="6px"
                  bg="white"
                  fontSize="14px"
                  _hover={{ borderColor: "#CBD5E1" }}
                  _focus={{ borderColor: "#3182CE", boxShadow: "0 0 0 1px #3182CE" }}
                >
                  <Select.ValueText placeholder="Select status" />

                  <Box ml="auto" display="flex" alignItems="center">
                    <LuChevronDown size={16} color="#9CA3AF" />
                  </Box>
                </Select.Trigger>

                <Select.Content
                  bg="white"
                  border="1px solid #E4E4E7"
                  borderRadius="8px"
                  boxShadow="lg"
                  mt="6px"
                >
                  {collection.items.map((item) => (
                    <Select.Item
                      key={item}
                      item={item}
                      px="12px"
                      py="10px"
                      fontSize="14px"
                      _hover={{ bg: "gray.50" }}
                    >
                      {item === "Active Notary" ? "Active" : "Inactive"}
                    </Select.Item>
                  ))}
                </Select.Content>

              </Select.Root>
              </Box>
            </Box>

            <Button
              bg="white"
              borderColor="#E4E4E7"
              color="black"
              h={{ base: "40px", md: "48px" }}
              minW="320px"
              maxW="460px"
              borderRadius="8px"
              fontSize={{ base: "13px", md: "16px" }}
              fontWeight={600}
              _active={{ bg: "black", color: "white" }}
              _hover={{
                bg: "#F4F4F5", 
                _active: {
                  bg: "black", 
                  color: "white",
                },
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
