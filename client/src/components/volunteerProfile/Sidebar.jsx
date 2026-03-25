import { Box, Flex, Text } from "@chakra-ui/react";
import { LuActivity, LuSettings, LuUser } from "react-icons/lu";

const items = [
  { id: "profile", label: "Profile Information", icon: LuUser },
  { id: "activity", label: "Activity", icon: LuActivity },
  { id: "settings", label: "Settings", icon: LuSettings },
];

export const Sidebar = ({ activeId, onSelect }) => {
  return (
    <Flex
      direction="column"
      gap={1}
      w={{ base: "100%", md: "220px" }}
      flexShrink={0}
      position="sticky"
      top="24px"
    >
      {items.map(({ id, label, icon: Icon }) => {
        const active = activeId === id;
        return (
          <Box
            key={id}
            as="button"
            type="button"
            w="100%"
            textAlign="left"
            borderRadius="md"
            px={3}
            py={2.5}
            bg={active ? "gray.100" : "transparent"}
            cursor="pointer"
            transition="background 0.15s ease"
            _hover={{ bg: active ? "gray.100" : "gray.50" }}
            onClick={() => onSelect(id)}
          >
            <Flex align="center" gap={3}>
              <Icon size={18} color="var(--chakra-colors-gray-700)" />
              <Text fontSize="sm" fontWeight={active ? "semibold" : "medium"} color="gray.800">
                {label}
              </Text>
            </Flex>
          </Box>
        );
      })}
    </Flex>
  );
};
