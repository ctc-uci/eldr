import {
  Avatar,
  Flex,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  BriefcaseBusiness,
  CircleUser,
  ClipboardList,
  Mail,
  Tag,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Event Catalog", icon: ClipboardList, path: "/event-catalog" },
  { label: "Case Catalog", icon: BriefcaseBusiness, path: "/case-catalog" },
  { label: "Email Template", icon: Mail, path: "/email" },
  { label: "Manage Profiles", icon: CircleUser, path: "/manage-profiles" },
  { label: "Manage Tags", icon: Tag, path: "/manage-tags" },
];

export function StaffSidebar() {
  const location = useLocation();

  const getLogoRootPath = () => {
    const p = location.pathname;
    if (p.startsWith("/email")) return "/email";
    if (p.startsWith("/event-catalog")) return "/event-catalog";
    if (p.startsWith("/manage-profiles")) return "/manage-profiles";
    if (p.startsWith("/manage-tags") || p.startsWith("/tags")) return "/manage-tags";
    return "/manage-tags";
  };

  return (
    <Flex
      direction="column"
      w="269px"
      h="100vh"
      bg="white"
      borderRightWidth="1px"
      borderColor="#e0e0e0"
      py="49px"
      px="30px"
      flexShrink={0}
      justifyContent="space-between"
    >
      <VStack align="start" gap="38px">
        <Flex justify="center" w="full">
          <Link to={getLogoRootPath()} style={{ display: "block", width: "100%" }}>
            <Image
              src="/cc-logo-vertical.svg"
              alt="Community Counsel"
              maxW="180px"
              maxH="80px"
              mx="auto"
              objectFit="contain"
            />
          </Link>
        </Flex>

        <VStack gap="24px" w="full">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Flex
                key={item.label}
                as="a"
                href={item.path}
                align="center"
                gap="12px"
                w="full"
                px="23px"
                py="16px"
                borderRadius="8px"
                bg={isActive ? "#E8F6FC" : "transparent"}
                cursor="pointer"
                _hover={{ bg: isActive ? "#E8F6FC" : "#f4f4f5" }}
                textDecoration="none"
              >
                <Icon size={23} color={isActive ? "#002992" : "#4A5568"} />
                <Text
                  fontSize="16px"
                  fontWeight={isActive ? "bold" : "600"}
                  fontFamily="heading"
                  color={isActive ? "#002992" : "#4A5568"}
                  lineHeight="24px"
                >
                  {item.label}
                </Text>
              </Flex>
            );
          })}
        </VStack>
      </VStack>

      <Avatar.Root size="lg">
        <Avatar.Fallback name="Staff" />
        <Avatar.Image src="" />
      </Avatar.Root>
    </Flex>
  );
}
