/*
Collapsed Navbar
Staff portal collapsed navigation sidebar
*/

import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Image,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ClipboardList, Users } from "lucide-react";
import { LuMails, LuTags } from "react-icons/lu";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";

import { getLogoRootPath } from "@/utils/navigation";

type CollapsedNavbarProps = {
  onExpand: () => void;
};

export const CollapsedNavbar = ({ onExpand }: CollapsedNavbarProps) => {
  const location = useLocation();

  const navItems = [
    { name: "Event Catalog", icon: ClipboardList, path: "/events" },
    { name: "Email Templates", icon: LuMails, path: "/email" },
    { name: "Profiles", icon: Users, path: "/volunteer-management" },
    { name: "Tags", icon: LuTags, path: "/manage-tags" },
  ];

  return (
    <Flex
      direction="column"
      w="80px"
      h="100vh"
      flexShrink={0}
      borderRight="1px solid"
      borderColor="gray.200"
      bg="white"
      px={2}
      py={8}
      justify="space-between"
    >
      <VStack
        gap={8}
        w="full"
        align="center"
      >
        {/* ELDR Logo */}
        <Box h="72px" display="flex" alignItems="center" justifyContent="center" w="full">
          <RouterLink
            to={getLogoRootPath(location.pathname)}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Image
              src="/cc-logo.svg"
              alt="Logo"
              maxH="44px"
              maxW="44px"
              objectFit="contain"
            />
          </RouterLink>
        </Box>

        {/* Nav Links */}
        <VStack gap={8} w="full" px={2} align="center">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const IconComponent = item.icon;

            return (
              <RouterLink
                to={item.path}
                key={item.name}
                title={item.name}
                style={{ textDecoration: "none", display: "block" }}
              >
                <Flex
                  w="48px"
                  h="56px"
                  borderRadius="md"
                  cursor="pointer"
                  align="center"
                  justify="center"
                  bg={isActive ? "#E8F6FC" : "transparent"}
                  color={isActive ? "#002992" : "#4A5568"}
                  _hover={{
                    bg: isActive ? "#E8F6FC" : "gray.100",
                  }}
                  transition="background-color 0.15s ease"
                >
                  <IconComponent
                    size="clamp(18px, 1.5vw, 20px)"
                    color={isActive ? "#002992" : "#4A5568"}
                  />
                </Flex>
              </RouterLink>
            );
          })}
        </VStack>
      </VStack>

      <VStack gap={4} align="center">
        <IconButton
          aria-label="Expand navigation button"
          title="Expand navigation button"
          variant="ghost"
          onClick={onExpand}
          color="#4A5568"
          _hover={{
            bg: "gray.100",
          }}
        >
          <TbLayoutSidebarLeftExpand size={22} />
        </IconButton>

        <RouterLink
          to="/admin-profile"
          style={{ textDecoration: "none", display: "block" }}
        >
          <Box cursor="pointer">
            <Avatar.Root
              w="clamp(40px, 4vw, 48px)"
              h="clamp(40px, 4vw, 48px)"
            >
              <Avatar.Fallback name="Admin User" />
              <Avatar.Image src="" />
            </Avatar.Root>
          </Box>
        </RouterLink>
      </VStack>
    </Flex>
  );
};
