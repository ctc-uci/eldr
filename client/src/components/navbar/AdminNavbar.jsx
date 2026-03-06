import { useState } from "react";

import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";

import {
  BriefcaseBusiness,
  CircleUser,
  ClipboardList,
  Mails,
  Tag,
} from "lucide-react";

export const AdminNavbar = () => {
  const [activeItem, setActiveItem] = useState("Event Catalog");

  // Array mapping icons
  const navItems = [
    { name: "Event Catalog", icon: ClipboardList, path: "/events" },
    { name: "Case Catalog", icon: BriefcaseBusiness, path: "/cases" },
    { name: "Email Template", icon: Mails, path: "/emails" },
    { name: "Profile Manage", icon: CircleUser, path: "/profiles" },
    { name: "Tags", icon: Tag, path: "/tags" }
  ];
  return (
    <Flex
      direction="column"
      w="clamp(180px, 18vw, 250px)"
      flexShrink={0}
      h="100vh"
      borderRight="1px solid"
      borderColor="gray.200"
      bg="white"
      py={8}
      justify="space-between"
    >
      {/* Top Section: Logo & Nav Items */}
      <VStack
        gap={8}
        w="full"
        align="stretch"
      >
        {/* ELDR Logo */}
        <Box px={6}>
          <Image
            src="/eldr-logo.png"
            alt="Elder Law & Disability Rights Center"
            h="clamp(32px, 4vw, 44px)"
            objectFit="contain"
          />
        </Box>

        {/* Nav Links */}
        <VStack
          gap={4}
          w="full"
          px={4}
          align="stretch"
        >
          {navItems.map((item) => {
            const isActive = activeItem === item.name;
            const IconComponent = item.icon;

            return (
              <HStack
                key={item.name}
                w="full"
                as="a"
                px="clamp(8px, 1vw, 16px)"
                py={3}
                borderRadius="md"
                cursor="pointer"
                gap={3}
                onClick={() => setActiveItem(item.name)}
                bg={isActive ? "#D8F1FF" : "transparent"}
                color={isActive ? "#5797BD" : "#294A5F"}
                _hover={{ bg: isActive ? "#D8F1FF" : "gray.100" }}
              >
                <IconComponent size="clamp(16px, 1.5vw, 18px)" />
                <Text
                  fontWeight="semibold"
                  fontSize="clamp(12px, 1.2vw, 14px)"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {item.name}
                </Text>
              </HStack>
            );
          })}
        </VStack>
      </VStack>

      {/* User Profile */}
      <Box
        px="clamp(16px, 2vw, 24px)"
        cursor="pointer"
      >
        <Box
          // Scale the avatar size
          w="clamp(32px, 3vw, 40px)"
          h="clamp(32px, 3vw, 40px)"
          borderRadius="full"
          bg="gray.300"
          overflow="hidden"
        />
      </Box>
    </Flex>
  );
};
