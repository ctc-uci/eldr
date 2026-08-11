import { Box, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";

import { FaBriefcase, FaClipboard, FaMailBulk, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const sidebarNav = [
  { label: "Event Catalog", icon: FaClipboard, path: "/events" },
  { label: "Case Catalog", icon: FaBriefcase, active: false },
  { label: "Email Template", icon: FaMailBulk, path: "/email" },
  { label: "Manage Profiles", icon: FaUser, active: false },
];

const SidebarNavItem = ({ icon, label, active, onClick }) => (
  <HStack
    w="100%"
    spacing={3}
    px={4}
    py={3}
    borderRadius="lg"
    bg={active ? "#E8F6FC" : "transparent"}
    color={active ? "#002992" : "#4A5568"}
    fontWeight={active ? "bold" : "600"}
    cursor="pointer"
    _hover={{ bg: active ? "#E8F6FC" : "#F4F4F5" }}
    transition="background 0.2s"
    onClick={onClick}
  >
    <Icon
      as={icon}
      boxSize={5}
      color={active ? "#002992" : "#4A5568"}
    />
    <Text fontSize="md" fontFamily="heading">{label}</Text>
  </HStack>
);

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getLogoRootPath = () => {
    const p = location.pathname;
    if (p.startsWith("/email")) return "/email";
    if (p.startsWith("/events")) return "/events";
    if (p.startsWith("/volunteer-management")) return "/volunteer-management";
    if (p.startsWith("/tags") || p.startsWith("/manage-tags")) return "/tags";
    return "/events";
  };

  return (
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
        <Link to={getLogoRootPath()} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Image
            src="/cc-logo-vertical.svg"
            maxW="100%"
            maxH="80px"
            mx="auto"
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
              active={location.pathname === item.path}
              onClick={() => item.path && navigate(item.path)}
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
};
