/*
Volunteer Navbar
Implement on all associated volunteer pages
*/

import { Avatar, Flex, HStack, Image, Link, Text } from "@chakra-ui/react";

import {ClipboardList } from "lucide-react";

export const Navbar = () => {
  return (
    <Flex
      as="nav"
      w="100%"
      h="128px"
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
          color="#1E3A8A"
          _hover={{ color: "#93C5FD", textDecoration: "none" }}
        >
          <ClipboardList size={18} />
          <Text>Event Catalog</Text>
        </Link>

        {/* PLACEHOLDER REPLACE WITH ACTUAL PFP*/}
        <Link href = "/volunteer-profile">
          <Avatar.Root size="sm">
            <Avatar.Fallback name="User" />
            <Avatar.Image src="" />
          </Avatar.Root>
        </Link>
      </HStack>
    </Flex>
  );
};
