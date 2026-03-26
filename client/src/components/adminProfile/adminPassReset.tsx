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

import {
  FaArrowRight,
  FaInfoCircle,
  FaInstagram,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { HiOutlineKey } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import logo from "./ELDR_Logo.png";

export const AdminPassReset: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state: { email: string; from?: string } | null;
  };

  const email = state?.email ?? "";
  const loginRoute = state?.from === "volunteer" ? "/volunteerLogin" : "/adminLogin";

  const { backend } = useBackendContext();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mismatchError, setMismatchError] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const matching = newPassword === confirmPassword;

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
      <VStack minH="80vh" borderRadius="sm" borderWidth="1px" borderColor="#E4E4E7" zIndex={1} gap={0}>
        <Flex w="80vw" bg="#F6F6F6" h="70px" align="left" px="2%" py="1%">
          <Image src={logo} />
        </Flex>

        <Flex flex="1" w="100%" bg="white">
          <VStack align="left" width="50%" px="5%" gap={1}>
            <Text fontWeight="bold" fontSize="30px" pt="15%">
              Community Counsel Password Manager
            </Text>
            <Text mb={6} pt="10%">
              Enter your new password below, and confirm where prompted.
            </Text>
            <Text mb={6}>
              Recommended: minimum 8 characters with 1 special character.
            </Text>
            <Text fontWeight="bold" pt="10%">Need help?</Text>
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
            <HStack pt="15%" align="left">
              <IconButton boxSize="20px" as={FiFacebook} variant="ghost"
                onClick={() => window.open("https://www.facebook.com/ELDRCenter/photos/")}
                _hover={{ bg: "white" }} />
              <IconButton boxSize="20px" as={FiLinkedin} variant="ghost"
                onClick={() => window.open("https://www.linkedin.com/company/elderlawanddisabilityrightscenter/")}
                _hover={{ bg: "white" }} />
              <IconButton boxSize="20px" as={FaInstagram} variant="ghost"
                onClick={() => window.open("https://www.instagram.com/eldr_center/?hl=en")}
                _hover={{ bg: "white" }} />
              <IconButton boxSize="20px" as={MdOutlineEmail} variant="ghost"
                _hover={{ bg: "white" }} />
            </HStack>
          </VStack>

          <Separator orientation="vertical" />

          <VStack w="50%" bg="#FFFFFF" h="100%" align="left" justify="center" px="5%" py="10%">
            {resetSuccess ? (
              <>
                <Box
                  bg="#F0FFF4"
                  border="1px solid"
                  borderColor="green.200"
                  borderRadius="md"
                  p={4}
                  w="80%"
                  mb={4}
                >
                  <HStack align="flex-start" gap={3}>
                    <Icon as={FaInfoCircle} color="green.600" mt="2px" flexShrink={0} />
                    <VStack align="left" gap={0}>
                      <Text fontWeight="bold" color="green.700">Password updated.</Text>
                      <Text color="green.700">
                        Use your new credentials to log in to portal.
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                <Button
                  position="relative"
                  bg="#3182CE"
                  color="white"
                  w="80%"
                  h="50px"
                  borderRadius="md"
                  _hover={{ bg: "#5797BD" }}
                  mb={4}
                  onClick={() => navigate(loginRoute)}
                >
                  Return to Login
                  <Icon
                    as={FaArrowRight}
                    position="absolute"
                    right="16px"
                    top="50%"
                    transform="translateY(-50%)"
                  />
                </Button>

                <Text fontSize="sm" color="gray.600">
                  Go back to{" "}
                  <Link color="#3182CE" textDecoration="underline" href={loginRoute}>
                    Login Portal
                  </Link>
                </Text>
              </>
            ) : (
              <>
                <Field.Root w="80%" mb={4}>
                  <Field.Label fontWeight="bold">New Password</Field.Label>
                  <InputGroup
                    startElement={<HiOutlineKey />}
                    endElement={
                      newPassword ? (
                        <IconButton
                          variant="ghost"
                          boxSize="20px"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          aria-label="Toggle password visibility"
                          _hover={{ bg: "white" }}
                        >
                          {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </IconButton>
                      ) : null
                    }
                  >
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      borderRadius="md"
                      _placeholder={{ color: "#A1A1AA", opacity: 1 }}
                      css={{ "&::-ms-reveal, &::-ms-clear": { display: "none" } }}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setMismatchError(false);
                      }}
                    />
                  </InputGroup>
                </Field.Root>

                <Field.Root invalid={mismatchError} w="80%" mb={4}>
                  <Field.Label fontWeight="bold">Confirm Password</Field.Label>
                  <InputGroup
                    startElement={<HiOutlineKey />}
                    endElement={
                      confirmPassword ? (
                        <IconButton
                          variant="ghost"
                          boxSize="20px"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          aria-label="Toggle password visibility"
                          _hover={{ bg: "white" }}
                        >
                          {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </IconButton>
                      ) : null
                    }
                  >
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      borderRadius="md"
                      _placeholder={{ color: "#A1A1AA", opacity: 1 }}
                      css={{ "&::-ms-reveal, &::-ms-clear": { display: "none" } }}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setMismatchError(false);
                      }}
                    />
                  </InputGroup>
                  <Field.ErrorText>Passwords do not match.</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={submitError} w="80%" mb={4}>
                  <Button
                    position="relative"
                    variant="outline"
                    borderRadius="md"
                    background={newPassword && confirmPassword ? "#3182CE" : "#D4D4D8"}
                    w="100%"
                    h="50px"
                    color="white"
                    disabled={!newPassword || !confirmPassword}
                    _hover={newPassword && confirmPassword ? { bg: "#5797BD" } : {}}
                    onClick={async () => {
                      if (!matching) {
                        setMismatchError(true);
                        return;
                      }
                      try {
                        await backend.put("/users/update-password", {
                          email,
                          newPassword,
                        });
                        setResetSuccess(true);
                      } catch {
                        setSubmitError(true);
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
                  <Field.ErrorText>Failed to update password. Please try again.</Field.ErrorText>
                </Field.Root>

                <Text fontSize="sm" color="gray.600">
                  Go back to{" "}
                  <Link color="#3182CE" textDecoration="underline" href={loginRoute}>
                    Login Portal
                  </Link>
                </Text>
              </>
            )}
          </VStack>
        </Flex>

        <Flex w="80vw" bg="#F6F6F6" h="70px" />
      </VStack>
    </Flex>
  );
};
