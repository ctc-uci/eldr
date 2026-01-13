import React from "react";
import {
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
  MenuButton,
  MenuList,
  MenuItem,
  Button
} from "@chakra-ui/react";
import {
  EmailIcon, SearchIcon,
  ChevronDownIcon} from "@chakra-ui/icons";
import { FaEdit, FaFolder, FaUser, FaClipboard, FaBriefcase, FaUsers } from "react-icons/fa";

export const EmailTemplateManagement = () => {
    return (
      <Flex minH="100vh" bg="gray.100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box flex="1" p={6} >

        {/* Search Bar */}
        <InputGroup mb={6} >
          <InputLeftElement pointerEvents="none" >
            <SearchIcon color='gray.300' />
          </InputLeftElement>
          <Input placeholder="Search" />
        </InputGroup>
        <WelcomeSection />
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

    <VStack align="stretch" spacing={2}>
      <NavItem icon={<FaUser />} label="Profile" />
      <NavItem icon={<FaUsers />} label="Volunteer Management" />
      <NavItem icon={<EmailIcon />} label="Email Management" active />
      <NavItem icon={<FaClipboard />} label="Clinics" />
      <NavItem icon={<FaBriefcase />} label="Cases" />
    </VStack>
  </Box>
);

const NavItem = ({ icon, label, active = false }) => (
  <HStack
    spacing={3}
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

const WelcomeSection = () => (
  <Box>
    <Flex justify="space-between">
    <Text fontSize="3xl" fontWeight="bold" mb={4}>
      Welcome
    </Text>
    {/* Create New Button */}
    <Menu>
      <MenuButton as={Button} leftIcon={<FaEdit />}>
        Create New
      </MenuButton>
      <MenuList>
        <MenuItem>New folder</MenuItem>
        <MenuItem>New template</MenuItem>
      </MenuList>
    </Menu>
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
      <ChevronDownIcon />
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