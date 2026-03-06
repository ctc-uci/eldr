import { Avatar, Flex, HStack, Image, Link, Text } from "@chakra-ui/react";

import { BriefcaseBusiness, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
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
          color="#374151"
          _hover={{ color: "#111827", textDecoration: "none" }}
        >
          <ClipboardList size={18} />
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
          <BriefcaseBusiness size={18} />
          <Text>Cases</Text>
        </Link>

        <Link href = "/adm">
          <Avatar.Root size="sm">
            <Avatar.Fallback name="User" />
            <Avatar.Image src="" />
          </Avatar.Root>
        </Link>
      </HStack>
    </Flex>
  );
};
