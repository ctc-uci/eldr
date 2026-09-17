import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";

import {
  LuExternalLink,
} from "react-icons/lu";

import LoginLayout from "./BackgroundLayout";
import { loadDraft, saveDraft } from "../volunteerSignupDraft";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { TopBackButton, ContinueButton } from "../NavigationButtons";

type Props = {
  onNext: () => void;
  onBack?: () => void;
};

const CreateAccountStep = ({ onNext, onBack }: Props) => {
  const { backend } = useBackendContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  useEffect(() => {
    localStorage.removeItem("volunteerId");
    const d = loadDraft();
    if (d) {
      setFirstName(d.firstName);
      setLastName(d.lastName);
      setEmail(d.email);
    }
  }, []);

  const isValidEmail = (value: string) => {
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

    setIsCheckingEmail(true);
    try {
      const checkResp = await backend.get("/users/check-email", {
        params: { email: normalizedEmail },
      });
      if (checkResp.data?.exists) {
        setErrorMsg(
          "An account with this email already exists. Please log in instead, or use a different email."
        );
        setIsCheckingEmail(false);
        return;
      }
    } catch {
      // If check endpoint errors, do not block signup
    } finally {
      setIsCheckingEmail(false);
    }

    saveDraft({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
    });
    onNext();
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
        <Flex
          w="100%"
          h="70px"
          bg="#F6F6F6"
          flexShrink={0}
          align="center"
          px={{ base: "16px", md: "24px" }}
        >
          <TopBackButton label="Back to Login" onClick={onBack} />
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
            <Box maxW="450px">
              <Heading
                fontSize={{ base: "17px", md: "22px", lg: "32px" }}
                fontWeight={700}
                color="black"
                mb="20px"
                lineHeight="1.2"
              >
                Community Counsel's Event Portal
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "24px" }}
                color="black"
              >
                Fill out the following information to start your account creation
                process{" "}
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

            <Box
              w="30vw"
              minW="320px"
              maxW="460px"
            >
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

            <Box
              w="30vw"
              minW="320px"
              maxW="460px"
            >
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

            <Box
              w="30vw"
              minW="320px"
              maxW="460px"
            >
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

            <ContinueButton
              onClick={handleContinue}
              loading={isCheckingEmail}
              disabled={isCheckingEmail}
              mt="4px"
            />

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
