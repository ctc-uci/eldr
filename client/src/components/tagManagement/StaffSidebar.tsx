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
import { useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Event Catalog", icon: ClipboardList, path: "/event-catalog" },
  { label: "Case Catalog", icon: BriefcaseBusiness, path: "/case-catalog" },
  { label: "Email Template", icon: Mail, path: "/email" },
  { label: "Manage Profiles", icon: CircleUser, path: "/manage-profiles" },
  { label: "Manage Tags", icon: Tag, path: "/manage-tags" },
];

export function StaffSidebar() {
  const location = useLocation();

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
        <Image
          src="/eldr-logo.png"
          alt="Elder Law & Disability Rights Center"
          h="60px"
          w="168px"
          objectFit="contain"
        />

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
                bg={isActive ? "#d8f1ff" : "transparent"}
                cursor="pointer"
                _hover={{ bg: isActive ? "#d8f1ff" : "#f4f4f5" }}
                textDecoration="none"
              >
                <Icon size={23} color="#294a5f" />
                <Text
                  fontSize="16px"
                  fontWeight="bold"
                  color="#294a5f"
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
