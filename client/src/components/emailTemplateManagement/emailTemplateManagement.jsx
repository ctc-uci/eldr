import React, { useState, useRef } from "react";

import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaPlus } from "react-icons/fa";

import {
  SearchBar,
  BreadcrumbNav,
  Pagination,
  FolderCard,
  TemplateCard,
  NewTemplatePopover,
  NewFolderPopover,
  EmptyFolderState,
  Sidebar,
  NewTemplateSection,
} from "./components";

export const EmailTemplateManagement = () => {
  const [view, setView] = useState("folders");
  // "folders" | "newTemplate" | "folderView"

  const [templateName, setTemplateName] = useState("Untitled Template");
  const [templateContent, setTemplateContent] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [showFolderPrompt, setShowFolderPrompt] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [_showFolderModal, setShowFolderModal] = useState(false);
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

  const _handleSaveTemplate = () => {
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

  // TODO: Connect this to the save button when folder selection is complete
  void _handleSaveTemplate;

  const totalPages = 6;
  const currentPage = 1;

  return (
    <Flex minH="100vh" bg="#FAFBFC">
      <Sidebar />
      <Flex direction="column" flex="1" px={10} py={8} minH="100vh">
        {/* Search Bar */}
        <SearchBar />

        {/* Breadcrumbs */}
        <BreadcrumbNav
          view={view}
          currentFolder={currentFolder}
          templateName={templateName}
          onNavigateToFolders={() => setView("folders")}
        />

        {/* Title and Actions */}
        <Flex align="center" justify="space-between" mb={8}>
          {(view === "folders" || view === "folderView") ? (
            <>
              <Text fontSize="2xl" fontWeight="bold">
                {view === "folderView" ? "Manage your files" : "Manage your folders"}
              </Text>

              {view === "folders" && (
                <HStack spacing={4}>
                  <NewTemplatePopover
                    isOpen={showNewTemplatePopover}
                    onOpenChange={handleTemplatePopoverOpenChange}
                    inputRef={templateInputRef}
                    inputValue={newTemplateInput}
                    onInputChange={setNewTemplateInput}
                    onSubmit={handleCreateTemplateFromPopover}
                  />
                  <NewFolderPopover
                    isOpen={showNewFolderPopover}
                    onOpenChange={handleFolderPopoverOpenChange}
                    inputRef={folderInputRef}
                    inputValue={newFolderInput}
                    onInputChange={setNewFolderInput}
                    onSubmit={handleCreateFolderFromPopover}
                  />
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
              <HStack spacing={4} ml="auto">
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
                  w="292px"
                  onClick={() => setView("folders")}
                >
                  Delete Template
                </Button>
              </HStack>
            </>
          )}
        </Flex>

        {/* Folder List View */}
        {view === "folders" && (
          <VStack align="stretch" spacing={4} mb={8} flex="1">
            {folders.map((folder, idx) => (
              <FolderCard
                key={idx}
                name={folder}
                onClick={() => handleFolderClick(folder)}
              />
            ))}
          </VStack>
        )}

        {/* Folder Content View */}
        {view === "folderView" && (
          <Flex flex="1" direction="column" align="center" justify="center" minH="400px">
            {getTemplatesInFolder().length === 0 ? (
              <EmptyFolderState
                isPopoverOpen={showFolderViewTemplatePopover}
                onPopoverOpenChange={handleFolderViewTemplatePopoverOpenChange}
                inputRef={folderViewTemplateInputRef}
                inputValue={folderViewTemplateInput}
                onInputChange={setFolderViewTemplateInput}
                onCreateTemplate={handleCreateTemplateFromFolderView}
              />
            ) : (
              <VStack align="stretch" spacing={4} width="100%">
                {getTemplatesInFolder().map((template) => (
                  <TemplateCard key={template.id} name={template.name} />
                ))}
              </VStack>
            )}
          </Flex>
        )}

        {/* New Template Editor View */}
        {view === "newTemplate" && (
          <Box flex="1" minH={0} display="flex" flexDirection="column">
            <NewTemplateSection
              templateContent={templateContent}
              setTemplateContent={setTemplateContent}
            />
          </Box>
        )}

        {/* Pagination */}
        {(view === "folders" || view === "folderView") && (
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        )}
      </Flex>
    </Flex>
  );
};
