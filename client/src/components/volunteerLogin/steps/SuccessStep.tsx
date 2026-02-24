import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Progress,
  Text,
} from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuArrowRight, LuFacebook, LuMail, LuUser } from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
};

const SuccessStep = ({ onNext }: Props) => {
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
        direction="column"
      >
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
                mb="20px"
              >
                Community Counsel Account Manager
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
                color="gray.600"
              >
                Your account has been created! Navigate to the login page and
                sign-in with your new credentials.
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
            gap={{ base: "24px", md: "36px" }}
          >
            <Progress.Root
              value={100}
              size="xs"
            >
              <Progress.Track>
                <Progress.Range bg="#4A90D9" />
              </Progress.Track>
            </Progress.Root>

            <Flex
              direction="column"
              gap="8px"
              align="center"
            >
              <Heading
                fontSize={{ base: "18px", md: "22px" }}
                fontWeight={700}
                color="black"
              >
                CC Volunteer Account Created
              </Heading>
              <Text
                fontSize={{ base: "13px", md: "14px" }}
                color="grey"
                fontStyle="italic"
              >
                Navigate to the login page by clicking below.
              </Text>
            </Flex>

            <Button
              bg="#4A90D9"
              color="white"
              h={{ base: "40px", md: "48px" }}
              w="100%"
              borderRadius="6px"
              fontSize={{ base: "13px", md: "17px" }}
              fontWeight={500}
              _hover={{ bg: "#3a7bc8" }}
              justifyContent="space-between"
              px="20px"
              onClick={onNext}
            >
              <HStack gap="10px">
                <LuUser size={18} />
                <span>Return to Login</span>
              </HStack>
              <LuArrowRight size={16} />
            </Button>
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

export default SuccessStep;
