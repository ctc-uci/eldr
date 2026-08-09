import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  Link,
  Separator,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LuArrowRight, LuExternalLink } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import microsoft from "@/assets/microsoft_logo.svg";
import LoginLayout from "@/components/volunteerLogin/steps/BackgroundLayout";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import {
  authenticateGoogleUser,
  authenticateMicrosoftUser,
} from "@/utils/auth/providers";
import { clearCookies } from "@/utils/auth/cookie";
import { refreshToken } from "@/utils/auth/firebase";
import {
  getAuth,
  getRedirectResult,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Cookies } from "react-cookie";

type UserRecord = {
  email?: string;
  role?: string;
};

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [, setUserFilled] = useState(false);
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

        await refreshToken();

        const usersResponse = await backend.get("/users");
        const latestUsers = (usersResponse.data ?? []) as UserRecord[];

        if (!isAdmin(ssoEmail, latestUsers)) {
          await signOut(auth);
          clearCookies(new Cookies());
          setSsoError("No staff account exists with those credentials.");
          return;
        }

        navigate("/adminDashboard");
      } catch (error: unknown) {
        const firebaseError = error as { message?: string };
        await signOut(auth);
        clearCookies(new Cookies());
        setSsoError(firebaseError.message ?? "Sign in failed. Please try again.");
      }
    };

    void handleAdminRedirectResult();
  }, [auth, backend, navigate]);

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
        />

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
                  <LuExternalLink size={20} color="#2563EB" />
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
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserFilled(value.length > 0);
                    setEmail(value);
                    setEmailError("");
                  }}
                />
              </Flex>
              {emailError && (
                <Text fontSize="12px" color="red.500" mt="4px">
                  {emailError}
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
                Password
                <Box as="span" color="#991919"> *</Box>
              </Text>
              <Flex
                align="center"
                border="1px solid"
                borderColor={passwordError ? "red.400" : "#E4E4E7"}
                borderRadius="6px"
                px="12px"
                h={{ base: "40px", md: "44px" }}
                gap="8px"
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  border="none"
                  outline="none"
                  p="0"
                  h="100%"
                  fontSize="14px"
                  color="black"
                  _placeholder={{ color: "gray.400" }}
                  focusRingColor="transparent"
                  value={password}
                  css={{ "&::-ms-reveal, &::-ms-clear": { display: "none" } }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassFilled(value.length > 0);
                    setPassword(value);
                    setPasswordError("");
                  }}
                />
                {passFilled && (
                  <IconButton
                    variant="ghost"
                    boxSize="20px"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                    _hover={{ bg: "transparent" }}
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </IconButton>
                )}
              </Flex>
              {passwordError && (
                <Text fontSize="12px" color="red.500" mt="4px">
                  {passwordError}
                </Text>
              )}
            </Box>

            <Box w="30vw" minW="320px" maxW="460px" textAlign="right" mt="-4px">
              <Link
                textDecoration="underline"
                color="#3182CE"
                href="/adminForgotPass?from=admin"
                fontSize={{ base: "13px", md: "14px" }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              bg="white"
              borderColor="#E4E4E7"
              borderWidth="1px"
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
              onClick={handleAdminLogin}
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
              w="30vw"
              minW="320px"
              maxW="460px"
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
              borderWidth="1px"
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
              onClick={handleGoogleSso}
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
              borderWidth="1px"
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
              onClick={handleMicrosoftSso}
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

            {ssoError && (
              <Text fontSize="12px" color="red.500" mt="4px" textAlign="center">
                {ssoError}
              </Text>
            )}
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