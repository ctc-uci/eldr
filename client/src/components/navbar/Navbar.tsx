/*
Volunteer Navbar
Implement on all associated volunteer pages
*/

import { Avatar, Flex, HStack, Image, Link, Text } from "@chakra-ui/react";
import { ClipboardList } from "lucide-react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { getLogoRootPath } from "@/utils/navigation";

export const Navbar = () => {
  const location = useLocation();

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
      <RouterLink to={getLogoRootPath(location.pathname)}>
        <Image
          src="/cc-logo-horizontal.svg"
          alt="Community Counsel"
          maxH="48px"
          maxW="260px"
          objectFit="contain"
        />
      </RouterLink>

      {/* Right side nav items */}
      <HStack gap="32px">
        <Link
          href="/event-catalog/all-events"
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          gap="8px"
          fontSize="14px"
          fontWeight={600}
          fontFamily="heading"
          color="#002992"
          _hover={{ color: "#15A9EA", textDecoration: "none" }}
        >
          <ClipboardList size={16} />
          <Text>Event Catalog</Text>
        </Link>

        {/* TODO: wire Avatar.Image to the volunteer's real profile photo */}
        <Link href="/volunteer-profile">
          <Avatar.Root size="md">
            <Avatar.Fallback name="User" />
            <Avatar.Image src="" />
          </Avatar.Root>
        </Link>
      </HStack>
    </Flex>
  );
};
