import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Input,
  InputGroup,
  SimpleGrid,
  Flex,
  Menu,
  Button,
  Portal,
  NativeSelect,
  Image,
  Icon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

/** @TODO: change to use different icons bc chakra-ui/icons isn't compatible */
import { FaEdit, FaFolder, FaUser, FaClipboard, FaBriefcase, FaMailBulk, FaQuestion } from "react-icons/fa";

export const EmailTemplateManagement = () => {
  const [activeSection, setActiveSection] = useState("welcome");

  return (
    <Flex minH="100vh" bg="white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box flex="1" p={6} >

        {/* Search Bar */}
        <InputGroup mb={6} >
          <Input placeholder="Search" />
        </InputGroup>

        {/* Conditionally render sections */}
        {activeSection === "welcome" && (
          <WelcomeSection setActiveSection={setActiveSection} />
        )}
        {activeSection === "newTemplate" && <NewTemplateSection />}
      </Box>
    </Flex>
  );
};
  

const sidebarNav = [
  { label: "Event Catalog", icon: FaClipboard, active: false },
  { label: "Case Catalog", icon: FaBriefcase, active: false },
  { label: "Email Template", icon: FaMailBulk, active: true },
  { label: "Manage Profiles", icon: FaUser, active: false },
];

const Sidebar = () => (
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
        <Image src="/logo.png" alt="Elder Law & Disability Rights Center" objectFit="contain" mb={10} _hover={{ opacity: 0.85 }} />
      </Link>
      <VStack align="stretch" gap={10}>
        {sidebarNav.map((item) => (
          <SidebarNavItem key={item.label} icon={item.icon} label={item.label} active={item.active} />
        ))}
      </VStack>
    </Box>
    <Box px={2} pb={2}>
      {/* User avatar placeholder, bottom left */}
      <Box boxSize="36px" borderRadius="full" overflow="hidden" cursor="pointer">
        {/** @TODO: replace with actual user avatar */}
        <Image src="https://randomuser.me/api/portraits/men/67.jpg" alt="User" boxSize="100%" objectFit="cover" />
      </Box>
    </Box>
  </Box>
);

const SidebarNavItem = ({ icon, label, active }) => (
  <HStack
    spacing={3}
    px={4}
    py={3}
    borderRadius="lg"
    bg={active ? "#D8F1FF" : "transparent"}
    // color={active ? "#1A567E" : "#3A3A3A"}
    color="#294A5F"
    fontWeight={active ? "bold" : "normal"}
    cursor="pointer"
    _hover={{ bg: "#E3F0F9" }}
    transition="background 0.2s"
  >
    <Icon as={icon} boxSize={5} color={active ? "#5797bd" : "#294A5F"} />
    <Text fontSize="md">{label}</Text>
  </HStack>
);

const WelcomeSection = ({ setActiveSection }) => (
  <Box>
    <Flex justify="space-between">
    <Text fontSize="3xl" fontWeight="bold" mb={4}>
      Welcome
    </Text>

    {/* @TODO: migrate create new button to v3 */}
    {/* Create New Button */}
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button leftIcon={<FaEdit />}>
          Create New
        </Button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item>New folder</Menu.Item>
            <Menu.Item onClick={() => setActiveSection("newTemplate")}>
              New template
            </Menu.Item>            
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
    </Flex>
    
     {/* Suggested Folders */}
     <Section title="Suggested folders">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FolderCard />
        <FolderCard />
        <FolderCard />
        <FolderCard />
      </SimpleGrid>
    </Section>

    {/* Suggested Templates */}
    <Section title="Suggested templates">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <TemplateCard />
        <TemplateCard />
        <TemplateCard />
        <TemplateCard />
      </SimpleGrid>
    </Section>
  </Box>
);

const Section = ({ title, children }) => (
  <Box mb={8}>
    <HStack mb={4}>
      <FaQuestion />
      <Text fontSize="lg" fontWeight="semibold">
        {title}
      </Text>
    </HStack>
    {children}
  </Box>
);

const FolderCard = () => (
  <HStack bg="gray.300" p={4} borderRadius="md" spacing={3}>
    <FaFolder size={20} color="black" />
    <Input placeholder="Folder Name" bg="white" border="2px solid black"/>
  </HStack>
);

const TemplateCard = () => (
  <Box bg="gray.300" p={4} borderRadius="md">
    <Input placeholder="Template Name" bg="white" mb={3} border="2px solid black"/>
    <Box h="120px" bg="gray.100" borderRadius="md" />
  </Box>
);

const NewTemplateSection = () => (
  <Box>
    <Text fontSize="5xl" mb={4}>
      Template Name
    </Text>

    <Text fontSize="2xl" mb={4}>
      Templates
    </Text>

    <HStack spacing={3} mb={6} b>
      <Button bg="white" border="2px solid black">Add Notification</Button>
      <Button bg="white" border="2px solid black">Delete Draft</Button>
      <NativeSelect.Root
        size="sm"
        width="200px"
        bg="white"
        border="1px solid black"
        borderRadius="md"
      >
        <NativeSelect.Field placeholder="Select Folder">
          <option value="folder1">Folder 1</option>
          <option value="folder2">Folder 2</option>
          <option value="folder3">Folder 3</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </HStack>

    {/* Template Content */}
    <Box w="100%" mb={4}>
      <Box bg="white" border="1px solid black" p={2} mb={5}>
        B I U
      </Box>

      <Box bg="gray.300" border="2px solid black" minH="350px" />
    </Box>


    <Button bg="white" border="2px solid black">Save</Button>
  </Box>
);