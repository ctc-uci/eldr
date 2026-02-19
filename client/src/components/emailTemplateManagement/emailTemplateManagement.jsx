import React, { useState, useRef } from "react";

import {
  Box,
  Breadcrumb,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  Popover,
  Text,
  VStack,
} from "@chakra-ui/react";

import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Control, RichTextEditor } from "@/components/ui/rich-text-editor";

import {
  FaArrowRight,
  FaBriefcase,
  FaClipboard,
  FaFolder,
  FaGripLines,
  FaMailBulk,
  FaPlus,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";


export const EmailTemplateManagement = () => {
  const [view, setView] = useState("folders");
  // "folders" | "newTemplate" | "folderView"

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
  const [currentFolder, setCurrentFolder] = useState(null);

  const [showNewTemplatePopover, setShowNewTemplatePopover] = useState(false);
  const [newTemplateInput, setNewTemplateInput] = useState("");
  const templateInputRef = useRef(null);

  const [showNewFolderPopover, setShowNewFolderPopover] = useState(false);
  const [newFolderInput, setNewFolderInput] = useState("");
  const folderInputRef = useRef(null);

  const [showFolderViewTemplatePopover, setShowFolderViewTemplatePopover] = useState(false);
  const [folderViewTemplateInput, setFolderViewTemplateInput] = useState("");
  const folderViewTemplateInputRef = useRef(null);

  // for dismissing popover on outside click or trigger click
  const handleTemplatePopoverOpenChange = (open) => {
    setShowNewTemplatePopover(open);
    if (!open) {
      setNewTemplateInput("");
    }
  };

  const handleFolderPopoverOpenChange = (open) => {
    setShowNewFolderPopover(open);
    if (!open) {
      setNewFolderInput("");
    }
  };

  // create new folder from popover
  const handleCreateFolderFromPopover = () => {
    const trimmedName = newFolderInput.trim();
    if (!trimmedName) return;
    setFolders((prev) => [...prev, trimmedName]);
    setShowNewFolderPopover(false);
    setNewFolderInput("");
    setCurrentFolder(trimmedName);
    setView("folderView");
  };

  // navigate to folder view when clicking on a folder
  const handleFolderClick = (folderName) => {
    setCurrentFolder(folderName);
    setView("folderView");
  };

  // get templates for current folder
  const getTemplatesInFolder = () => {
    if (!currentFolder) return [];
    return templates.filter((t) => t.folder === currentFolder);
  };

  // create new template from folder view
  const handleCreateTemplateFromFolderView = () => {
    const trimmedName = folderViewTemplateInput.trim();
    if (!trimmedName) return;
    setSelectedFolder(currentFolder);
    setTemplateName(trimmedName);
    setTemplateContent("");
    setShowFolderViewTemplatePopover(false);
    setFolderViewTemplateInput("");
    setView("newTemplate");
  };

  // handle folder view template popover open change
  const handleFolderViewTemplatePopoverOpenChange = (open) => {
    setShowFolderViewTemplatePopover(open);
    if (!open) {
      setFolderViewTemplateInput("");
    }
  };

  // create new template from popover
  const handleCreateTemplateFromPopover = () => {
    const trimmedName = newTemplateInput.trim();
    if (!trimmedName) return;
    setTemplateName(trimmedName);
    setTemplateContent("");
    setSelectedFolder("");
    setShowNewTemplatePopover(false);
    setNewTemplateInput("");
    setView("newTemplate");
  };

  const handleSaveTemplate = () => {
    // trim values
    const trimmedName = templateName.trim();
    const trimmedFolder = selectedFolder.trim();

    // validate template name
    if (!trimmedName) {
      alert("Template name cannot be empty.");
      return;
    }

    // validate folder
    if (!trimmedFolder) {
      alert("Please select or enter a folder.");
      return;
    }

    // If folder doesn't exist → show modal
    if (!folders.includes(trimmedFolder)) {
      setShowFolderModal(true);
      return;
    }

    // create new template object
    const newTemplate = {
      id: Date.now(),
      name: trimmedName,
      content: templateContent,
      folder: trimmedFolder,
      createdAt: new Date(),
    };

    // save template
    setTemplates((prev) => [...prev, newTemplate]);

    // reset form
    setTemplateName("Untitled Template");
    setTemplateContent("");
    setSelectedFolder("");

    // go back to folders view
    setView("folders");
  };

  const totalPages = 6;
  const currentPage = 1;

  return (
    <Flex
      minH="100vh"
      bg="#FAFBFC"
    >
      <Sidebar />
      <Flex
        direction="column"
        flex="1"
        px={10}
        py={8}
        minH="100vh"
      >
        {/* Search Bar */}
        <InputGroup
          mb={6}
          maxW="400px"
        >
          <Input
            placeholder="Type to search"
            bg="white"
          />
        </InputGroup>

        {/* breadcrumbs */}
        <Breadcrumb.Root
          mb={4}
          fontSize="sm"
          color="gray.500"
        >
          <Breadcrumb.List>
            <Breadcrumb.Item>
              {(view === "newTemplate" || view === "folderView") ? (
                <Breadcrumb.Link
                  cursor="pointer"
                  onClick={() => setView("folders")}
                  _hover={{ color: "gray.700" }}
                >
                  Management
                </Breadcrumb.Link>
              ) : (
                <Breadcrumb.Link
                  as={Link}
                  to="#"
                >
                  Management
                </Breadcrumb.Link>
              )}
            </Breadcrumb.Item>

            {view === "folders" && (
              <>
                <Breadcrumb.Separator />
                <Breadcrumb.Item isCurrentPage>
                  <Breadcrumb.Link
                    color="gray.800"
                    fontWeight="medium"
                  >
                    Folders
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </>
            )}

            {view === "folderView" && (
              <>
                <Breadcrumb.Separator />
                <Breadcrumb.Item isCurrentPage>
                  <Breadcrumb.Link
                    color="gray.800"
                    fontWeight="medium"
                  >
                    {currentFolder || "New Folder"}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </>
            )}

            {view === "newTemplate" && (
              <>
                <Breadcrumb.Separator />
                <Breadcrumb.Item isCurrentPage>
                  <Breadcrumb.Link
                    color="gray.800"
                    fontWeight="medium"
                  >
                    {templateName || "Untitled Template"}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </>
            )}
          </Breadcrumb.List>
        </Breadcrumb.Root>

        {/* title and actions */}
        <Flex
          align="center"
          justify="space-between"
          mb={8}
        >
          {(view === "folders" || view === "folderView") ? (
            <>
              <Text
                fontSize="2xl"
                fontWeight="bold"
              >
                {view === "folderView" ? "Manage your files" : "Manage your folders"}
              </Text>

              {view === "folders" && (
                <HStack spacing={4}>
                  <Popover.Root open={showNewTemplatePopover} onOpenChange={(e) => handleTemplatePopoverOpenChange(e.open)} placement="bottom-start" initialFocusRef={templateInputRef}>
                    <Popover.Trigger asChild>
                      <Button
                        backgroundColor="#5797BD"
                        color="white"
                        w="292px"
                      >
                        <FaMailBulk />
                        New Template
                      </Button>
                    </Popover.Trigger>
                    <Popover.Positioner zIndex={1000}>
                      <Popover.Content w="292px" boxShadow="lg" borderRadius="md" mt={2} p={0}>
                        <Popover.CloseTrigger />
                        <Popover.Body p={4}>
                          <Popover.Title as={Text} fontSize="xs" fontWeight="bold" mb={2}>
                            New Template Creation
                          </Popover.Title>
                          <HStack gap="10px">
                            <Input
                              ref={templateInputRef}
                              placeholder="Enter a template name"
                              value={newTemplateInput}
                              onChange={e => setNewTemplateInput(e.target.value)}
                              size="md"
                              fontSize="xs"
                              bg="white"
                              onKeyDown={e => {
                                if (e.key === "Enter" && newTemplateInput.trim()) {
                                  handleCreateTemplateFromPopover();
                                }
                              }}
                            />
                            <FaPlus
                              size={24}
                              cursor={newTemplateInput.trim() ? "pointer" : "not-allowed"}
                              color={newTemplateInput.trim() ? "black" : "#ccc"}
                              onClick={newTemplateInput.trim() ? handleCreateTemplateFromPopover : undefined}
                              title={newTemplateInput.trim() ? "Create template" : "Enter a name first"}
                            />
                          </HStack>
                        </Popover.Body>
                      </Popover.Content>
                    </Popover.Positioner>
                  </Popover.Root>
                  <Popover.Root open={showNewFolderPopover} onOpenChange={(e) => handleFolderPopoverOpenChange(e.open)} placement="bottom-start" initialFocusRef={folderInputRef}>
                    <Popover.Trigger asChild>
                      <Button
                        backgroundColor="#5797BD"
                        color="white"
                        w="292px"
                      >
                        <FaFolder />
                        New Folder
                      </Button>
                    </Popover.Trigger>
                    <Popover.Positioner zIndex={1000}>
                      <Popover.Content w="292px" boxShadow="lg" borderRadius="md" mt={2} p={0}>
                        <Popover.CloseTrigger />
                        <Popover.Body p={4}>
                          <Popover.Title as={Text} fontSize="xs" fontWeight="bold" mb={2}>
                            New Folder Creation
                          </Popover.Title>
                          <HStack gap="10px">
                            <Input
                              ref={folderInputRef}
                              placeholder="Enter a folder name"
                              value={newFolderInput}
                              onChange={e => setNewFolderInput(e.target.value)}
                              size="md"
                              fontSize="xs"
                              bg="white"
                              onKeyDown={e => {
                                if (e.key === "Enter" && newFolderInput.trim()) {
                                  handleCreateFolderFromPopover();
                                }
                              }}
                            />
                            <FaPlus
                              size={24}
                              cursor={newFolderInput.trim() ? "pointer" : "not-allowed"}
                              color={newFolderInput.trim() ? "black" : "#ccc"}
                              onClick={newFolderInput.trim() ? handleCreateFolderFromPopover : undefined}
                              title={newFolderInput.trim() ? "Create folder" : "Enter a name first"}
                            />
                          </HStack>
                        </Popover.Body>
                      </Popover.Content>
                    </Popover.Positioner>
                  </Popover.Root>
                </HStack>
              )}
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
                px="0px"
                _focus={{ boxShadow: "none" }}
              />
              <HStack
                spacing={4}
                ml="auto"
              >
                <Box position="relative">
                  <Button
                    backgroundColor="#5797BD"
                    color="white"
                    w="292px"
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
                      <Text
                        fontWeight="600"
                        mb={3}
                      >
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
                  w="292px"
                  onClick={() => setView("folders")}
                >
                  Delete Template
                </Button>
              </HStack>
            </>
          )}
        </Flex>

        {/* folder list */}
        {view === "folders" && (
          <>
            <VStack
              align="stretch"
              spacing={4}
              mb={8}
              flex="1"
            >
              {folders.map((folder, idx) => (
                <Flex
                  key={idx}
                  align="center"
                  bg="white"
                  borderRadius="md"
                  borderColor="#E4E4E7"
                  borderWidth="1px"
                  px={6}
                  py={4}
                  justify="space-between"
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
                  onClick={() => handleFolderClick(folder)}
                >
                  <Text fontWeight="medium" fontSize="lg">{folder}</Text>
                  <FaGripLines size={24} color="black" cursor="pointer" />
                </Flex>
              ))}
            </VStack>
          </>
        )}

        {view === "folderView" && (
          <Flex
            flex="1"
            direction="column"
            align="center"
            justify="center"
            minH="400px"
          >
            {getTemplatesInFolder().length === 0 ? (
              <VStack spacing={4} py={16} px={12}>
                <Icon as={FaFolder} boxSize={6} color="gray.500" />
                <Text
                  fontSize="xl"
                  fontWeight="semibold"
                  textAlign="center"
                >
                  You have no templates!
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  textAlign="center"
                >
                  Create a new email template by clicking below
                </Text>
                <Popover.Root
                  open={showFolderViewTemplatePopover}
                  onOpenChange={(e) => handleFolderViewTemplatePopoverOpenChange(e.open)}
                  placement="bottom"
                  initialFocusRef={folderViewTemplateInputRef}
                >
                  <Popover.Trigger asChild>
                    <Button
                      backgroundColor="#5797BD"
                      color="white"
                      px={8}
                      py={2}
                      mt={2}
                    >
                      <FaMailBulk />
                      New Template
                    </Button>
                  </Popover.Trigger>
                  <Popover.Positioner zIndex={1000}>
                    <Popover.Content
                      w="258px"
                      boxShadow="0px 4px 4px 0px rgba(0,0,0,0.25)"
                      borderRadius="md"
                      mt={2}
                      p={0}
                      bg="white"
                    >
                      <Popover.CloseTrigger />
                      <Popover.Body p={0}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="black"
                          px="10px"
                          pt="10px"
                          pb="0"
                        >
                          New Template Creation
                        </Text>
                        <HStack gap="10px" p="10px">
                          <Input
                            ref={folderViewTemplateInputRef}
                            placeholder="Enter a template name"
                            value={folderViewTemplateInput}
                            onChange={(e) => setFolderViewTemplateInput(e.target.value)}
                            size="sm"
                            fontSize="xs"
                            bg="white"
                            borderColor="#E4E4E7"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && folderViewTemplateInput.trim()) {
                                handleCreateTemplateFromFolderView();
                              }
                            }}
                          />
                          <IconButton
                            size="sm"
                            borderRadius="full"
                            variant="ghost"
                            aria-label="Create template"
                            cursor={folderViewTemplateInput.trim() ? "pointer" : "not-allowed"}
                            color={folderViewTemplateInput.trim() ? "black" : "#ccc"}
                            onClick={folderViewTemplateInput.trim() ? handleCreateTemplateFromFolderView : undefined}
                          >
                            <FaPlus />
                          </IconButton>
                        </HStack>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover.Positioner>
                </Popover.Root>
              </VStack>
            ) : (
              <VStack align="stretch" spacing={4} width="100%">
                {getTemplatesInFolder().map((template) => (
                  <Flex
                    key={template.id}
                    align="center"
                    bg="white"
                    borderRadius="md"
                    borderColor="#E4E4E7"
                    borderWidth="1px"
                    px={6}
                    py={4}
                    justify="space-between"
                  >
                    <Text fontWeight="medium" fontSize="lg">{template.name}</Text>
                  </Flex>
                ))}
              </VStack>
            )}
          </Flex>
        )}

        {view === "newTemplate" && (
          <Box flex="1" minH={0} display="flex" flexDirection="column">
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
          </Box>
        )}

        {/* pagination at the bottom */}
        {(view === "folders" || view === "folderView") && (
          <Box mt="auto">
            <Flex
              justify="flex-end"
              align="flex-end"
              alignContent="end"
            >
              <HStack
                spacing={1}
                bg="white"
                borderRadius="md"
                p={2}
                boxShadow="sm"
              >
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={i + 1 === currentPage ? "solid" : "ghost"}
                    borderColor="#E4E4E7"
                    borderWidth={2}
                    bgColor={i + 1 === currentPage ? "#D5D5D8" : "transparent"}
                    fontWeight={i + 1 === currentPage ? "bold" : "normal"}
                    fontSize="20px"
                    color="black"
                    px={4}
                    py={2}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                >
                  <FaArrowRight size={24} />
                </Button>
              </HStack>
            </Flex>
          </Box>
        )}
      </Flex>
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
    <Icon
      as={icon}
      boxSize={5}
      color={active ? "#5797bd" : "#294A5F"}
    />
    <Text fontSize="md">{label}</Text>
  </HStack>
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
}) => {
  // Rich text editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["paragraph", "heading"] }),
      TextStyleKit,
    ],
    content: templateContent || '<p></p>',
    onUpdate: ({ editor }) => {
      setTemplateContent(editor.getHTML());
    },
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <Box width="100%" flex="1" display="flex" flexDirection="column" minH={0}>
      <VStack spacing={6} align="stretch" flex="1" minH={0}>
        <Box
          bg="white"
          border="1px solid"
          borderColor="#EFEFF1"
          borderRadius="5px"
          boxShadow="sm"
          overflow="hidden"
          flex="1"
          display="flex"
          flexDirection="column"
          minH={0}
        >
          <RichTextEditor.Root editor={editor} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <RichTextEditor.Toolbar style={{ borderBottom: '1px solid #EFEFF1' }}>
              <RichTextEditor.ControlGroup>
                <Control.FontFamily />
                <Control.FontSize />
              </RichTextEditor.ControlGroup>
              <RichTextEditor.ControlGroup>
                <Control.Bold />
                <Control.Italic />
                <Control.Underline />
                <Control.Strikethrough />
              </RichTextEditor.ControlGroup>
              <RichTextEditor.ControlGroup>
                <Control.H1 />
                <Control.H2 />
                <Control.H3 />
                <Control.H4 />
              </RichTextEditor.ControlGroup>
            </RichTextEditor.Toolbar>
            <Box flex="1" minH={0}>
              <RichTextEditor.Content style={{ height: '100%', minHeight: 0 }} />
            </Box>
          </RichTextEditor.Root>
        </Box>
      </VStack>
    </Box>
  );
};
