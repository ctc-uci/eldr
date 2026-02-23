import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import {
  LuArrowRight,
  LuBriefcase,
  LuFacebook,
  LuMail,
  LuUser,
} from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
};

const WelcomeStep = ({ onNext }: Props) => {
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
        {/* Top gray bar */}
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
          overflow="hidden"
        >
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
                fontSize={{ base: "18px", md: "24px", lg: "30px" }}
                fontWeight={700}
                color="black"
                mb="20px"
              >
                Welcome to CC Login Portal by Community Counsel
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
                color="gray.600"
              >
                Indicate whether you are a staff member or volunteer
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
                mt={{ base: "20px", md: "32px" }}
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

          <Flex
            direction="column"
            justify="center"
            w={{ base: "100%", md: "50%" }}
            p={{ base: "24px", md: "40px", lg: "60px" }}
          >
            <Heading
              fontSize={{ base: "18px", md: "22px", lg: "24px" }}
              fontWeight={600}
              color="black"
              mb="6px"
            >
              Welcome!
            </Heading>
            <Text
              fontSize={{ base: "14px", md: "16px", lg: "18px" }}
              color="gray.500"
              mb={{ base: "24px", md: "32px" }}
              fontStyle="italic"
            >
              Choose from the options below to continue.
            </Text>

            <VStack
              gap="14px"
              align="stretch"
            >
              <Button
                bg="#4A90D9"
                color="white"
                h={{ base: "44px", md: "52px" }}
                borderRadius="6px"
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight={500}
                _hover={{ bg: "#3a7bc8" }}
                justifyContent="space-between"
                px="20px"
              >
                <HStack gap="10px">
                  <LuBriefcase size={16} />
                  <span>Staff Member</span>
                </HStack>
                <LuArrowRight size={16} />
              </Button>

              <Button
                bg="#4A90D9"
                color="white"
                h={{ base: "44px", md: "52px" }}
                borderRadius="6px"
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight={500}
                _hover={{ bg: "#3a7bc8" }}
                justifyContent="space-between"
                px="20px"
                onClick={onNext}
              >
                <HStack gap="10px">
                  <LuUser size={16} />
                  <span>Volunteer</span>
                </HStack>
                <LuArrowRight size={16} />
              </Button>
            </VStack>
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

export default WelcomeStep;
