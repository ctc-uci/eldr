import { Box, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";

import { FaBriefcase, FaClipboard, FaMailBulk, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const sidebarNav = [
  { label: "Event Catalog", icon: FaClipboard, active: false },
  { label: "Case Catalog", icon: FaBriefcase, active: false },
  { label: "Email Template", icon: FaMailBulk, active: true },
  { label: "Manage Profiles", icon: FaUser, active: false },
];

const SidebarNavItem = ({ icon, label, active }) => (
  <HStack
    spacing={3}
    px={4}
    py={3}
    borderRadius="lg"
    bg={active ? "#D8F1FF" : "transparent"}
    color="#294A5F"
    fontWeight={active ? "bold" : "normal"}
    cursor="pointer"
    _hover={{ bg: "#E3F0F9" }}
    transition="background 0.2s"
  >
    <Icon
      as={icon}
      boxSize={5}
      color={active ? "#5797bd" : "#294A5F"}
    />
    <Text fontSize="md">{label}</Text>
  </HStack>
);

export const Sidebar = () => (
  <Box
    w="260px"
    borderRight="1px solid #E0E0E0"
    py={8}
    px={4}
    minH="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
  >
    <Box>
      <Link to="/">
        <Image
          src="/logo.png"
          alt="Elder Law & Disability Rights Center"
          objectFit="contain"
          mb={10}
          _hover={{ opacity: 0.85 }}
        />
      </Link>
      <VStack
        align="stretch"
        gap={10}
      >
        {sidebarNav.map((item) => (
          <SidebarNavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={item.active}
          />
        ))}
      </VStack>
    </Box>
    <Box
      px={2}
      pb={2}
    >
      {/* User avatar placeholder, bottom left */}
      <Box
        boxSize="36px"
        borderRadius="full"
        overflow="hidden"
        cursor="pointer"
      >
        {/** @TODO: replace with actual user avatar */}
        <Image
          src="https://randomuser.me/api/portraits/men/67.jpg"
          alt="User"
          boxSize="100%"
          objectFit="cover"
        />
      </Box>
    </Box>
  </Box>
);
