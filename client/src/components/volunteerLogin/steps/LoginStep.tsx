import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Link,
  Separator,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";

import { FcGoogle } from "react-icons/fc";
import microsoft from "../../../assets/microsoft_logo.svg";


import {
  LuArrowRight,
  LuExternalLink,
} from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { auth } from "@/utils/auth/firebase";
import {
  authenticateGoogleUser,
  authenticateMicrosoftUser,
} from "@/utils/auth/providers";

import LoginLayout from "./BackgroundLayout";

type Props = {
  onNavigateToCreateAccount: () => void;
};

type VolunteerLookupRow = {
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

const LoginStep = ({ onNavigateToCreateAccount }: Props) => {
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const { handleRedirectResult } = useAuthContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const toastLoginError = useCallback((msg: string) => {
    toaster.error({
      title: "An error occurred while signing in",
      description: msg,
    });
  }, []);

  const handleLogin = async () => {
    try {
      // reset errors
      setFirstNameError(false);
      setLastNameError(false);
      setEmailError(false);
  
      if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        toastLoginError("Please enter first name, last name, and email.");
        return;
      }
  
      const response = await backend.get("/volunteers");
      const volunteers = (response.data ?? []) as VolunteerLookupRow[];
  
      const f = firstName.trim().toLowerCase();
      const l = lastName.trim().toLowerCase();
      const e = email.trim().toLowerCase();
  
      const match = volunteers.find((v) => {
        const vf = (v.firstName ?? v.first_name ?? "").toLowerCase().trim();
        const vl = (v.lastName ?? v.last_name ?? "").toLowerCase().trim();
        const ve = (v.email ?? "").toLowerCase().trim();
  
        return vf === f && vl === l && ve === e;
      });
  
      if (!match) {
        const firstExists = volunteers.some(
          v => (v.firstName ?? v.first_name ?? "").toLowerCase().trim() === f
        );
  
        const lastExists = volunteers.some(
          v => (v.lastName ?? v.last_name ?? "").toLowerCase().trim() === l
        );
  
        const emailExists = volunteers.some(
          v => (v.email ?? "").toLowerCase().trim() === e
        );
  
        setFirstNameError(!firstExists);
        setLastNameError(firstExists && !lastExists);
        setEmailError(firstExists && lastExists && !emailExists);
  

        if (!firstExists) setFirstName("");
        if (firstExists && !lastExists) setLastName("");
        if (firstExists && lastExists && !emailExists) setEmail("");
  
        return;
      }
  
      const tokenResponse = await backend.post("/users/custom-token", {
        email: match.email!.toLowerCase().trim(),
      });
  
      const customToken = tokenResponse.data?.customToken;
  
      if (!customToken) {
        throw new Error("Unable to generate authentication token.");
      }
  
      await signInWithCustomToken(auth, customToken);

      // Volunteer portal home (not /dashboard — that hub is for staff/supervisor
      // routing and falls through to a generic "Guest" dashboard when role is slow).
      navigate("/event-catalog/all-events", { replace: true });
    } catch (err: unknown) {
      const authError = err as { message?: string };
  
      toastLoginError(authError?.message ?? "Unable to sign in.");
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
        </Flex>

        <Flex
          flex="1"
          direction={{ base: "column", md: "row" }}
        >
          <Flex
            direction="column"
            justify="center"
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
                fontSize={{ base: "17px", md: "22px", lg: "32px" }}
                fontWeight={700}
                color="black"
                mb="12px"
                lineHeight="1.2"
              >
                Community Counsel's Event Portal
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "18px" }}
                color="black"
              >
                Need help? Visit our website{" "}
                
                <Link
                href="https://eldrcenter.org/"
                display="inline-flex"
                alignItems="center"
              >
                <LuExternalLink size={20} color="#2563EB"/>
              </Link>
              </Text>
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
                fontWeight="bold"
                color="black"
                mb="6px"
              >
                First Name
                <Box as="span" color="#991919"> *</Box>
              </Text>
              <Flex
                align="center"
                border="1px solid"
                borderColor={firstNameError ? "red.400" : "#E4E4E7"}
                borderRadius="6px"
                px="12px"
                h={{ base: "40px", md: "44px" }}
                gap="8px"
              >
                <Input
                  placeholder="Enter your first name"
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
              {firstNameError && (
                  <Text fontSize="10px" color="red.500" mt="4px">
                    No matching first name found. Please try again.
                  </Text>
                )}
            </Box>

            <Box w="30vw" minW="320px" maxW="460px">
              <Text
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight="bold"
                color="black"
                mb="6px"
              >
                Last Name
                <Box as="span" color="#991919"> *</Box>
              </Text>
              <Flex
                align="center"
                border="1px solid"
                borderColor={lastNameError ? "red.400" : "#E4E4E7"}
                borderRadius="6px"
                px="12px"
                h={{ base: "40px", md: "44px" }}
                gap="8px"
              >
                <Input
                  placeholder="Enter your last name"
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
              {lastNameError && (
                  <Text fontSize="10px" color="red.500" mt="4px">
                    No matching last name found. Please try again.
                  </Text>
                )}
            </Box>

            <Box w="30vw" minW="320px" maxW="460px">
              <Text
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight="bold"
                color="black"
                mb="6px"
              >
                Email
                <Box as="span" color="#991919"> *</Box>
              </Text>
              <Flex
                align="center"
                border="1px solid"
                borderColor={emailError ? "red.400" : "#E4E4E7"}
                borderRadius="6px"
                px="12px"
                h={{ base: "40px", md: "44px" }}
                gap="8px"
              >
                <Input
                  placeholder="Enter an email"
                  type="email"
                  border="none"
                  outline="none"
                  p="0"
                  h="100%"
                  fontSize="14px"
                  color="black"
                  _placeholder={{ color: "gray.400" }}
                  focusRingColor="transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Flex>
              {emailError && (
                  <Text fontSize="12px" color="red.500" mt="4px">
                    Email not found or does not match this account.
                  </Text>
                )}
            </Box>

            <Button
              bg="white"
              borderColor="#E4E4E7"
              color="black"
              h={{ base: "40px", md: "48px" }}
              w="30vw"
              minW="320px"
              maxW="460px"
              borderRadius="6px"
              fontSize={{ base: "13px", md: "14px" }}
              fontWeight={500}
              _active={{ bg: "black", color: "white" }}
              _hover={{
                bg: "#F4F4F5", 
                _active: {
                  bg: "black", 
                  color: "white",
                },
              }}
              justifyContent="center"
              px="20px"
              mt="4px"
              onClick={handleLogin}
              position="relative"
            >
              Login

              <Box position="absolute" right="16px">
                <LuArrowRight size={16} />
              </Box>
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
                fontSize={{ base: "12px", md: "14px" }}
                color="black"
                fontWeight="bold"
              >
                or continue with
              </Text>
              <Separator
                flex="1"
                borderColor="#E4E4E7"
              />
            </Flex>

            <Button
              bg="white"
              borderColor="#E4E4E7"
              color="black"
              h={{ base: "40px", md: "48px" }}
              w="30vw"
              minW="320px"
              maxW="460px"
              borderRadius="6px"
              fontSize={{ base: "13px", md: "14px" }}
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
              px="20px"
              onClick={handleGoogleLogin}
              >

              <Box position="absolute" left="16px">
                <FcGoogle size={18} />
              </Box>

              <Text textAlign="center" w="100%">
                Google
              </Text>

              <Box position="absolute" right="16px">
                <LuArrowRight size={16} />
              </Box>
            </Button>

            <Button
              bg="white"
              borderColor="#E4E4E7"
              color="black"
              h={{ base: "40px", md: "48px" }}
              w="30vw"
              minW="320px"
              maxW="460px"
              borderRadius="6px"
              fontSize={{ base: "13px", md: "14px" }}
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
              px="20px"
              onClick={handleMicrosoftLogin}
            >

              <Box position="absolute" left="16px">
                <Image src={microsoft} alt="Microsoft logo" boxSize="18px" />
              </Box>

              <Text textAlign="center" w="100%">
                Microsoft
              </Text>

              <Box position="absolute" right="16px">
                <LuArrowRight size={16} />
              </Box>



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
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToCreateAccount();
                }}
              >
                Create an account
              </Link>
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
