import { useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  Text,
  Link,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { FaFacebook, FaLinkedin, FaInstagram, FaEnvelope, FaArrowRight, FaGoogle, FaMicrosoft, FaUser, FaKey } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toaster } from "@/components/ui/toaster";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { authenticateGoogleUser } from "@/utils/auth/providers";

const signinSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

type Props = {
  onNext: () => void;
};

const LoginStep = ({ onNext }: Props) => {
  const navigate = useNavigate();
  const { login, handleRedirectResult } = useAuthContext();
  const { backend } = useBackendContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
  });

  const toastLoginError = useCallback(
    (msg: string) => {
      toaster.error({
        title: "An error occurred while signing in",
        description: msg,
      });
    },
    []
  );

  const handleLogin = async (data: SigninFormValues) => {
    try {
      // Query volunteers table to find email by first and last name
      const response = await backend.get("/volunteers");
      const volunteers = response.data;
      
      // Find volunteer matching first and last name (case-insensitive)
      const volunteer = volunteers.find(
        (v: { firstName?: string; lastName?: string; email?: string }) => 
          v.firstName?.toLowerCase() === data.firstName.toLowerCase() &&
          v.lastName?.toLowerCase() === data.lastName.toLowerCase()
      );

      if (!volunteer?.email) {
        toastLoginError(
          "No account found with this first and last name. Please check your information or create an account."
        );
        return;
      }

      // Use the found email to login
      await login({
        email: volunteer.email,
        password: data.password,
      });

      navigate("/dashboard");
    } catch (err) {
      const errorCode = err.code;
      const firebaseErrorMsg = err.message;

      switch (errorCode) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-email":
        case "auth/user-not-found":
          toastLoginError(
            "First name, last name, or password does not match our records!"
          );
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
          toastLoginError(firebaseErrorMsg);
      }
    }
  };

  const handleGoogleLogin = async () => {
    await authenticateGoogleUser();
  };

  const handleMicrosoftLogin = async () => {
    toaster.error({
      title: "Microsoft login not yet implemented",
      description: "Please use email/password or Google login.",
    });
  };

  useEffect(() => {
    handleRedirectResult(backend, navigate);
  }, [backend, handleRedirectResult, navigate]);

  return (
    <>
      {/* Mobile Layout */}
      <Flex
        display={{ base: "flex", md: "none" }}
        w="100%"
        minH="100vh"
        direction="column"
        bg="white"
        px={6}
        py={8}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Main Content */}
        <Box w="full" maxW="400px" flex="1" display="flex" flexDirection="column" justifyContent="center">
          <Heading
            fontSize="2xl"
            fontWeight="bold"
            lineHeight="1.3"
            mb={8}
            color="black"
          >
            CC Volunteer Portal
          </Heading>

          <form onSubmit={handleSubmit(handleLogin)} style={{ width: "100%" }}>
            <Stack gap={5} w="full">
              <Field.Root invalid={!!errors.firstName} w="100%">
                <Text fontWeight="medium" mb={2} fontSize="sm">First Name</Text>
                <Box position="relative" w="100%">
                  <Box position="absolute" left="14px" top="50%" transform="translateY(-50%)" zIndex={2} pointerEvents="none">
                    <Icon as={FaUser} color="gray.400" boxSize={4} />
                  </Box>
                  <Input
                    placeholder="Enter First Name"
                    type="text"
                    h="48px"
                    pl="44px"
                    {...register("firstName")}
                    autoComplete="given-name"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.300"
                  />
                </Box>
                <Field.ErrorText>
                  {errors.firstName?.message?.toString()}
                </Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.lastName} w="100%">
                <Text fontWeight="medium" mb={2} fontSize="sm">Last Name</Text>
                <Box position="relative" w="100%">
                  <Box position="absolute" left="14px" top="50%" transform="translateY(-50%)" zIndex={2} pointerEvents="none">
                    <Icon as={FaUser} color="gray.400" boxSize={4} />
                  </Box>
                  <Input
                    placeholder="Enter Last Name"
                    type="text"
                    h="48px"
                    pl="44px"
                    {...register("lastName")}
                    autoComplete="family-name"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.300"
                  />
                </Box>
                <Field.ErrorText>
                  {errors.lastName?.message?.toString()}
                </Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.password} w="100%">
                <Flex justifyContent="space-between" alignItems="center" mb={2} w="100%">
                  <Text fontWeight="medium" fontSize="sm">Password</Text>
                  <Link
                    color="black"
                    fontSize="xs"
                    textDecoration="underline"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Forgot Password?
                  </Link>
                </Flex>
                <Box position="relative" w="100%">
                  <Box position="absolute" left="14px" top="50%" transform="translateY(-50%)" zIndex={2} pointerEvents="none">
                    <Icon as={FaKey} color="gray.400" boxSize={4} />
                  </Box>
                  <Input
                    type="password"
                    placeholder="Enter Password"
                    h="48px"
                    pl="44px"
                    {...register("password")}
                    autoComplete="current-password"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.300"
                  />
                </Box>
                <Field.ErrorText>
                  {errors.password?.message?.toString()}
                </Field.ErrorText>
              </Field.Root>

              <Button
                type="submit"
                bg="blue.400"
                color="white"
                w="full"
                h="48px"
                fontSize="md"
                fontWeight="semibold"
                borderRadius="md"
                _hover={{ bg: "blue.500" }}
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                disabled={Object.keys(errors).length > 0}
              >
                Continue
                <Icon as={FaArrowRight} boxSize={4} />
              </Button>

              <Text textAlign="center" color="gray.600" fontSize="sm">
                or continue with
              </Text>

              <Button
                bg="blue.500"
                color="white"
                w="full"
                h="48px"
                fontSize="md"
                fontWeight="semibold"
                borderRadius="md"
                _hover={{ bg: "blue.600" }}
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                onClick={handleGoogleLogin}
                type="button"
              >
                <Icon as={FaGoogle} boxSize={4} />
                Google
                <Icon as={FaArrowRight} boxSize={4} />
              </Button>

              <Button
                bg="blue.500"
                color="white"
                w="full"
                h="48px"
                fontSize="md"
                fontWeight="semibold"
                borderRadius="md"
                _hover={{ bg: "blue.600" }}
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                onClick={handleMicrosoftLogin}
                type="button"
              >
                <Icon as={FaMicrosoft} boxSize={4} />
                Microsoft
                <Icon as={FaArrowRight} boxSize={4} />
              </Button>

              <Text textAlign="center" fontSize="sm">
                <Link
                  color="blue.500"
                  textDecoration="underline"
                  onClick={onNext}
                  cursor="pointer"
                >
                  Create
                </Link>{" "}
                an Account
              </Text>
            </Stack>
          </form>
        </Box>

        {/* Footer - Social Icons */}
        <Flex gap={6} justifyContent="center" w="full" py={4}>
          <Icon as={FaFacebook} boxSize={6} color="black" cursor="pointer" />
          <Icon as={FaLinkedin} boxSize={6} color="black" cursor="pointer" />
          <Icon as={FaInstagram} boxSize={6} color="black" cursor="pointer" />
          <Icon as={FaEnvelope} boxSize={6} color="black" cursor="pointer" />
        </Flex>
      </Flex>

      {/* Desktop Layout */}
      <Flex
        display={{ base: "none", md: "flex" }}
        w="100%"
        h="100vh"
        minH="600px"
      >
        {/* Left Side */}
        <Flex
          w="50%"
          bg="white"
          direction="column"
          justifyContent="space-between"
          px={12}
          py={16}
        >
          <Box>
            <Heading
              fontSize={{ base: "3xl", lg: "4xl", xl: "5xl" }}
              fontWeight="bold"
              lineHeight="1.2"
              mb={6}
              color="black"
            >
              Welcome to Volunteer Portal by Community Counsel
            </Heading>
            <Text
              fontSize={{ base: "lg", lg: "xl" }}
              color="gray.700"
            >
              Log in using your CC Credentials. If you don't have one, click on the create link below. If you need to reset your password, click "Forgot Password".
            </Text>
          </Box>

          <Box>
            <Box mb={6}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Need help?
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                Visit our website
              </Text>
            </Box>
            <Link
              href="https://communitycounsel.org"
              color="blue.500"
              fontSize="lg"
              textDecoration="underline"
              mb={8}
              display="block"
            >
              Community Counsel Website
            </Link>
            <Flex gap={4}>
              <Icon as={FaFacebook} boxSize={6} color="black" cursor="pointer" />
              <Icon as={FaLinkedin} boxSize={6} color="black" cursor="pointer" />
              <Icon as={FaInstagram} boxSize={6} color="black" cursor="pointer" />
              <Icon as={FaEnvelope} boxSize={6} color="black" cursor="pointer" />
            </Flex>
          </Box>
        </Flex>

        {/* Right Side */}
        <Flex
          flex="1"
          bg="gray.50"
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
          px={12}
          pt={48}
        >
          <Box w="full" maxW="500px">
            <form onSubmit={handleSubmit(handleLogin)} style={{ width: "100%" }}>
              <Stack gap={6} w="full">
                <Field.Root invalid={!!errors.firstName} w="100%">
                  <Text fontWeight="medium" mb={2}>First Name</Text>
                  <Input
                    placeholder="Enter First Name"
                    type="text"
                    size="lg"
                    h="50px"
                    {...register("firstName")}
                    autoComplete="given-name"
                  />
                  <Field.ErrorText>
                    {errors.firstName?.message?.toString()}
                  </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.lastName} w="100%">
                  <Text fontWeight="medium" mb={2}>Last Name</Text>
                  <Input
                    placeholder="Enter Last Name"
                    type="text"
                    size="lg"
                    h="50px"
                    {...register("lastName")}
                    autoComplete="family-name"
                  />
                  <Field.ErrorText>
                    {errors.lastName?.message?.toString()}
                  </Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.password} w="100%">
                <Flex justifyContent="space-between" alignItems="center" mb={2} w="100%">
                  <Text fontWeight="medium">Password</Text>
                  
                  <Link
                    color="blue.500"
                    fontSize="sm"
                    textDecoration="underline"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Forgot Password?
                  </Link>
                </Flex>

                <Input
                  type="password"
                  placeholder="Enter Password"
                  size="lg"
                  h="50px"
                  {...register("password")}
                  autoComplete="current-password"
                />
                
                <Field.ErrorText>
                  {errors.password?.message?.toString()}
                </Field.ErrorText>
              </Field.Root>

                <Button
                  type="submit"
                  bg="blue.500"
                  color="white"
                  w="full"
                  h="50px"
                  fontSize="lg"
                  fontWeight="semibold"
                  borderRadius="sm"
                  _hover={{ bg: "blue.600" }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={2}
                  disabled={Object.keys(errors).length > 0}
                >
                  Login
                  <Icon as={FaArrowRight} boxSize={5} />
                </Button>

                <Text textAlign="center" color="gray.600" fontSize="sm">
                  or continue with
                </Text>

                <Button
                  bg="blue.500"
                  color="white"
                  w="full"
                  h="50px"
                  fontSize="lg"
                  fontWeight="semibold"
                  borderRadius="sm"
                  _hover={{ bg: "blue.600" }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={2}
                  onClick={handleGoogleLogin}
                  type="button"
                >
                  <Icon as={FaGoogle} boxSize={5} />
                  Google
                </Button>

                <Button
                  bg="blue.500"
                  color="white"
                  w="full"
                  h="50px"
                  fontSize="lg"
                  fontWeight="semibold"
                  borderRadius="sm"
                  _hover={{ bg: "blue.600" }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={2}
                  onClick={handleMicrosoftLogin}
                  type="button"
                >
                  <Icon as={FaMicrosoft} boxSize={5} />
                  Microsoft
                </Button>

                <Link
                  w="full"
                  justifyContent="center"
                  color="black"
                  fontSize="md"
                  textDecoration="underline"
                  onClick={onNext}
                  cursor="pointer"
                >
                  Create an Account
                </Link>
              </Stack>
            </form>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default LoginStep;
