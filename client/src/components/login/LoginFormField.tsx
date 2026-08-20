import { Box, Flex, Input, Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean | string;
  errorText?: string;
  rightElement?: React.ReactNode;
};

export const LoginFormField: React.FC<Props> = ({
  label,
  required = false,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  errorText,
  rightElement,
}) => {
  const isInvalid = Boolean(error || errorText);

  return (
    <Box w="30vw" minW="320px" maxW="460px">
      <Text
        fontSize={{ base: "13px", md: "14px" }}
        fontWeight="bold"
        color="black"
        mb="6px"
      >
        {label}
        {required && <Box as="span" color="#991919"> *</Box>}
      </Text>
      <Flex
        align="center"
        border="1px solid"
        borderColor={isInvalid ? "red.400" : "#E4E4E7"}
        borderRadius="6px"
        px="12px"
        h={{ base: "40px", md: "44px" }}
        gap="8px"
      >
        <Input
          type={type}
          placeholder={placeholder}
          border="none"
          outline="none"
          p="0"
          h="100%"
          fontSize="14px"
          color="black"
          _placeholder={{ color: "gray.400" }}
          focusRingColor="transparent"
          value={value}
          onChange={onChange}
          css={{ "&::-ms-reveal, &::-ms-clear": { display: "none" } }}
        />
        {rightElement}
      </Flex>
      {errorText && (
        <Text fontSize="12px" color="red.500" mt="4px">
          {errorText}
        </Text>
      )}
    </Box>
  );
};

export default LoginFormField;
