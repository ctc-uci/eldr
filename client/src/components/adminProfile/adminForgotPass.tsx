import { useEffect, useState } from "react";

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
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { FaArrowRight, FaInstagram } from "react-icons/fa";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";

import logo from "./ELDR_Logo.png";

export const AdminForgotPass: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") ?? "admin";
  const loginRoute = from === "volunteer" ? "/volunteerLogin" : "/adminLogin";

  const { backend } = useBackendContext();
  const [email, setEmail] = useState("");
  const [currUsers, setCurrUsers] = useState([]);
  const [emailError, setEmailError] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await backend.get("/users");
      setCurrUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const expectedRole = from === "volunteer" ? "user" : "admin";

  const verifyEmail = (
    emailToCheck: string,
    users: { email: string; role: string }[]
  ) => {
    return users.some(
      (curr) => curr.email === emailToCheck && curr.role === expectedRole
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Flex
      minH="100vh"
      w="100%"
      bg="white"
      align="center"
      justify="center"
      position="relative"
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
        borderWidth="1px"
        borderRadius="sm"
        borderColor="#E4E4E7"
        zIndex={1}
        gap={0}
      >
        <Flex
          w="80vw"
          bg="#F6F6F6"
          h="70px"
          align="left"
          px="2%"
          py="1%"
        >
          <Image src={logo} />
        </Flex>
        <Flex
          flex="1"
          w="100%"
          bg="white"
        >
          <VStack
            align="left"
            width="50%"
            px="5%"
            gap={1}
          >
            <Text
              fontWeight="bold"
              fontSize="30px"
              pt="15%"
              pb="10%"
            >
              Account Confirmation Verification
            </Text>
            <Text mb={6} pb="15%">
              Enter your ELDR account email and we'll send you a link to reset
              your password.
            </Text>
            <Text fontWeight="bold">Need help?</Text>
            <Text fontWeight="bold">Visit our website</Text>
            <Link
              textDecoration="underline"
              color="#3182CE"
              bg="white"
              href="https://eldrcenter.org/"
              pt="2%"
            >
              Community Counsel Website
            </Link>
            <HStack pt="15%" align="left" gap={0}>
              <IconButton
                boxSize="20px"
                as={FiFacebook}
                variant="ghost"
                onClick={() =>
                  window.open("https://www.facebook.com/ELDRCenter/photos/")
                }
                _hover={{ bg: "white" }}
              />
              <IconButton
                boxSize="20px"
                as={FiLinkedin}
                variant="ghost"
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/company/elderlawanddisabilityrightscenter/"
                  )
                }
                _hover={{ bg: "white" }}
              />
              <IconButton
                boxSize="20px"
                as={FaInstagram}
                variant="ghost"
                onClick={() =>
                  window.open("https://www.instagram.com/eldr_center/?hl=en")
                }
                _hover={{ bg: "white" }}
              />
              <IconButton
                boxSize="20px"
                as={MdOutlineEmail}
                variant="ghost"
                _hover={{ bg: "white" }}
              />
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
            <Field.Root invalid={emailError} w="30vw" mb={4}>
              <Field.Label fontWeight="bold">Email</Field.Label>
              <InputGroup startElement={<MdOutlineEmail />}>
                <Input
                  placeholder="Enter an email"
                  height="40px"
                  variant="outline"
                  borderRadius="md"
                  _placeholder={{ color: "#A1A1AA", opacity: 1 }}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                  }}
                />
              </InputGroup>
              <Field.ErrorText>
                No account with that email exists for this portal.
              </Field.ErrorText>
            </Field.Root>

            <Button
              position="relative"
              variant="outline"
              borderRadius="md"
              background={email ? "#3182CE" : "#D4D4D8"}
              w="30vw"
              h="3vw"
              color="white"
              disabled={!email}
              _hover={email ? { bg: "#5797BD" } : {}}
              mb={4}
              onClick={() => {
                const valid = verifyEmail(email, currUsers);
                if (valid) {
                  navigate("/adminPassReset", { state: { email, from } });
                } else {
                  setEmailError(true);
                }
              }}
            >
              Continue
              <Icon
                as={FaArrowRight}
                position="absolute"
                right="16px"
                top="50%"
                transform="translateY(-50%)"
              />
            </Button>

            <Flex align="center" justify="center">
              <Text fontSize="sm">
                Go back to{" "}
                <Link
                  color="#3182CE"
                  textDecoration="underline"
                  href={loginRoute}
                >
                  Login Portal
                </Link>
              </Text>
            </Flex>
          </VStack>
        </Flex>
        <Flex w="80vw" bg="#F6F6F6" h="70px" />
      </VStack>
    </Flex>
  );
};
