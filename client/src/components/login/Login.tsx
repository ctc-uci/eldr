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
import { useNavigate } from "react-router-dom";

import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import {
  LuArrowRight,
  LuBriefcase,
  LuFacebook,
  LuMail,
  LuUser,
} from "react-icons/lu";

import logo from "../../assets/EldrLogo.png";
import LoginLayout from "../volunteerLogin/steps/BackgroundLayout";

export const Login = () => {
  const navigate = useNavigate();

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
          <Flex
            direction="column"
            justify="space-between"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="8%"
            borderRight={{ base: "none", md: "1px solid #E4E4E7" }}
            borderBottom={{ base: "1px solid #E4E4E7", md: "none" }}
            borderColor="#E4E4E7"
            gap={{ base: "32px", md: "0" }}
          >
            <Box>
              <Heading
                fontSize={{ base: "17px", md: "22px", lg: "28px" }}
                fontWeight={700}
                color="black"
                mb="12px"
              >
                Welcome to CC Login Portal by Community Counsel
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "18px" }}
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
                href="https://eldrcenter.org/"
                color="#3182CE"
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
                textDecoration="underline"
              >
                Community Counsel Website
              </Link>
              <HStack
                gap={{ base: "12px", md: "16px" }}
                mt={{ base: "20px", md: "32px" }}
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

          <Flex
            direction="column"
            justify={{ base: "center", md: "flex-start" }}
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py={{ base: "10%", md: "14%" }}
            align="center"
          >
            <VStack
              w="30vw"
              minW="320px"
              maxW="460px"
              align="stretch"
              gap={3}
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

              <Button
                bg="#3182CE"
                color="white"
                h={{ base: "44px", md: "52px" }}
                borderRadius="6px"
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight={500}
                _hover={{ bg: "#5797BD" }}
                justifyContent="center"
                position="relative"
                px="20px"
                onClick={() => navigate("/login/staff")}
              >
                <Box
                  position="absolute"
                  left="20px"
                  display="flex"
                  alignItems="center"
                >
                  <LuBriefcase size={16} />
                </Box>
                <Text textAlign="center">Staff Member</Text>
                <Box
                  position="absolute"
                  right="20px"
                  display="flex"
                  alignItems="center"
                >
                  <LuArrowRight size={16} />
                </Box>
              </Button>

              <Button
                bg="#3182CE"
                color="white"
                h={{ base: "44px", md: "52px" }}
                borderRadius="6px"
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight={500}
                _hover={{ bg: "#5797BD" }}
                justifyContent="center"
                position="relative"
                px="20px"
                onClick={() => navigate("/login/volunteer")}
              >
                <Box
                  position="absolute"
                  left="20px"
                  display="flex"
                  alignItems="center"
                >
                  <LuUser size={16} />
                </Box>
                <Text textAlign="center">Volunteer</Text>
                <Box
                  position="absolute"
                  right="20px"
                  display="flex"
                  alignItems="center"
                >
                  <LuArrowRight size={16} />
                </Box>
              </Button>
            </VStack>
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
