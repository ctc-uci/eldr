import { React } from "react";

import {
  Field,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Link,
  SimpleGrid,
} from "@chakra-ui/react";

import { FaRegEye } from "react-icons/fa";

export const AccountManagement = () => {
  return (
    <SimpleGrid width={{base:"40%", md:"80%"}}
      columns={{base: 1, md: 2}}
      spacingX={20}
      spacingY={10}
      mb={20}>
      <Field.Root>
        <Field.Label fontWeight="bold">Email Address</Field.Label>
        <Input type="text" defaultValue="user@uci.edu" borderWidth="2px" borderColor="#000000" _hover="#000000" />
      </Field.Root>
      <Field.Root>
        <Field.Label fontWeight="bold">Password</Field.Label>
        <Flex align="center" gap={3}>
          <InputGroup flex="1" endElement={
            <IconButton variant="ghost" _hover={{ bg: "transparent" }} borderRadius="full" _active={{ transform: "scale(0.9)" }} aria-label="Toggle password" size="sm">
              <FaRegEye size={20} />
            </IconButton>
          }>
            <Input type="password" defaultValue="thisismypassword" borderWidth="2px" borderColor="#000000" _hover="#000000" />
          </InputGroup>
          <Link color="#2E52D6" fontSize="14px" fontWeight="semibold" textDecoration="underline" whiteSpace="nowrap">
            Reset Password
          </Link>
        </Flex>
      </Field.Root>
    </SimpleGrid>
  )
}