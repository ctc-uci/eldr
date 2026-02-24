import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import {
  LuArrowRight,
  LuFacebook,
  LuKeyRound,
  LuMail,
  LuUser,
} from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: (volunteerId: number) => void;
  onBack: () => void;
};

const CreateAccountStep = ({ onNext, onBack }: Props) => {
  const { backend } = useBackendContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const isValidEmail = (value: string) => {
    // simple check, good enough for UI validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleContinue = async () => {
    setErrorMsg(null);

    if (!firstName.trim() || !lastName.trim() || !normalizedEmail) {
      setErrorMsg("Please fill out first name, last name, and email.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await backend.post("/volunteers", {
        // Replace with the real firebase uid once login flow is wired.
        firebaseUid: 12,

        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: normalizedEmail,

        phone_number: null,
        form_completed: false,
        form_link: null,

        is_signed_confidentiality: new Date().toISOString(),
        is_attorney: false, // ignoring
        is_notary: false, // updated later in NotaryStep
      });

      const volunteerId = resp?.data?.id;
      if (!volunteerId) {
        throw new Error("Volunteer created but no id returned.");
      }

      localStorage.setItem("volunteerId", String(volunteerId));
      onNext(volunteerId);
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { message?: string } | string };
        message?: string;
      };
      const msg =
        (typeof err.response?.data === "object" ? err.response?.data?.message : undefined) ||
        err.response?.data ||
        err.message ||
        "Failed to create account.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* Top bar */}
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
          {/* Left side */}
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
                fontSize={{ base: "18px", md: "22px", lg: "30px" }}
                fontWeight={700}
                color="black"
                mb="16px"
              >
                Community Counsel Account Manager
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
                color="gray.600"
              >
                Begin creating your volunteer profile by entering the
                information prompted.
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
                mt={{ base: "20px", md: "24px" }}
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

          {/* Right side */}
          <Flex
            direction="column"
            justify="center"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="10%"
            gap={{ base: "12px", md: "16px" }}
            align="center"
          >
            {errorMsg && (
              <Box
                w="30vw"
                minW="320px"
                maxW="460px"
                border="1px solid"
                borderColor="red.200"
                bg="red.50"
                p="10px"
                borderRadius="8px"
              >
                <Text
                  color="red.700"
                  fontSize="14px"
                >
                  {errorMsg}
                </Text>
              </Box>
            )}

            <Box w="30vw" minW="320px" maxW="460px">
              <Field
                label="First Name"
                icon={
                  <LuUser
                    size={16}
                    color="#9CA3AF"
                  />
                }
              >
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter First Name"
                  border="none"
                  p="0"
                  h="100%"
                  fontSize="14px"
                  color="black"
                  _placeholder={{ color: "gray.400" }}
                  focusRingColor="transparent"
                />
              </Field>
            </Box>

            <Box w="30vw" minW="320px" maxW="460px">
              <Field
                label="Last Name"
                icon={
                  <LuUser
                    size={16}
                    color="#9CA3AF"
                  />
                }
              >
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter Last Name"
                  border="none"
                  p="0"
                  h="100%"
                  fontSize="14px"
                  color="black"
                  _placeholder={{ color: "gray.400" }}
                  focusRingColor="transparent"
                />
              </Field>
            </Box>

            <Box w="30vw" minW="320px" maxW="460px">
              <Field
                label="Email"
                icon={
                  <LuMail
                    size={16}
                    color="#9CA3AF"
                  />
                }
              >
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  type="email"
                  border="none"
                  p="0"
                  h="100%"
                  fontSize="14px"
                  color="black"
                  _placeholder={{ color: "gray.400" }}
                  focusRingColor="transparent"
                />
              </Field>
            </Box>

            <Box w="30vw" minW="320px" maxW="460px">
              <Field
                label="Password"
                icon={
                  <LuKeyRound
                    size={16}
                    color="#9CA3AF"
                  />
                }
              >
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  type="password"
                  border="none"
                  p="0"
                  h="100%"
                  fontSize="14px"
                  color="black"
                  _placeholder={{ color: "gray.400" }}
                  focusRingColor="transparent"
                />
              </Field>
            </Box>

            <Button
              bg="#3182CE"
              color="white"
              h={{ base: "40px", md: "48px" }}
              w="30vw"
              minW="320px"
              maxW="460px"
              borderRadius="8px"
              fontSize={{ base: "13px", md: "14px" }}
              fontWeight={600}
              _hover={{ bg: "#5797BD" }}
              justifyContent="space-between"
              px="20px"
              mt="4px"
              onClick={handleContinue}
              loading={isSubmitting}
            >
              Continue
              <LuArrowRight size={16} />
            </Button>

            <Text
              fontSize="13px"
              color="gray.500"
              textAlign="center"
              w="30vw"
              minW="320px"
              maxW="460px"
            >
              Didn&apos;t mean to come here?{" "}
              <Link
                href="#"
                color="#3182CE"
                textDecoration="underline"
                onClick={onBack}
              >
                Go back
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

const Field = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Box>
    <Text
      fontSize="14px"
      fontWeight={600}
      color="black"
      mb="6px"
    >
      {label}
    </Text>
    <Flex
      align="center"
      border="1px solid"
      borderColor="#E4E4E7"
      borderRadius="10px"
      px="12px"
      h={{ base: "40px", md: "44px" }}
      gap="8px"
    >
      {icon}
      {children}
    </Flex>
  </Box>
);

export default CreateAccountStep;
