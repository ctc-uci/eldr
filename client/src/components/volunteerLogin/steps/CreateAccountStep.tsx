import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

import {
  LuArrowRight,
  LuMail,
  LuUser,
  LuExternalLink
} from "react-icons/lu";

import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: (volunteerId: number) => void;
  onBack: () => void;
};

const CreateAccountStep = ({ onNext, onBack }: Props) => {
  const { backend } = useBackendContext();
  const { signup } = useAuthContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

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
    let createdFirebaseUid: string | null = null;
    try {
      const userCredential = await signup({
        email: normalizedEmail,
        password: "placeholder",
      });
      createdFirebaseUid = userCredential.user.uid;

      const resp = await backend.post("/volunteers", {
        firebaseUid: createdFirebaseUid,

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
      if (createdFirebaseUid) {
        try {
          // Roll back just-created Firebase/DB user if volunteer creation fails.
          await backend.delete(`/users/${createdFirebaseUid}`);
        } catch {
          // No-op: keep original error for user feedback.
        }
      }

      const err = e as {
        response?: { data?: { message?: string } | string };
        code?: string;
        message?: string;
      };
      if (err.code === "auth/email-already-in-use") {
        setErrorMsg("An account with this email already exists. Please log in.");
        return;
      }
      if (err.code === "auth/invalid-email") {
        setErrorMsg("Please enter a valid email address.");
        return;
      }


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
              >
                Community Counsel's Event Portal
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "22px" }}
                color="black"
              >
                Fill out the following information to start
                your account creation process {" "}

                <Link
                href="https://eldrcenter.org/"
                display="inline-flex"
                alignItems="center"
              >
                <LuExternalLink size={16} color="#3182CE"/>
              </Link>
              </Text>
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
                label={
                  <>
                    First Name <Box as="span" color="#991919"> *</Box>
                  </>
                }
              >
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
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
                label={
                  <>
                    Last Name <Box as="span" color="#991919"> *</Box>
                  </>
                }
              >
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
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
                label={
                  <>
                    Email <Box as="span" color="#991919"> *</Box>
                  </>
                }
              >
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter an email"
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

            <Button
              bg="white"
              borderColor="#E4E4E7"
              color="black"
              h={{ base: "40px", md: "48px" }}
              w="30vw"
              minW="320px"
              maxW="460px"
              borderRadius="8px"
              fontSize={{ base: "13px", md: "14px" }}
              fontWeight={600}
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
              onClick={handleContinue}
              loading={isSubmitting}
            >
              Continue
              <LuArrowRight size={16} />
            </Button>
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
  label: React.ReactNode;
  icon?: React.ReactNode;
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
