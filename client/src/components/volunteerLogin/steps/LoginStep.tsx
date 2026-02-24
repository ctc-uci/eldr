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
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { toaster } from "@/components/ui/toaster";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import {
  authenticateGoogleUser,
  authenticateMicrosoftUser,
} from "@/utils/auth/providers";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const LoginStep = ({ onNext, onBack }: Props) => {
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const { login, handleRedirectResult } = useAuthContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const toastLoginError = useCallback((msg: string) => {
    toaster.error({
      title: "An error occurred while signing in",
      description: msg,
    });
  }, []);

  const handleLogin = async () => {
    try {
      if (!firstName.trim() || !lastName.trim() || !password) {
        toastLoginError("Please enter first name, last name, and password.");
        return;
      }

      const response = await backend.get("/volunteers");
      const volunteers = response.data;

      const volunteer = volunteers.find(
        (v: {
          firstName?: string;
          lastName?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
        }) => {
          const volunteerFirstName = (v.firstName ?? v.first_name ?? "").toLowerCase();
          const volunteerLastName = (v.lastName ?? v.last_name ?? "").toLowerCase();
          return (
            volunteerFirstName === firstName.trim().toLowerCase() &&
            volunteerLastName === lastName.trim().toLowerCase()
          );
        }
      );

      if (!volunteer?.email) {
        toastLoginError(
          "No account found with this first and last name. Please check your information or create an account."
        );
        return;
      }

      await login({
        email: volunteer.email,
        password,
      });

      navigate("/dashboard");
    } catch (err: any) {
      const errorCode = err?.code;
      const firebaseErrorMsg = err?.message;

      switch (errorCode) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-email":
        case "auth/user-not-found":
          toastLoginError("First name, last name, or password does not match our records!");
          break;
        case "auth/unverified-email":
          toastLoginError("Please verify your email address.");
          break;
        case "auth/user-disabled":
          toastLoginError("This account has been disabled.");
          break;
        case "auth/too-many-requests":
          toastLoginError("Too many attempts. Please try again later.");
          break;
        case "auth/user-signed-out":
          toastLoginError("You have been signed out. Please sign in again.");
          break;
        default:
          toastLoginError(firebaseErrorMsg ?? "Unable to sign in.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    await authenticateGoogleUser();
  };

  const handleMicrosoftLogin = async () => {
    await authenticateMicrosoftUser();
  };

  useEffect(() => {
    handleRedirectResult(backend, navigate);
  }, [backend, handleRedirectResult, navigate]);

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
            py="10%"
            borderRight={{ base: "none", md: "1px solid #E4E4E7" }}
            borderBottom={{ base: "1px solid #E4E4E7", md: "none" }}
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
                Welcome to Volunteer Portal by Community Counsel
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
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
            justify="center"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="10%"
            gap={{ base: "12px", md: "16px" }}
            align="center"
          >
            <Box w="30vw" minW="320px" maxW="460px">
              <Text
                fontSize={{ base: "13px", md: "14px" }}
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
                h={{ base: "40px", md: "44px" }}
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Flex>
            </Box>

            <Box w="30vw" minW="320px" maxW="460px">
              <Text
                fontSize={{ base: "13px", md: "14px" }}
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
                h={{ base: "40px", md: "44px" }}
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Flex>
            </Box>

            <Box w="30vw" minW="320px" maxW="460px">
              <Flex
                justify="space-between"
                align="center"
                mb="6px"
              >
                <Text
                  fontSize={{ base: "13px", md: "14px" }}
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
                h={{ base: "40px", md: "44px" }}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Flex>
            </Box>

            <Button
              bg="#3182CE"
              color="white"
              h={{ base: "40px", md: "48px" }}
              w="30vw"
              minW="320px"
              maxW="460px"
              borderRadius="6px"
              fontSize={{ base: "13px", md: "14px" }}
              fontWeight={500}
              _hover={{ bg: "#5797BD" }}
              justifyContent="space-between"
              px="20px"
              mt="4px"
              onClick={handleLogin}
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
                fontSize={{ base: "14px", md: "17px" }}
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
              bg="#3182CE"
              color="white"
              h={{ base: "40px", md: "48px" }}
              w="30vw"
              minW="320px"
              maxW="460px"
              borderRadius="6px"
              fontSize={{ base: "13px", md: "14px" }}
              fontWeight={500}
              _hover={{ bg: "#5797BD" }}
              justifyContent="space-between"
              px="20px"
              onClick={handleGoogleLogin}
            >
              <HStack gap="10px">
                <FaGoogle size={18} />
                <span>Google</span>
              </HStack>
              <LuArrowRight size={16} />
            </Button>

            <Button
              bg="#3182CE"
              color="white"
              h={{ base: "40px", md: "48px" }}
              w="30vw"
              minW="320px"
              maxW="460px"
              borderRadius="6px"
              fontSize={{ base: "13px", md: "14px" }}
              fontWeight={500}
              _hover={{ bg: "#5797BD" }}
              justifyContent="space-between"
              px="20px"
              onClick={handleMicrosoftLogin}
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
                color="#3182CE"
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
          h="70px"
          bg="#F6F6F6"
          flexShrink={0}
        />
      </Flex>
    </LoginLayout>
  );
};

export default LoginStep;
