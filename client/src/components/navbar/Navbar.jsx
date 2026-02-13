import React from "react";

import {
  Avatar,
  Flex,
  HStack,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";

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
          <Image src="/clipboard-list.svg" alt="Events" w="18px" h="18px" />
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
          <Image src="/briefcase-business.svg" alt="Cases" w="18px" h="18px" />
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
