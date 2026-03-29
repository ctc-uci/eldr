import { useState } from "react";

import {
  Box,
  Field,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaRegEye } from "react-icons/fa";

export const AccountManagement = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.100"
      p={{ base: 5, md: 8 }}
    >
      <Text fontWeight="bold" fontSize="lg" mb={6} color="gray.900">
        Account Settings
      </Text>
      <Text fontSize="sm" color="gray.600" mb={6}>
        Sign-in and security options. Backend wiring will be added later.
      </Text>

      <VStack gap={6} align="stretch" maxW="md">
        <Field.Root>
          <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
            Email Address
          </Text>
          <Input type="email" defaultValue="peteranteater@uci.edu" />
        </Field.Root>

        <Field.Root>
          <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
            Password
          </Text>
          <Flex align="center" gap={3} flexWrap="wrap">
            <InputGroup flex="1" minW="200px" endElement={
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword((s) => !s)}
              >
                <FaRegEye size={18} />
              </IconButton>
            }
            >
              <Input
                type={showPassword ? "text" : "password"}
                defaultValue="thisismypassword"
              />
            </InputGroup>
            <Link
              href="/login"
              fontSize="sm"
              fontWeight="semibold"
              color="blue.600"
              textDecoration="underline"
              whiteSpace="nowrap"
            >
              Reset Password
            </Link>
          </Flex>
        </Field.Root>
      </VStack>
    </Box>
  );
};
