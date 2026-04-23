/*
Admin Navbar
TODO: Implement on all associated admin pages
*/

import { useLocation, Link as RouterLink } from "react-router-dom";
import { Avatar, Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { ClipboardList, Mails } from "lucide-react";
import { RxPeople } from "react-icons/rx";
import { LuTags } from "react-icons/lu";

export const AdminNavbar = () => {
  const location = useLocation();

  // Array of mapping icons
  const navItems = [
    { name: "Event Catalog", icon: ClipboardList, path: "/events" },
    { name: "Email Templates", icon: Mails, path: "/email" },
    { name: "Profiles", icon: RxPeople, path: "/volunteer-management" },
    { name: "Tags", icon: LuTags, path: "/tags" }
  ];

  return (
    <Flex
      direction="column"
      w="clamp(180px, 18vw, 250px)"
      flexShrink={0}
      // h="100vh"
      borderRight="1px solid"
      borderColor="gray.200"
      bg="white"
      py={8}
      justify="space-between"
    >
      <VStack gap={8} w="full" align="stretch">
        {/* ELDR Logo */}
        <Box px={6}>
          <Image
            src="/eldr-logo.png"
            alt="Elder Law & Disability Rights Center"
            h="clamp(48px, 4vw, 52px)"
            objectFit="contain"
          />
        </Box>

        {/* Nav Links */}
        <VStack gap={4} w="full" px={4} align="stretch">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const IconComponent = item.icon;

            return (
              // Use RouterLink as a pure wrapper to satisfy TypeScript
              <RouterLink
                to={item.path}
                key={item.name}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <HStack
                  w="full"
                  px="clamp(8px, 1vw, 16px)"
                  py={4}
                  borderRadius="md"
                  cursor="pointer"
                  gap={3}
                  bg={isActive ? "#D8F1FF" : "transparent"}
                  color={isActive ? "#5797BD" : "#294A5F"}
                  _hover={{
                    bg: isActive ? "#D8F1FF" : "gray.100",
                  }}
                >
                  <IconComponent size="clamp(18px, 1.5vw, 20px)" />
                  <Text
                    fontWeight="bold"
                    fontSize="clamp(14px, 1.2vw, 16px)"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {item.name}
                  </Text>
                </HStack>
              </RouterLink>
            );
          })}
        </VStack>
      </VStack>

      {/* Profile Picture */}
      <RouterLink to="/admin-profile" style={{ textDecoration: 'none', display: 'block' }}>
        <Box
          px="clamp(16px, 2vw, 20px)"
          cursor="pointer"
        >
          <Avatar.Root
            w="clamp(40px, 4vw, 48px)"
            h="clamp(40px, 4vw, 48px)"
          >
            <Avatar.Fallback name="Admin User" />
            <Avatar.Image src="" />
          </Avatar.Root>
        </Box>
      </RouterLink>
    </Flex>
  );
};
