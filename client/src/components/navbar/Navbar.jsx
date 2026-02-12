import React from "react";

import {
  Avatar,
  Flex,
  HStack,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";

import { LuCalendarDays, LuBriefcase } from "react-icons/lu";

export const Navbar = () => {
  return (
    <Flex
      as="nav"
      w="100%"
      h="64px"
      px="32px"
      align="center"
      justify="space-between"
      bg="white"
      borderBottomWidth="1px"
      borderColor="#E5E7EB"
      flexShrink={0}
    >
      {/* Logo */}
      <Image
        src="/eldr-logo.png"
        alt="Elder Law & Disability Rights Center"
        h="44px"
        objectFit="contain"
      />

      {/* Right side nav items */}
      <HStack gap="32px">
        <Link
          href="/event-catalog"
          display="flex"
          alignItems="center"
          gap="8px"
          fontSize="14px"
          fontWeight={500}
          color="#374151"
          _hover={{ color: "#111827", textDecoration: "none" }}
        >
          <LuCalendarDays size={18} />
          <Text>Events</Text>
        </Link>

        <Link
          href="/cases"
          display="flex"
          alignItems="center"
          gap="8px"
          fontSize="14px"
          fontWeight={500}
          color="#374151"
          _hover={{ color: "#111827", textDecoration: "none" }}
        >
          <LuBriefcase size={18} />
          <Text>Cases</Text>
        </Link>

        <Avatar.Root size="sm">
          <Avatar.Fallback name="User" />
          <Avatar.Image src="" />
        </Avatar.Root>
      </HStack>
    </Flex>
  );
};
