import React, { useState, useRef, useEffect, useCallback } from "react";

import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

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
  SaveTemplatePopover,
  FolderNotFoundModal,
  DeleteTemplateModal,
} from "./components";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

export const EmailTemplateManagement = () => {
  const { backend } = useBackendContext();

  const [view, setView] = useState("folders");
  // "folders" | "newTemplate" | "folderView"

  const [templateName, setTemplateName] = useState("Untitled Template");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [showFolderPrompt, setShowFolderPrompt] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [templates, setTemplates] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [showFolderNotFoundModal, setShowFolderNotFoundModal] = useState(false);
  const [pendingFolderName, setPendingFolderName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch folders from backend on mount
  const fetchFolders = useCallback(async () => {
    try {
      setIsLoadingFolders(true);
      const response = await backend.get('/folders');
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setIsLoadingFolders(false);
    }
  }, [backend]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // fetch templates for a specific folder
  const fetchTemplatesInFolder = useCallback(async (folderId) => {
    try {
      setIsLoadingTemplates(true);
      const response = await backend.get(`/folders/${folderId}/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, [backend]);

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
  const handleCreateFolderFromPopover = async () => {
    const trimmedName = newFolderInput.trim();
    if (!trimmedName) return;

    try {
      const response = await backend.post('/folders', { name: trimmedName });
      const newFolder = response.data;
      
      setFolders((prev) => [...prev, newFolder]);
      setShowNewFolderPopover(false);
      setNewFolderInput("");
      setCurrentFolder(newFolder);
      setView("folderView");
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  // navigate to folder view when clicking on a folder
  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setTemplates([]);
    fetchTemplatesInFolder(folder.id);
    setView("folderView");
  };

  // get templates for current folder (already fetched)
  const getTemplatesInFolder = () => {
    return templates;
  };

  // handle clicking on a template to open it in editor
  const handleTemplateClick = (template) => {
    setCurrentTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateSubject(template.subject || '');
    setTemplateContent(template.templateText || '');
    setSelectedFolder(currentFolder);
    setView("newTemplate");
  };

  // update template content in the database
  const updateTemplateInDb = async () => {
    if (!currentTemplateId) return;

    try {
      setIsSavingTemplate(true);
      await backend.put(`/email-templates/${currentTemplateId}`, {
        name: templateName.trim(),
        template_text: templateContent,
        subject: templateSubject.trim() || null,
      });
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    } finally {
      setIsSavingTemplate(false);
    }
  };

  // handle save button click - save to db and show folder popover
  const handleSaveButtonClick = async () => {
    try {
      await updateTemplateInDb();
      setShowFolderPrompt(true);
    } catch (error) {
      alert('Failed to save template. Please try again.');
    }
  };

  // create new template from folder view (linked to current folder)
  const handleCreateTemplateFromFolderView = async () => {
    const trimmedName = folderViewTemplateInput.trim();
    if (!trimmedName) return;

    try {
      // create the email template
      const templateResponse = await backend.post('/email-templates', {
        name: trimmedName,
        template_text: '',
        subject: null,
      });
      const createdTemplate = templateResponse.data;

      // link the template to the current folder
      await backend.post(`/email-templates/${createdTemplate.id}/folders`, {
        folderId: currentFolder.id,
      });

      // set up template view for editing
      setCurrentTemplateId(createdTemplate.id);
      setTemplateName(createdTemplate.name);
      setTemplateSubject('');
      setTemplateContent(createdTemplate.templateText || '');
      setSelectedFolder(currentFolder);
      setShowFolderViewTemplatePopover(false);
      setFolderViewTemplateInput("");
      setView("newTemplate");
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  // handle folder view template popover open change
  const handleFolderViewTemplatePopoverOpenChange = (open) => {
    setShowFolderViewTemplatePopover(open);
    if (!open) {
      setFolderViewTemplateInput("");
    }
  };

  // create new template from popover (links to current folder if in folderView)
  const handleCreateTemplateFromPopover = async () => {
    const trimmedName = newTemplateInput.trim();
    if (!trimmedName) return;

    try {
      // create the email template without folder
      const response = await backend.post('/email-templates', {
        name: trimmedName,
        template_text: '',
        subject: null,
      });
      const createdTemplate = response.data;

      // if in folder view, link the template to the current folder
      if (view === "folderView" && currentFolder?.id) {
        await backend.post(`/email-templates/${createdTemplate.id}/folders`, {
          folderId: currentFolder.id,
        });
        setSelectedFolder(currentFolder);
      } else {
        setSelectedFolder('');
      }

      // set the current template for editing
      setCurrentTemplateId(createdTemplate.id);
      setTemplateName(createdTemplate.name);
      setTemplateSubject('');
      setTemplateContent(createdTemplate.templateText || '');
      setShowNewTemplatePopover(false);
      setNewTemplateInput("");
      setView("newTemplate");
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleSaveTemplate = async (folderToLink = null) => {
    // validate we have a template to save
    if (!currentTemplateId) {
      alert("No template selected.");
      return;
    }

    const targetFolder = folderToLink || selectedFolder;

    // validate folder - should be a folder object
    if (!targetFolder || !targetFolder.id) {
      alert("Please select a folder.");
      return;
    }

    try {
      console.log('Saving template with id', currentTemplateId, 'to folder', targetFolder.id);
      // link the existing template to the folder
      await backend.post(`/email-templates/${currentTemplateId}/folders`, {
        folderId: targetFolder.id,
      });

      // reset form
      setTemplateName("Untitled Template");
      setTemplateContent("");
      setCurrentTemplateId(null);
      setSelectedFolder("");
      setShowFolderPrompt(false);

      // go back to folder view and refresh templates
      setCurrentFolder(targetFolder);
      fetchTemplatesInFolder(targetFolder.id);
      setView("folderView");
    } catch (error) {
      console.error('Error saving template:', error);
      alert("Failed to save template. Please try again.");
    }
  };

  const totalPages = 6;
  const currentPage = 1;

  // delete template handler
  const handleDeleteTemplate = async () => {
    if (!currentTemplateId) return;

    try {
      await backend.delete(`/email-templates/${currentTemplateId}`);
      
      // reset form
      setTemplateName("Untitled Template");
      setTemplateSubject("");
      setTemplateContent("");
      setCurrentTemplateId(null);
      setShowDeleteModal(false);

      // go back to folders view
      setView("folders");
    } catch (error) {
      console.error('Error deleting template:', error);
      alert("Failed to delete template. Please try again.");
    }
  };

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
          selectedFolder={selectedFolder}
          onNavigateToFolders={() => setView("folders")}
          onNavigateToFolder={() => {
            if (selectedFolder && selectedFolder.id) {
              setCurrentFolder(selectedFolder);
              fetchTemplatesInFolder(selectedFolder.id);
              setView("folderView");
            }
          }}
        />

        {/* Title and Actions */}
        <Flex align="center" justify="space-between" mb={8}>
          {(view === "folders" || view === "folderView") ? (
            <>
              <Text fontSize="2xl" fontWeight="bold">
                {view === "folderView" ? "Manage your files" : "Manage your folders"}
              </Text>

              {(view === "folders" || (view === "folderView" && getTemplatesInFolder().length != 0)) && (
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
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
                placeholder="Untitled Template"
                variant="unstyled"
                fontSize="3xl"
                fontWeight="600"
                bg="#FAFBFC"
                px="0px"
                _focus={{ boxShadow: "none" }}
              />
              <HStack spacing={4} ml="auto">
                <SaveTemplatePopover
                  isOpen={showFolderPrompt}
                  onOpenChange={(open) => setShowFolderPrompt(open)}
                  newFolderName={newFolderName}
                  onNewFolderNameChange={setNewFolderName}
                  onTriggerClick={handleSaveButtonClick}
                  onAddFolder={async () => {
                    if (!newFolderName.trim()) return;
                    
                    try {
                      // search for folder by name
                      console.log('Searching for folder with name:', newFolderName.trim());
                      console.log('GET /folders/search?name=' + encodeURIComponent(newFolderName.trim()));
                      const response = await backend.get(`/folders/search?name=${encodeURIComponent(newFolderName.trim())}`);
                      const existingFolder = response.data;

                      console.log('Folder search response:', existingFolder);
                      
                      // folder exists, link template to it
                      await handleSaveTemplate(existingFolder);
                      setNewFolderName("");
                    } catch (error) {
                      if (error.response?.status === 404) {
                        setPendingFolderName(newFolderName.trim());
                        setShowFolderNotFoundModal(true);
                      } else {
                        console.error('Error searching for folder:', error);
                      }
                    }
                  }}
                />

                <Button
                  backgroundColor="#5797BD"
                  color="white"
                  w="292px"
                  onClick={() => setShowDeleteModal(true)}
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
            {isLoadingFolders ? (
              <Text>Loading folders...</Text>
            ) : folders.length === 0 ? (
              <Text>No folders yet. Create one to get started.</Text>
            ) : (
              folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  name={folder.name}
                  onClick={() => handleFolderClick(folder)}
                />
              ))
            )}
          </VStack>
        )}

        {/* Folder Content View */}
        {view === "folderView" && (
          <Flex flex="1" direction="column" align="center" justify={getTemplatesInFolder().length === 0 ? "center" : "flex-start"} minH="400px">
            {isLoadingTemplates ? (
              <Text>Loading templates...</Text>
            ) : getTemplatesInFolder().length === 0 ? (
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
                  <TemplateCard
                    key={template.id}
                    name={template.name}
                    onClick={() => handleTemplateClick(template)}
                  />
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

      {/* Folder Not Found Modal */}
      <FolderNotFoundModal
        isOpen={showFolderNotFoundModal}
        onClose={() => {
          setShowFolderNotFoundModal(false);
          setPendingFolderName("");
        }}
        folderName={pendingFolderName}
        onCreateFolder={async () => {
          try {
            const response = await backend.post('/folders', { name: pendingFolderName });
            const newFolder = response.data;
            setFolders((prev) => [...prev, newFolder]);
            setNewFolderName("");
            setShowFolderNotFoundModal(false);
            setPendingFolderName("");
            // link the template to the newly created folder
            await handleSaveTemplate(newFolder);
          } catch (error) {
            console.error('Error creating folder:', error);
          }
        }}
      />

      {/* Delete Template Modal */}
      <DeleteTemplateModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteTemplate}
      />
    </Flex>
  );
};
