import {
  Box,
  Button,
  Field,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  Link,
  List,
  Separator,
  Text,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import {
  LuExternalLink,
} from "react-icons/lu";

import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaGoogle,
  FaInstagram,
  FaMicrosoft,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { HiOutlineKey } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import {
  authenticateGoogleUser,
  authenticateMicrosoftUser,
} from "@/utils/auth/providers";
import logo from "./ELDR_Logo.png";
import {
  getAuth,
  getRedirectResult,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

type UserRecord = {
  email?: string;
  role?: string;
};

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [userFilled, setUserFilled] = useState(false);
  const [passFilled, setPassFilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [ssoError, setSsoError] = useState("");
  const auth = getAuth();

  const isAdmin = (lookupEmail: string, users: UserRecord[]) => {
    const normalizedEmail = lookupEmail.trim().toLowerCase();
    return users.some(
      (curr) =>
        (curr.email ?? "").trim().toLowerCase() === normalizedEmail &&
        (curr.role === "staff" || curr.role === "supervisor")
    );
  };

  const handleAdminLogin = async () => {
    let valid = true;

    if (!email.trim()) {
      setEmailError("Please enter a valid email.");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Please enter a valid password.");
      valid = false;
    }

    if (!valid) return;

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const usersResponse = await backend.get("/users");
      const latestUsers = (usersResponse.data ?? []) as UserRecord[];

      if (!isAdmin(normalizedEmail, latestUsers)) {
        setEmailError("Email not found. Please try again.");
        return;
      }

      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      navigate("/adminDashboard");
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };

      if (
        firebaseError.code === "auth/invalid-credential" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        setPasswordError("Invalid password. Please try again.");
        return;
      }

      if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/invalid-email"
      ) {
        setEmailError("Email not found. Please try again.");
        return;
      }

      setEmailError(firebaseError.message ?? "Sign in failed. Please try again.");
    }
  };

  const handleGoogleSso = async () => {
    await authenticateGoogleUser();
  };

  const handleMicrosoftSso = async () => {
    await authenticateMicrosoftUser();
  };

  useEffect(() => {
    const handleAdminRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result) return;

        const ssoEmail = (result.user.email ?? "").trim().toLowerCase();
        if (!ssoEmail) {
          await signOut(auth);
          setSsoError("No staff account exists with those credentials.");
          return;
        }

        const usersResponse = await backend.get("/users");
        const latestUsers = (usersResponse.data ?? []) as UserRecord[];

        if (!isAdmin(ssoEmail, latestUsers)) {
          await signOut(auth);
          setSsoError("No staff account exists with those credentials.");
          return;
        }

        navigate("/adminDashboard");
      } catch (error: unknown) {
        const firebaseError = error as { message?: string };
        setSsoError(firebaseError.message ?? "Sign in failed. Please try again.");
      }
    };

    void handleAdminRedirectResult();
  }, [auth, backend, navigate]);

  return (
    <Flex
      minH="100vh"
      w="100%"
      bg="white"
      align="center"
      justify="center"
      position="relative"
      p="3vh"
    >
      <Box
        position="absolute"
        top="-400px"
        left="-400px"
        w="900px"
        h="900px"
        bg="#EFF6FF"
        borderRadius="50%"
        zIndex={0}
      />
      <VStack
        minH="80vh"
        w="80vw"
        maxW="1200px"
        borderWidth="1px"
        borderRadius="sm"
        borderColor="#E4E4E7"
        zIndex={1}
        gap={0}
        overflow="hidden"
      >
        <Flex
          w="100%"
          bg="#F6F6F6"
          h="70px"
          align="left"
          px="2%"
          py="1%"
        >
        </Flex>
        <Flex flex="1" w="100%" bg="white">
          <VStack align="left" width="50%" px="5%" gap={1}>
            <Text fontWeight="bold" fontSize="30px" pt="15%">
              Community Counsel's Event Portal
            </Text>
            <HStack>
              <Text pt="3%">Need help? Visit our website </Text>
              <Link
                color="#3182CE"
                bg="white"
                href="https://eldrcenter.org/"
                pt="2%"
              >
                <LuExternalLink />
              </Link>
            </HStack>
          </VStack>
          <Separator orientation="vertical" />
          <VStack
            w="50%"
            bg="#FFFFFF"
            h="100%"
            align="left"
            justify="center"
            px="5%"
            py="10%"
          >
            <VStack w="30vw" minW="320px" align="stretch" gap={3}>
              <Field.Root invalid={!!emailError} required>
                <Field.Label fontWeight="bold">Email
                  <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup width="100%">
                  <Input
                    placeholder="Enter an email"
                    borderRadius="md"
                    _placeholder={{ color: "#A1A1AA", opacity: 1 }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUserFilled(value.length > 0);
                      setEmail(value);
                      setEmailError("");
                    }}
                  />
                </InputGroup>
                <Field.ErrorText>
                  {emailError || "Please enter a valid email."}
                </Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!passwordError} required>
                <Field.Label fontWeight="bold">Password
                  <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup
                  width="100%"
                  endElement={
                    passFilled ? (
                      <IconButton
                        variant="ghost"
                        boxSize="20px"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label="Toggle password visibility"
                        _hover={{ bg: "white" }}
                      >
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </IconButton>
                    ) : null
                  }
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    borderRadius="md"
                    _placeholder={{ color: "#A1A1AA", opacity: 1 }}
                    css={{ "&::-ms-reveal, &::-ms-clear": { display: "none" } }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassFilled(value.length > 0);
                      setPassword(value);
                      setPasswordError("");
                    }}
                  />
                </InputGroup>
                <Field.ErrorText>
                  {passwordError || "Please enter a valid password."}
                </Field.ErrorText>
              </Field.Root>

              <Link
                textDecoration="underline"
                color="#3182CE"
                background="white"
                href="/adminForgotPass?from=admin"
                alignSelf="flex-end"
                pb="2%"
              >
                Forgot Password?
              </Link>
              <Button
                position="relative"
                variant="outline"
                borderRadius="md"
                bg="white"
                w="100%"
                h="3vw"
                color="black"
                _hover={{ bg: "#F4F4F5" }}
                css={{
                  "&:active": {
                    background: "black !important",
                    color: "white !important",
                  },
                }}
                onClick={handleAdminLogin}
              >
                Login
                <Icon
                  as={FaArrowRight}
                  position="absolute"
                  right="16px"
                  top="50%"
                  transform="translateY(-50%)"
                />
              </Button>
            </VStack>

            <VStack w="30vw" minW="320px" align="stretch" mt={4}>
              <Text fontSize="md" fontWeight="bold" pb="4%" textAlign="center">
                or continue with
              </Text>
              <Button
                variant="outline"
                bg="white"
                borderWidth="2px"
                borderRadius="md"
                w="100%"
                alignSelf="center"
                h="50px"
                color="black"
                _hover={{ bg: "#F4F4F5" }}
                css={{
                  "&:active": {
                    background: "black !important",
                    color: "white !important",
                  },
                }}
                onClick={handleGoogleSso}
              >
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                  alt="Google" 
                  boxSize="20px"
                  position="absolute" 
                  left="16px" 
                  top="50%" 
                  transform="translateY(-50%)" 
                />
                Google
                <Icon as={FaArrowRight} position="absolute" right="16px" top="50%" transform="translateY(-50%)" />
              </Button>
              <Button
                variant="outline"
                bg="white"
                borderWidth="2px"
                borderRadius="md"
                w="100%"
                alignSelf="center"
                h="50px"
                color="black"
                _hover={{ bg: "#F4F4F5" }}
                css={{
                  "&:active": {
                    background: "black !important",
                    color: "white !important",
                  },
                }}
                onClick={handleMicrosoftSso}
              >
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
                  alt="Microsoft" 
                  boxSize="20px"
                  position="absolute" 
                  left="16px" 
                  top="50%" 
                  transform="translateY(-50%)" 
                />
                Microsoft
                <Icon as={FaArrowRight} position="absolute" right="16px" top="50%" transform="translateY(-50%)" />
              </Button>
              <Field.Root invalid={!!ssoError}>
                <Field.ErrorText textAlign="center">{ssoError}</Field.ErrorText>
              </Field.Root>
            </VStack>
          </VStack>
        </Flex>
        <Flex w="100%" bg="#F6F6F6" h="70px" />
      </VStack>
    </Flex>
  );
}