import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Link,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { FaFacebook, FaLinkedin, FaInstagram, FaEnvelope, FaArrowRight, FaMicrosoft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type Props = {
  onNext: () => void;
  onSuccess: () => void;
};

const LoginStep = ({ onNext, onSuccess }: Props) => {
  return (
    <Flex
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
          <Stack gap={6} w="full">
            <Box>
              <Text fontWeight="medium" mb={2}>First Name</Text>
              <Input
                placeholder="Enter First Name"
                size="lg"
                h="50px"
              />
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>Last Name</Text>
              <Input
                placeholder="Enter Last Name"
                size="lg"
                h="50px"
              />
            </Box>

            <Box>
              <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Text fontWeight="medium">Password</Text>
                <Link
                  color="blue.500"
                  fontSize="sm"
                  textDecoration="none"
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
              />
            </Box>

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
              onClick={onSuccess}
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
              justifyContent="space-between"
              alignItems="center"
              px={6}
            >
              <Icon as={FcGoogle} boxSize={5} />
              <Text flex="1" textAlign="center">
                Google
              </Text>
              <Icon as={FaArrowRight} boxSize={5} />
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
              justifyContent="space-between"
              alignItems="center"
              px={6}
            >
              <Icon as={FaMicrosoft} boxSize={5} />
              <Text flex="1" textAlign="center">
                Microsoft
              </Text>
              <Icon as={FaArrowRight} boxSize={5} />
            </Button>

            <Link
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
        </Box>
      </Flex>
    </Flex>
  );
};

export default LoginStep;
