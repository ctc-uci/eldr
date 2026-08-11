/*
Collapsed Navbar
Implement on event creation ONLY (potentially case creation too??)
*/

import { Link, Flex, VStack, Box, Avatar, Image, IconButton } from "@chakra-ui/react";
import { LuTags, LuMails } from "react-icons/lu";
import { ClipboardList, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navIconButtonProps = {
  variant: "ghost" as const,
  boxSize: "40px",
  minW: "40px",
  p: 2,
  borderRadius: "md",
  color: "#294A5F",
  _hover: {
    bg: "blue.50",
    color: "blue.700",
  },
};

export const CollapsedNavbar = () => {
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      w="80px"
      h="100vh"
      borderRight="1px solid"
      borderColor="gray.200"
      bg="white"
      py={6}
      align="center"
      justify="space-between"
    >
      <VStack gap={10} w="full" justifyContent="left">
        <Box>
          <Image
            src="/cc-logo.svg"
            alt="Logo"
            h="44px"
            maxW="full"
            objectFit="contain"
          />
          <Box w="32px" h="32px" />
        </Box>

        <VStack gap={10} w="full" >
          <IconButton
            title="Event Catalog"
            aria-label="Event Catalog"
            {...navIconButtonProps}
            onClick={() => navigate("/events")}
          >
            <ClipboardList size={22} />
          </IconButton>

          <IconButton
            title="Email Templates"
            aria-label="Email Templates"
            {...navIconButtonProps}
            onClick={() => navigate("/email")}
          >
            <LuMails size={22} />
          </IconButton>

          <IconButton
            title="Profiles"
            aria-label="Profiles"
            {...navIconButtonProps}
            onClick={() => navigate("/volunteer-management")}
          >
            <Users size={22} />
          </IconButton>

          <IconButton
            title="Tags"
            aria-label="Tags"
            {...navIconButtonProps}
            onClick={() => navigate("/tags")}
          >
            <LuTags size={22} />
          </IconButton>
        </VStack>
      </VStack>

      {/* PLACEHOLDER REPLACE WITH ACTUAL PFP */}
      <Link
        href="/admin-profile"
        title="Profile"
      >
        <Avatar.Root size="sm">
          <Avatar.Fallback name="User" />
          <Avatar.Image src="" />
        </Avatar.Root>
      </Link>
    </Flex>
  );
};
