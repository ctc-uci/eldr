/*
Collapsed Navbar
Implement on event creation ONLY (potentially case creation too??)
*/

import { Link, Flex, VStack, Box, Avatar, Image, IconButton } from "@chakra-ui/react";
import { LuClipboardList } from "react-icons/lu";
import { IoBriefcaseOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

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
            src="/eldr-logo-small.png"
            h="44px"
            objectFit="contain"
          />
          <Box w="32px" h="32px" />
        </Box>

        <VStack gap={10} w="full" px={4}>
          <IconButton
            title="Event Catalog"
            boxSize="30px"
            variant="ghost"
            as={LuClipboardList}
            onClick={() => navigate("/events")}
            _hover={{ bg: "#D8F1FF" }}
          />

          <IconButton
            title="Email Template"
            boxSize="30px"
            variant="ghost"
            as={MdOutlineMailOutline}
            onClick={() => navigate("/email")}
            _hover={{ bg: "#D8F1FF" }}
          />

          <IconButton
            title="Manage Profiles"
            boxSize="30px"
            variant="ghost"
            as={RxPerson}
            onClick={() => navigate("/volunteer-management")}
            _hover={{ bg: "#D8F1FF" }}
          />
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
