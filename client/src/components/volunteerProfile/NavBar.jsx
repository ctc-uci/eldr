import { Avatar, Flex, HStack, Image, Link, Text } from "@chakra-ui/react";
import { BriefcaseBusiness, ClipboardList } from "lucide-react";

import logo from "../../assets/EldrLogo.png";

export const NavBar = () => {
  return (
    <Flex
      as="nav"
      w="100%"
      minH="64px"
      px={{ base: 4, md: 8 }}
      py={3}
      align="center"
      justify="space-between"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      flexShrink={0}
    >
      <Image
        src={logo}
        alt="Elder Law & Disability Rights Center"
        h={{ base: "36px", md: "44px" }}
        objectFit="contain"
      />

      <HStack gap={{ base: 4, md: 8 }}>
        <Link
          href="/event-catalog"
          display="flex"
          alignItems="center"
          gap={2}
          fontSize="sm"
          fontWeight={500}
          color="gray.700"
          _hover={{ color: "gray.900", textDecoration: "none" }}
        >
          <ClipboardList size={18} />
          <Text>Events</Text>
        </Link>

        <Link
          href="/cases"
          display="flex"
          alignItems="center"
          gap={2}
          fontSize="sm"
          fontWeight={500}
          color="gray.700"
          _hover={{ color: "gray.900", textDecoration: "none" }}
        >
          <BriefcaseBusiness size={18} />
          <Text>Cases</Text>
        </Link>

        <Avatar.Root size="sm">
          <Avatar.Fallback name="Peter Anteater" />
          <Avatar.Image src="" />
        </Avatar.Root>
      </HStack>
    </Flex>
  );
};
