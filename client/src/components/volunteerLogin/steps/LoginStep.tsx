import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";
import { FiLinkedin } from "react-icons/fi";
import {
  LuArrowRight,
  LuFacebook,
  LuKeyRound,
  LuMail,
  LuUser,
} from "react-icons/lu";
import { RiMicrosoftLine } from "react-icons/ri";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const BAR_HEIGHT = "70.54px";
const BAR_BG = "#E8E8E8";

const LoginStep = ({ onNext, onBack }: Props) => {
  return (
    <LoginLayout>
      <Flex
        w="1091.62px"
        h="914.39px"
        bg="#FFFFFF"
        borderRadius="4.41px"
        border="1px solid"
        borderColor="#E4E4E7"
        overflow="hidden"
        direction="column"
      >
        <Flex
          w="100%"
          h={BAR_HEIGHT}
          bg={BAR_BG}
          flexShrink={0}
          align="center"
          px="24px"
        >
          <Image
            src={logo}
            alt="ELDR Logo"
            h="45px"
            objectFit="contain"
          />
        </Flex>

        <Flex
          flex="1"
          overflow="hidden"
        >
          <Flex
            direction="column"
            justify="space-between"
            w="50%"
            p="60px"
            borderRight="1px solid"
            borderColor="#E4E4E7"
          >
            <Box>
              <Heading
                fontSize="30px"
                fontWeight={700}
                color="black"
                mb="20px"
              >
                Welcome to Volunteer Portal by Community Counsel
              </Heading>
              <Text
                fontSize="20px"
                color="gray.600"
              >
                Log in using your CC Credentials. If you don't have one, click
                on the create link below. If you need to reset your password,
                click "Forgot Password".
              </Text>
            </Box>

            <Box>
              <Text
                fontWeight={700}
                fontSize="22px"
                color="black"
              >
                Need help?
              </Text>
              <Text
                fontWeight={700}
                fontSize="22px"
                color="black"
                mb="8px"
              >
                Visit our website
              </Text>
              <Link
                href="#"
                color="blue.500"
                fontSize="20px"
                textDecoration="underline"
              >
                Community Counsel Website
              </Link>

              <HStack
                gap="16px"
                mt="32px"
              >
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuFacebook size={22} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <FiLinkedin size={22} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <BsInstagram size={22} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuMail size={22} />
                </Box>
              </HStack>
            </Box>
          </Flex>

          <Flex
            direction="column"
            justify="center"
            w="50%"
            p="60px"
            gap="16px"
          >
            <Box>
              <Text
                fontSize="14px"
                fontWeight={500}
                color="black"
                mb="6px"
              >
                First Name
              </Text>
              <Flex
                align="center"
                border="1px solid"
                borderColor="#E4E4E7"
                borderRadius="6px"
                px="12px"
                h="44px"
                gap="8px"
              >
                <LuUser
                  size={16}
                  color="#9CA3AF"
                />
                <Input
                  placeholder="Enter First Name"
                  border="none"
                  outline="none"
                  p="0"
                  h="100%"
                  fontSize="14px"
                  color="black"
                  _placeholder={{ color: "gray.400" }}
                  focusRingColor="transparent"
                />
              </Flex>
            </Box>

            <Box>
              <Text
                fontSize="14px"
                fontWeight={500}
                color="black"
                mb="6px"
              >
                Last Name
              </Text>
              <Flex
                align="center"
                border="1px solid"
                borderColor="#E4E4E7"
                borderRadius="6px"
                px="12px"
                h="44px"
                gap="8px"
              >
                <LuUser
                  size={16}
                  color="#9CA3AF"
                />
                <Input
                  placeholder="Enter Last Name"
                  border="none"
                  outline="none"
                  p="0"
                  h="100%"
                  fontSize="14px"
                  color="black"
                  _placeholder={{ color: "gray.400" }}
                  focusRingColor="transparent"
                />
              </Flex>
            </Box>

            <Box>
              <Flex
                justify="space-between"
                align="center"
                mb="6px"
              >
                <Text
                  fontSize="14px"
                  fontWeight={500}
                  color="black"
                >
                  Password
                </Text>
                <Link
                  href="#"
                  fontSize="13px"
                  color="blue.500"
                  textDecoration="underline"
                  onClick={onBack}
                >
                  Forgot Password?
                </Link>
              </Flex>
              <Flex
                align="center"
                border="1px solid"
                borderColor="#E4E4E7"
                borderRadius="6px"
                px="12px"
                h="44px"
                gap="8px"
              >
                <LuKeyRound
                  size={16}
                  color="#9CA3AF"
                />
                <Input
                  placeholder="Enter Password"
                  type="password"
                  border="none"
                  outline="none"
                  p="0"
                  h="100%"
                  fontSize="14px"
                  color="black"
                  _placeholder={{ color: "gray.400" }}
                  focusRingColor="transparent"
                />
              </Flex>
            </Box>

            <Button
              bg="#4A90D9"
              color="white"
              h="48px"
              borderRadius="6px"
              fontSize="14px"
              fontWeight={500}
              _hover={{ bg: "#3a7bc8" }}
              justifyContent="space-between"
              px="20px"
              mt="4px"
            >
              Login
              <LuArrowRight size={16} />
            </Button>

            <Flex
              align="center"
              gap="3"
            >
              <Separator
                flex="1"
                borderColor="#E4E4E7"
              />
              <Text
                fontSize="17px"
                color="gray.400"
              >
                or continue with
              </Text>
              <Separator
                flex="1"
                borderColor="#E4E4E7"
              />
            </Flex>

            <Button
              bg="#4A90D9"
              color="white"
              h="48px"
              borderRadius="6px"
              fontSize="14px"
              fontWeight={500}
              _hover={{ bg: "#3a7bc8" }}
              justifyContent="space-between"
              px="20px"
            >
              <HStack gap="10px">
                <FaGoogle size={18} />
                <span>Google</span>
              </HStack>
              <LuArrowRight size={16} />
            </Button>

            <Button
              bg="#4A90D9"
              color="white"
              h="48px"
              borderRadius="6px"
              fontSize="14px"
              fontWeight={500}
              _hover={{ bg: "#3a7bc8" }}
              justifyContent="space-between"
              px="20px"
            >
              <HStack gap="10px">
                <RiMicrosoftLine size={18} />
                <span>Microsoft</span>
              </HStack>
              <LuArrowRight size={16} />
            </Button>

            <Text
              fontSize="13px"
              color="gray.500"
              textAlign="center"
            >
              <Link
                href="#"
                color="blue.500"
                textDecoration="underline"
                onClick={onNext}
              >
                Create
              </Link>{" "}
              an Account
            </Text>
          </Flex>
        </Flex>

        <Box
          w="100%"
          h={BAR_HEIGHT}
          bg={BAR_BG}
          flexShrink={0}
        />
      </Flex>
    </LoginLayout>
  );
};

export default LoginStep;
