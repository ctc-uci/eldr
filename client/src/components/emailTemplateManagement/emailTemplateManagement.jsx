import React, { useState } from "react";
import {
  IconButton,
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
  Textarea,
  Image,
  Icon,
  Breadcrumb,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { FaEdit, FaFolder, FaUser, FaClipboard, FaBriefcase, FaMailBulk, FaQuestion, FaPlus } from "react-icons/fa";

export const EmailTemplateManagement = () => {
  const [view, setView] = useState("folders"); 
  // "folders" | "newTemplate"

  const [templateName, setTemplateName] = useState("Untitled Template");
  const [templateContent, setTemplateContent] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [showFolderPrompt, setShowFolderPrompt] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [templates, setTemplates] = useState([]);


  const [folders, setFolders] = useState([
    "Untitled Folder",
    "Untitled Folder",
    "Untitled Folder",
  ]);

  const handleSaveTemplate = () => {
    // Trim values
    const trimmedName = templateName.trim();
    const trimmedFolder = selectedFolder.trim();
  
    // Validate template name
    if (!trimmedName) {
      alert("Template name cannot be empty.");
      return;
    }
  
    // Validate folder
    if (!trimmedFolder) {
      alert("Please select or enter a folder.");
      return;
    }
  
    // If folder doesn't exist → show modal
    if (!folders.includes(trimmedFolder)) {
      setShowFolderModal(true);
      return;
    }
  
    // Create new template object
    const newTemplate = {
      id: Date.now(),
      name: trimmedName,
      content: templateContent,
      folder: trimmedFolder,
      createdAt: new Date(),
    };
  
    // Save template
    setTemplates((prev) => [...prev, newTemplate]);
  
    // Reset form
    setTemplateName("Untitled Template");
    setTemplateContent("");
    setSelectedFolder("");
  
    // Go back to folders view
    setView("folders");
  };

  const totalPages = 6;
  const currentPage = 1;

  return (
    <Flex minH="100vh" bg="#FAFBFC">
      <Sidebar />
      <Box flex="1" px={10} py={8}>
        {/* Search Bar */}
        <InputGroup mb={6} maxW="400px">
          <Input placeholder="Type to search" bg="white" />
        </InputGroup>

        {/* breadcrumbs */}
        <Breadcrumb.Root mb={4} fontSize="sm" color="gray.500">
          <Breadcrumb.List>
            <Breadcrumb.Item>
              {view === "newTemplate" ? (
                <Breadcrumb.Link
                  cursor="pointer"
                  onClick={() => setView("folders")}
                  _hover={{ color: "gray.700" }}
                >
                  Management
                </Breadcrumb.Link>
              ) : (
                <Breadcrumb.Link as={Link} to="#">
                  Management
                </Breadcrumb.Link>
              )}
            </Breadcrumb.Item>

            {view === "newTemplate" && (
              <>
                <Breadcrumb.Separator />
                <Breadcrumb.Item isCurrentPage>
                  <Breadcrumb.Link color="gray.800" fontWeight="medium">
                    {templateName || "Untitled Template"}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </>
            )}
          </Breadcrumb.List>
        </Breadcrumb.Root>

        {/* title and actions */}
        <Flex align="center" justify="space-between" mb={8}>
        {view === "folders" ? (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              Manage your folders
            </Text>

            <HStack spacing={4}>
              <Button
                backgroundColor="#5797BD"
                color="white"
                minW="180px"
                onClick={() => setView("newTemplate")}
              >
                <FaMailBulk />
                New Template
              </Button>

              <Button
                backgroundColor="#5797BD"
                color="white"
                minW="180px"
              >
                <FaFolder />
                New Folder
              </Button>
            </HStack>
          </>
        ) : (
          <>
            <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                variant="unstyled"
                fontSize="3xl"
                fontWeight="600"
                bg="#FAFBFC"
                mb={6}
                _focus={{ boxShadow: "none" }}
            />
            <HStack spacing={4} ml="auto">
              <Box position="relative">
                <Button
                  backgroundColor="#5797BD"
                  color="white"
                  onClick={() => setShowFolderPrompt((prev) => !prev)}
                >
                  Save Template
                </Button>

                {showFolderPrompt && (
                  <Box
                    position="absolute"
                    top="110%"
                    right="0"
                    mt={3}
                    bg="white"
                    boxShadow="0 4px 12px rgba(0,0,0,0.15)"
                    borderRadius="md"
                    p={5}
                    width="420px"
                    zIndex={20}
                  >
                    <Text fontWeight="600" mb={3}>
                      Indicate a folder to store this template.
                    </Text>

                    <Flex gap={3}>
                      <Input
                        placeholder="Enter a folder name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                      />

                    <IconButton
                      borderRadius="full"
                      variant="outline"
                      onClick={() => {
                        if (!newFolderName.trim()) return;
                        setFolders((prev) => [...prev, newFolderName]);
                        setSelectedFolder(newFolderName);
                        setNewFolderName("");
                      }}
                    >
                      <FaPlus />
                    </IconButton>
                    </Flex>
                  </Box>
                )}
              </Box>

              <Button
                backgroundColor="#5797BD"
                color="white"
                onClick={() => setView("folders")}
              >
                Delete Template
              </Button>
            </HStack>
          </>
        )}
      </Flex>

        {/* Folder List */}
        {view === "folders" && (
          <>
          <VStack align="stretch" spacing={4} mb={8}>
            {folders.map((folder, idx) => (
              <Flex key={idx} align="center" bg="white" borderRadius="md" px={6} py={4} boxShadow="sm" justify="space-between">
                <Text fontWeight="medium">{folder}</Text>
                <Icon as={FaQuestion} boxSize={5} color="gray.400" cursor="pointer" />
              </Flex>
            ))}
          </VStack>

          {/* Pagination */}
          <Flex justify="flex-end">
            <HStack spacing={1} bg="white" borderRadius="md" p={2} boxShadow="sm">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={i + 1 === currentPage ? "solid" : "ghost"}
                  colorScheme={i + 1 === currentPage ? "blue" : undefined}
                  fontWeight={i + 1 === currentPage ? "bold" : "normal"}
                >
                  {i + 1}
                </Button>
              ))}
              <Button size="sm" variant="ghost">→</Button>
            </HStack>
          </Flex>
          </>
        )}

        {view === "newTemplate" && (
          <NewTemplateSection
            templateName={templateName}
            setTemplateName={setTemplateName}
            templateContent={templateContent}
            setTemplateContent={setTemplateContent}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
            folders={folders}
            setShowFolderModal={setShowFolderModal}
            onSave={handleSaveTemplate}
          />
        )}

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

const NewTemplateSection = ({
  templateName,
  setTemplateName,
  templateContent,
  setTemplateContent,
  selectedFolder,
  setSelectedFolder,
  folders,
  onSave,
}) => (
  <Box maxW="100%" mx="auto">

    <VStack spacing={6} align="stretch">
      {/* Editor Container */}
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="16px"
        overflow="hidden"
        boxShadow="sm"
      >
        {/* Toolbar */}
        <HStack
          px={4}
          py={3}
          borderBottom="1px solid"
          borderColor="gray.100"
          spacing={4}
        >
          <Text fontWeight="600" cursor="pointer">B</Text>
          <Text fontStyle="italic" cursor="pointer">I</Text>
          <Text textDecoration="underline" cursor="pointer">U</Text>
        </HStack>

        {/* Big Text Box */}
        <Textarea
          value={templateContent}
          onChange={(e) => setTemplateContent(e.target.value)}
          placeholder="Start writing your template..."
          minH="400px"
          resize="none"
          border="none"
          borderRadius="0"
          _focus={{ boxShadow: "none" }}
          p={6}
          fontSize="md"
        />
      </Box>
    </VStack>
  </Box>
);
