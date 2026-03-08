import { Box, Button, Flex, HStack, Tag, Text, VStack } from "@chakra-ui/react";

import {
  LuArchive,
  LuCalendar,
  LuClock,
  LuMapPin,
  LuPencil,
  LuUsers,
} from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";

import { Sidebar } from "./SideBar";

export const NewCreatedEvent = ({ eventData, onClose }) => {
  const {
    name = "This is an upcoming Clinic Event",
    date = "12/12/26",
    time = "9:00 AM - 12:00 PM",
    location = "1535 17th St STE 110, Santa Ana, CA 92705",
    capacity = 50,
    attendees = 30,
    clinicType = "Clinic Type",
    eventFormat = "Event Format",
    language = "Language",
  } = eventData || {};

  const tabs = [
    { key: "details", label: "Event Details" },
    { key: "volunteers", label: "Volunteer List" },
    { key: "email", label: "Email Notification Timeline" },
  ];

  const activeTab = "details";

  return (
    <Flex
      w="100%"
      minH="100vh"
      bg="#F7F8FA"
    >
      <Sidebar />

      <VStack
        flex={1}
        align="start"
        px={10}
        pt={10}
        pb={10}
        gap={6}
      >
        {/* Breadcrumb */}
        <HStack
          fontSize="lg"
          gap={1}
        >
          <Text
            fontWeight="semibold"
            color="gray.700"
          >
            Event Catalog
          </Text>
          <Text color="gray.400">›</Text>
          <Text
            color="blue.500"
            cursor="pointer"
            onClick={onClose}
          >
            View Event
          </Text>
        </HStack>

        {/* Title + action buttons row */}
        <Flex
          w="100%"
          justify="space-between"
          align="start"
        >
          <VStack
            align="start"
            gap={4}
          >
            {/* Event name */}
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.800"
            >
              {name}
            </Text>

            {/* Date + Time */}
            <HStack gap={6}>
              <HStack
                gap={2}
                color="gray.600"
                fontSize="sm"
              >
                <LuCalendar />
                <Text>{date}</Text>
              </HStack>
              <HStack
                gap={2}
                color="gray.600"
                fontSize="sm"
              >
                <LuClock />
                <Text>{time}</Text>
              </HStack>
            </HStack>

            {/* Location + Spots */}
            <HStack gap={6}>
              <HStack
                gap={2}
                color="gray.600"
                fontSize="sm"
              >
                <LuMapPin />
                <Text>{location}</Text>
              </HStack>
              <HStack
                gap={2}
                color="gray.600"
                fontSize="sm"
              >
                <LuUsers />
                <Text>
                  {attendees}/{capacity} spots filled
                </Text>
              </HStack>
            </HStack>

            {/* Tags */}
            <HStack
              gap={2}
              mt={1}
            >
              {[clinicType, eventFormat, language].map((tag) => (
                <Tag.Root
                  key={tag}
                  size="md"
                  borderRadius="md"
                  border="0.5px solid"
                  borderColor="gray.200"
                  bg="gray.100"
                  px={2}
                  py={1}
                >
                  <Tag.Label
                    fontSize="xs"
                    fontWeight="medium"
                  >
                    {tag}
                  </Tag.Label>
                </Tag.Root>
              ))}
            </HStack>
          </VStack>

          {/* Edit / Archive buttons */}
          <VStack
            gap={2}
            align="stretch"
            minW="180px"
          >
            <Button
              variant="outline"
              border="1px solid #E2E8F0"
              bg="white"
              color="gray.700"
              borderRadius="md"
              justifyContent="flex-start"
              gap={3}
              px={4}
              _hover={{ bg: "gray.50" }}
            >
              <LuPencil />
              Edit Event
            </Button>
            <Button
              variant="outline"
              border="1px solid #E2E8F0"
              bg="white"
              color="gray.700"
              borderRadius="md"
              justifyContent="flex-start"
              gap={3}
              px={4}
              _hover={{ bg: "gray.50" }}
            >
              <LuArchive />
              Archive Event
            </Button>
          </VStack>
        </Flex>

        {/* Tabbed content card */}
        <Box
          w="100%"
          bg="white"
          border="1px solid #E2E8F0"
          borderRadius="lg"
          overflow="hidden"
        >
          {/* Tabs */}
          <HStack
            gap={0}
            borderBottom="2px solid #E2E8F0"
            px={6}
          >
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant="ghost"
                borderRadius={0}
                borderBottom={
                  activeTab === tab.key
                    ? "2px solid #2B6CB0"
                    : "2px solid transparent"
                }
                mb="-2px"
                color={activeTab === tab.key ? "blue.600" : "gray.400"}
                fontWeight={activeTab === tab.key ? "semibold" : "normal"}
                px={4}
                py={3}
                fontSize="sm"
                _hover={{ bg: "transparent", color: "gray.600" }}
              >
                <MdOutlineMailOutline />
                {tab.label}
              </Button>
            ))}
          </HStack>

          {/* Event Details content */}
          <Box
            w="100%"
            p={8}
          >
            <VStack
              align="start"
              gap={6}
            >
              <VStack
                align="start"
                gap={2}
              >
                <Text
                  fontWeight="bold"
                  fontSize="md"
                  color="gray.800"
                >
                  Description
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.600"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
                  massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                  sapien fringilla, mattis ligula consectetur, ultrices mauris.
                  Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.600"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
                  massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                  sapien fringilla, mattis ligula consectetur, ultrices mauris.
                  Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
                </Text>
              </VStack>

              <VStack
                align="start"
                gap={2}
              >
                <Text
                  fontWeight="bold"
                  fontSize="md"
                  color="gray.800"
                >
                  Miscellaneous
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.600"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
                  massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                  sapien fringilla, mattis ligula consectetur, ultrices mauris.
                  Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
                </Text>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </VStack>
    </Flex>
  );
};
