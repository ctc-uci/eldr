import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Progress,
  Text
} from "@chakra-ui/react";

import { useState } from "react";

import { LuArrowRight } from "react-icons/lu";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
};

const BackgroundStep = ({ onNext }: Props) => {
  const { backend } = useBackendContext();
  const [gradYear, setGradYear] = useState("");
  const [gradError, setGradError] = useState(false);
  const [employer, setEmployer] = useState("");
  const [employerError, setEmployerError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const isValidYear = /^\d{4}$/.test(gradYear);
  
    if (!isValidYear) {
      setGradError(true);
      setGradYear("");
      return;
    }

    if (!employer.trim()) {
      setEmployerError(true);
      return;
    }
  
    setGradError(false);
    setEmployerError(false);

    const effectiveVolunteerId = Number(localStorage.getItem("volunteerId") || 0);
    if (!effectiveVolunteerId) {
      // nothing to persist yet; keep flow moving
      onNext();
      return;
    }

    setIsSubmitting(true);
    try {
      await backend.put(`/volunteers/${effectiveVolunteerId}`, {
        law_school_year: gradYear.trim(),
        affiliated_employer: employer.trim(),
      });
      onNext();
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
          <Flex
            direction="column"
            justify="space-between"
            w={{ base: "100%", md: "50%" }}
            mt="2%"
            px="5%"
            py="8%"
            borderRight={{ base: "none", md: "1px solid #E4E4E7" }}
            borderBottom={{ base: "1px solid #E4E4E7", md: "none" }}
            borderColor="#E4E4E7"
            gap={{ base: "32px", md: "0" }}
          >
            <Box>
              <Heading
                fontSize={{ base: "17px", md: "22px", lg: "27px" }}
                fontWeight={700}
                color="black"
                mb="12px"
              >
                Account Creation
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "22px" }}
                color="gray.600"
              >
                Fill out the following information.
              </Text>
            </Box>

          </Flex>

          <Flex
            direction="column"
            justify="center"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="10%"
            gap={{ base: "20px", md: "30px" }}
          >
            <Progress.Root
              value={90}
              size="xs"
            >
              <Progress.Track>
                <Progress.Range bg="#0088FF" />
              </Progress.Track>
            </Progress.Root>

            <Box>
              <Text
                fontSize={{ base: "13px", md: "16px" }}
                color="black"
                mb="8px"
                fontWeight="bold"
              >
                Graduation Year <Box as="span" color="#991919"> *</Box>
              </Text>
              <Input
                placeholder="20XX"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                borderColor={gradError ? "red.400" : "#E4E4E7"}
                borderRadius="6px"
                fontSize="14px"
                h={{ base: "40px", md: "44px" }}
                focusRingColor="gray.200"
              />
              {gradError && (
                <Text fontSize="12px" color="red.500" mt="6px">
                  Invalid Graduation Year. Please ensure it is in XXXX format.
                </Text>
              )}
            </Box>

            <Box>
              <Text
                fontSize={{ base: "13px", md: "16px" }}
                color="black"
                mb="8px"
                fontWeight="bold"
              >
                Employer <Box as="span" color="#991919"> *</Box>
              </Text>
              <Input
                placeholder="Enter your company name"
                value={employer}
                onChange={(e) => {
                  setEmployer(e.target.value);
                  if (employerError) setEmployerError(false);
                }}
                borderColor={employerError ? "red.400" : "#E4E4E7"}
                borderRadius="6px"
                fontSize="14px"
                h={{ base: "40px", md: "44px" }}
                focusRingColor="gray.200"
              />
              {employerError && (
                <Text fontSize="12px" color="red.500" mt="6px">
                  Employer is required.
                </Text>
              )}
            </Box>

            <Button
              bg="white"
              borderColor="#E4E4E7"
              color="black"
              h={{ base: "40px", md: "48px" }}
              borderRadius="6px"
              fontSize={{ base: "13px", md: "17px" }}
              fontWeight={500}
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
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              <Box w="100%" textAlign="center">
                Create Account
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

export default BackgroundStep;
