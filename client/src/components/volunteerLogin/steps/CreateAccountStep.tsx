import {useState} from "react";
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

import {useBackendContext} from "@/contexts/hooks/useBackendContext";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const BAR_HEIGHT = "70.54px";
const BAR_BG = "#E8E8E8";

const CreateAccountStep = ({ onNext, onBack }: Props) => {
  const {backend} = useBackendContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleContinue = async () => {
      setErrorMsg(null);

      if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        setErrorMsg("Please fill out first name, last name, and email.");
        return;
      }

      setIsSubmitting(true);
      try {
        await backend.post("/volunteers", {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),

          phone_number: null,
          form_completed: false,
          form_link: null,
          // need to figure out what this does
          is_signed_confidentiality: new Date().toISOString(),
          is_attorney: false,
          is_notary: false,
        });


        onNext();
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Failed to create account.";
        setErrorMsg(typeof msg === "string" ? msg : "Failed to create account.");
      } finally {
        setIsSubmitting(false);
      }
    };
  return (
    <LoginLayout>
      <Flex
        w="1091.62px"
        h="914.39px"
        bg="#FFFFFF"
        borderRadius="4.41px"
        border="1px solid"
        borderColor="#E4E4E7"
        overflow="hidden"
        direction="column"
      >
        {/* Top bar */}
        <Flex
          w="100%"
          h={BAR_HEIGHT}
          bg={BAR_BG}
          flexShrink={0}
          align="center"
          px="24px"
        >
          <Image
            src={logo}
            alt="ELDR Logo"
            h="45px"
            objectFit="contain"
          />
        </Flex>

        <Flex
          flex="1"
          overflow="hidden"
        >
          {/* Left side */}
          <Flex
            direction="column"
            justify="space-between"
            w="50%"
            p="60px"
            borderRight="1px solid"
            borderColor="#E4E4E7"
          >
            <Box>
              <Heading
                fontSize="30px"
                fontWeight={700}
                color="black"
                mb="20px"
              >
                Community Counsel Account Manager
              </Heading>
              <Text
                fontSize="20px"
                color="gray.600"
              >
                Begin creating your volunteer profile by entering the
                information prompted.
              </Text>
            </Box>

            <Box>
              <Text
                fontWeight={700}
                fontSize="22px"
                color="black"
              >
                Need help?
              </Text>
              <Text
                fontWeight={700}
                fontSize="22px"
                color="black"
                mb="8px"
              >
                Visit our website
              </Text>
              <Link
                href="#"
                color="blue.500"
                fontSize="20px"
                textDecoration="underline"
              >
                Community Counsel Website
              </Link>

              <HStack
                gap="16px"
                mt="32px"
              >
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuFacebook size={22} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <FiLinkedin size={22} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <BsInstagram size={22} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuMail size={22} />
                </Box>
              </HStack>
            </Box>
          </Flex>

          {/* Right side - form */}
          <Flex
            direction="column"
            justify="center"
            w="50%"
            p="60px"
            gap="16px"
          >
            {/* First Name */}
            <Box>
              <Text fontSize="14px" fontWeight={500} color="black" mb="6px">
                First Name
              </Text>
              <Flex align="center" border="1px solid" borderColor="#E4E4E7" borderRadius="6px" px="12px" h="44px" gap="8px">
                <LuUser size={16} color="#9CA3AF" />
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
              </Flex>
            </Box>

            {/* Last Name */}
            <Box>
              <Text fontSize="14px" fontWeight={500} color="black" mb="6px">
                Last Name
              </Text>
              <Flex align="center" border="1px solid" borderColor="#E4E4E7" borderRadius="6px" px="12px" h="44px" gap="8px">
                <LuUser size={16} color="#9CA3AF" />
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
              </Flex>
            </Box>
            {/* Email */}
            <Box>
              <Text fontSize="14px" fontWeight={500} color="black" mb="6px">
                Email
              </Text>
              <Flex align="center" border="1px solid" borderColor="#E4E4E7" borderRadius="6px" px="12px" h="44px" gap="8px">
                <LuMail size={16} color="#9CA3AF" />
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
              </Flex>
            </Box>

            {/* Password */}
            <Box>
              <Text fontSize="14px" fontWeight={500} color="black" mb="6px">
                Password
              </Text>
              <Flex align="center" border="1px solid" borderColor="#E4E4E7" borderRadius="6px" px="12px" h="44px" gap="8px">
                <LuKeyRound size={16} color="#9CA3AF" />
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
              </Flex>
            </Box>

            {/* Continue button */}
            <Button
              bg="#4A90D9"
              color="white"
              h="48px"
              borderRadius="6px"
              fontSize="14px"
              fontWeight={500}
              _hover={{ bg: "#3a7bc8" }}
              justifyContent="space-between"
              px="20px"
              mt="4px"
              onClick={handleContinue}
              loading={isSubmitting}
            >
              Continue
              <LuArrowRight size={16} />
            </Button>

            <Text fontSize="13px" color="gray.500" textAlign="center">
              Didn't mean to come here?{" "}
              <Link
                href="#"
                color="blue.500"
                textDecoration="underline"
                onClick={onBack}
              >
                Go back
              </Link>
            </Text>
          </Flex>
        </Flex>

        <Box w="100%" h={BAR_HEIGHT} bg={BAR_BG} flexShrink={0} />
      </Flex>
    </LoginLayout>
  );
};

export default CreateAccountStep;