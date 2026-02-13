import React, { useState } from "react";
import {
  Steps,
  Box,
  Text,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Flex,
  Menu,
  Button,
  NativeSelect,
  Icon,
  Portal,
} from "@chakra-ui/react";
import { FaEdit, FaFolder, FaUser, FaClipboard, FaBriefcase, FaUsers } from "react-icons/fa";
import { LuChevronDown, LuMail, LuSearch } from 'react-icons/lu';

export const EmailTemplateManagement = () => {
  const [activeSection, setActiveSection] = useState("welcome");

  return (
    <Flex minH="100vh" bg="gray.100">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <Box flex="1" p={6} >

        {/* Search Bar */}
        <InputGroup mb={6} >
          <InputLeftElement pointerEvents="none" >
            <Icon color='gray.300' asChild><LuSearch /></Icon>
          </InputLeftElement>
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
  

const Sidebar = () => (
  <Box
    w="300px"
    bg="gray.200"
    p={10}
    minH="100vh"
  >
    <Text fontSize="2xl" fontWeight="bold" mb={8}>
      ELDR
    </Text>

    <VStack align="stretch" gap={2}>
      <NavItem icon={<FaUser />} label="Profile" />
      <NavItem icon={<FaUsers />} label="Volunteer Management" />
      <NavItem icon={<LuMail />} label="Email Management" active />
      <NavItem icon={<FaClipboard />} label="Clinics" />
      <NavItem icon={<FaBriefcase />} label="Cases" />
    </VStack>
  </Box>
);

const NavItem = ({ icon, label, active = false }) => (
  <HStack
    gap={3}
    p={2}
    borderRadius="md"
    bg={active ? "gray.300" : "transparent"}
    cursor="pointer"
    _hover={{ bg: "gray.300" }}
  >
    {icon}
    <Text>{label}</Text>
  </HStack>
);

const WelcomeSection = ({ setActiveSection }) => (
  <Box>
    <Flex justify="space-between">
    <Text fontSize="3xl" fontWeight="bold" mb={4}>
      Welcome
    </Text>

    {/* Create New Button */}
    <Menu.Root>
      <Menu.Trigger asChild><Button><FaEdit />Create New
                </Button></Menu.Trigger>
      <Portal><Menu.Positioner><Menu.Content>
            <Menu.Item value='item-0'>New folder</Menu.Item>
            <Menu.Item onSelect={() => setActiveSection("newTemplate")} value='item-1'>
              New template
            </Menu.Item>
          </Menu.Content></Menu.Positioner></Portal>
    </Menu.Root>
    </Flex>
    
     {/* Suggested Folders */}
     <Section title="Suggested folders">
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <FolderCard />
        <FolderCard />
        <FolderCard />
        <FolderCard />
      </SimpleGrid>
    </Section>

    {/* Suggested Templates */}
    <Section title="Suggested templates">
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
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
      <LuChevronDown />
      <Text fontSize="lg" fontWeight="semibold">
        {title}
      </Text>
    </HStack>
    {children}
  </Box>
);

const FolderCard = () => (
  <HStack bg="gray.300" p={4} borderRadius="md" gap={3}>
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

    <HStack gap={3} mb={6} b>
      <Button bg="white" border="2px solid black">Add Notification</Button>
      <Button bg="white" border="2px solid black">Delete Draft</Button>
      <NativeSelect.Root>
        <NativeSelect.Field
          placeholder="Select Folder"
          w="200px"
          borderRadius="md"
          size="md"
          bg="white"
          border="1px solid black">
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