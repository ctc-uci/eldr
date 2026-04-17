/*
Volunteer Navbar
Implement on all associated volunteer pages
*/

import { Avatar, Flex, HStack, Image, Link, Text } from "@chakra-ui/react";

import { ClipboardList } from "lucide-react";

export const Navbar = () => {
  return (
    <Flex
      as="nav"
      w="100%"
      p={3}
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
        h="60px"
        objectFit="contain"
      />

      {/* Right side nav items */}
      <HStack gap="32px">
        <Link
          href="/event-catalog"
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          gap="8px"
          fontSize="14px"
          fontWeight={500}
          color="#173DA6"
          _hover={{ color: "#245eff", textDecoration: "none" }}
        >
          <ClipboardList size={16} />
          <Text>Event Catalog</Text>
        </Link>

        {/* PLACEHOLDER REPLACE WITH ACTUAL PFP*/}
        <Link href="/volunteer-profile">
          <Avatar.Root size="md">
            <Avatar.Fallback name="User" />
            <Avatar.Image src="/volunteer.jpg" />
          </Avatar.Root>
        </Link>
      </HStack>
    </Flex>
  );
};
