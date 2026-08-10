import { Box, Button, Flex, Image, Separator, Text } from "@chakra-ui/react";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { LuArrowRight } from "react-icons/lu";
import microsoft from "@/assets/microsoft_logo.svg";

type Props = {
  onGoogleLogin: () => void | Promise<void>;
  onMicrosoftLogin: () => void | Promise<void>;
  ssoError?: string;
};

export const LoginSSOButtons: React.FC<Props> = ({
  onGoogleLogin,
  onMicrosoftLogin,
  ssoError,
}) => {
  return (
    <>
      <Flex align="center" gap="3" w="30vw" minW="320px" maxW="460px">
        <Separator flex="1" borderColor="#E4E4E7" />
        <Text
          fontSize={{ base: "12px", md: "14px" }}
          color="black"
          fontWeight="bold"
        >
          or continue with
        </Text>
        <Separator flex="1" borderColor="#E4E4E7" />
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
        onClick={onGoogleLogin}
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
        onClick={onMicrosoftLogin}
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
    </>
  );
};

export default LoginSSOButtons;
