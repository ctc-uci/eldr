import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

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
  const { folderId: urlFolderId, templateId: urlTemplateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);


  // get view from URL params
  // /email -> "folders"
  // /email/folder/:folderId -> "folderView"
  // /email/template/:templateId -> "newTemplate"
  const view = urlTemplateId ? "newTemplate" : urlFolderId ? "folderView" : "folders";

  // get folder context from query param (for template editor)
  const folderIdFromQuery = searchParams.get("folderId");

  const [templateName, setTemplateName] = useState("Untitled Template");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [showFolderPrompt, setShowFolderPrompt] = useState(false);
  const [isNewTemplate, setIsNewTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [folders, setFolders] = useState([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [showFolderNotFoundModal, setShowFolderNotFoundModal] = useState(false);
  const [pendingFolderName, setPendingFolderName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // derive currentFolder from URL params
  const activeFolderId = urlFolderId || folderIdFromQuery;
  const currentFolder = useMemo(() => {
    if (!activeFolderId || folders.length === 0) return null;
    return folders.find(f => String(f.id) === activeFolderId) || null;
  }, [activeFolderId, folders]);

  // fetch folders from backend on mount
  // callback to avoid refetching on every render
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

  // fetch templates when viewing a folder
  useEffect(() => {
    if (urlFolderId && currentFolder) {
      const fetchTemplates = async () => {
        try {
          setIsLoadingTemplates(true);
          const response = await backend.get(`/folders/${currentFolder.id}/templates`);
          setTemplates(response.data);
        } catch (error) {
          console.error('Error fetching templates:', error);
        } finally {
          setIsLoadingTemplates(false);
        }
      };
      fetchTemplates();
    }
  }, [urlFolderId, currentFolder, backend]);

  // fetch template data when navigating to template editor
  useEffect(() => {
    const fetchTemplateData = async () => {
      if (urlTemplateId) {
        // skip fetching for new unsaved templates (temp IDs start with 'new-')
        if (urlTemplateId.startsWith('new-')) {
          return;
        }
        try {
          const response = await backend.get(`/email-templates/${urlTemplateId}`);
          const template = response.data;
          setCurrentTemplateId(template.id);
          setTemplateName(template.name);
          setTemplateSubject(template.subject || '');
          setTemplateContent(template.templateText || template.template_text || '');
          setIsNewTemplate(false);
        } catch (error) {
          console.error('Error fetching template:', error);
          // navigate back to folders if template not found
          navigate('/email');
        }
      }
    };
    fetchTemplateData();
  }, [urlTemplateId, backend, navigate]);

  // fetch all templates on mount
  useEffect(() => {
    const fetchAllTemplates = async () => {
      try {
        const response = await backend.get('/email-templates');
        setAllTemplates(response.data);
      } catch (error) {
        console.error('Error fetching all templates:', error);
      }
    };
  
    fetchAllTemplates();
  }, [backend]);

  const [showNewTemplatePopover, setShowNewTemplatePopover] = useState(false);
  const [showNewFolderPopover, setShowNewFolderPopover] = useState(false);
  const [showFolderViewTemplatePopover, setShowFolderViewTemplatePopover] = useState(false);

  // create new folder from popover
  const handleCreateFolderFromPopover = async (name) => {
    try {
      const response = await backend.post('/folders', { name });
      const newFolder = response.data;
      
      setFolders((prev) => [...prev, newFolder]);
      setShowNewFolderPopover(false);
      navigate(`/email/folder/${newFolder.id}`);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  // navigate to folder view when clicking on a folder
  const handleFolderClick = (folder) => {
    setTemplates([]);
    navigate(`/email/folder/${folder.id}`);
  };

  // handle clicking on a template to open it in editor
  const handleTemplateClick = (template) => {
    // navigate to template editor with folder context in query param
    const folderParam = currentFolder?.id ? `?folderId=${currentFolder.id}` : '';
    navigate(`/email/template/${template.id}${folderParam}`);
  };

  // update template content in the database
  const updateTemplateInDb = async () => {
    if (!currentTemplateId) return;

    try {
      await backend.put(`/email-templates/${currentTemplateId}`, {
        name: templateName.trim(),
        template_text: templateContent,
        subject: templateSubject.trim() || null,
      });
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  };

  // helper to reset template form
  const resetTemplateForm = () => {
    setTemplateName("Untitled Template");
    setTemplateSubject("");
    setTemplateContent("");
    setCurrentTemplateId(null);
    setIsNewTemplate(false);
  };

  // handle save button click - save to db (if existing) and show folder popover
  const handleSaveButtonClick = async () => {
    try {
      // only update DB if this is an existing template
      if (!isNewTemplate && currentTemplateId) {
        await updateTemplateInDb();
      }
      setShowFolderPrompt(true);
    } catch (error) {
      alert('Failed to save template. Please try again.');
    }
  };

  // create new template from folder view (linked to current folder)
  const handleCreateTemplateFromFolderView = async (name) => {
    try {
      // create the email template
      const templateResponse = await backend.post('/email-templates', {
        name,
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
      setShowFolderViewTemplatePopover(false);
      navigate(`/email/template/${createdTemplate.id}?folderId=${currentFolder.id}`);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  // create new template from popover (links to current folder if in folderView)
  const handleCreateTemplateFromPopover = async (name) => {
    try {
      // if in folder view with a folder, create and link immediately
      if (view === "folderView" && currentFolder?.id) {
        const response = await backend.post('/email-templates', {
          name,
          template_text: '',
          subject: null,
        });
        const createdTemplate = response.data;

        await backend.post(`/email-templates/${createdTemplate.id}/folders`, {
          folderId: currentFolder.id,
        });

        setCurrentTemplateId(createdTemplate.id);
        setTemplateName(createdTemplate.name);
        setTemplateSubject('');
        setTemplateContent('');
        setIsNewTemplate(false);
        setShowNewTemplatePopover(false);
        navigate(`/email/template/${createdTemplate.id}?folderId=${currentFolder.id}`);
      } else {
        // from folders view: keep template in local state only until user saves to folder
        // use a temporary ID for routing (will be replaced when saved)
        const tempId = `new-${Date.now()}`;
        setCurrentTemplateId(null); // no DB id yet
        setTemplateName(name);
        setTemplateSubject('');
        setTemplateContent('');
        setIsNewTemplate(true);
        setShowNewTemplatePopover(false);
        navigate(`/email/template/${tempId}`);
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleSaveTemplate = async (folderToLink = null) => {
    const targetFolder = folderToLink || currentFolder;

    // validate folder - should be a folder object
    if (!targetFolder || !targetFolder.id) {
      alert("Please select a folder.");
      return;
    }

    try {
      let templateId = currentTemplateId;

      if (isNewTemplate) {
        // create the template in DB now
        const response = await backend.post('/email-templates', {
          name: templateName.trim(),
          template_text: templateContent,
          subject: templateSubject.trim() || null,
        });
        templateId = response.data.id;
      } else if (templateId) {
        // update existing template
        await updateTemplateInDb();
      } else {
        alert("No template to save.");
        return;
      }

      // link the template to the folder
      await backend.post(`/email-templates/${templateId}/folders`, {
        folderId: targetFolder.id,
      });

      // reset form
      resetTemplateForm();
      setShowFolderPrompt(false);

      // go back to folder view
      navigate(`/email/folder/${targetFolder.id}`);
    } catch (error) {
      console.error('Error saving template:', error);
      alert("Failed to save template. Please try again.");
    }
  };

  // handle searching/creating folder when saving template
  const handleAddFolderOnSave = async (folderName) => {
    if (!folderName?.trim()) return;
    
    try {
      const response = await backend.get(`/folders/search?name=${encodeURIComponent(folderName.trim())}`);
      const existingFolder = response.data;
      await handleSaveTemplate(existingFolder);
    } catch (error) {
      if (error.response?.status === 404) {
        setPendingFolderName(folderName.trim());
        setShowFolderNotFoundModal(true);
      } else {
        console.error('Error searching for folder:', error);
      }
    }
  };

  // delete template handler
  const handleDeleteTemplate = async () => {
    if (!currentTemplateId) return;

    try {
      await backend.delete(`/email-templates/${currentTemplateId}`);
      
      // reset form
      resetTemplateForm();
      setShowDeleteModal(false);

      // go back to folder if we have context, otherwise to folders list
      if (currentFolder?.id) {
        navigate(`/email/folder/${currentFolder.id}`);
      } else {
        navigate('/email');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert("Failed to delete template. Please try again.");
    }
  };

  // Filtered Data
  const suggestedFolders = searchTerm
  ? folders.filter(folder =>
      folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  const suggestedTemplates = searchTerm
  ? allTemplates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  // Pagination
  const paginatedFolders = folders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedTemplates = templates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalFolderPages = Math.ceil(folders.length / itemsPerPage) || 1;
  const totalTemplatePages = Math.ceil(templates.length / itemsPerPage) || 1;

  return (
    <Flex minH="100vh" bg="#FAFBFC">
      <Sidebar />
      <Flex direction="column" flex="1" px={10} py={8} minH="100vh">
        {/* Search Bar */}
        <Box position="relative" width="100%">
          <SearchBar
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              setShowSearchDropdown(value.length > 0);
            }}
            onFocus={() => {
              if (searchTerm.length > 0) setShowSearchDropdown(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSearchDropdown(false), 150);
            }}
          />

          {showSearchDropdown && (
            <Box
              position="absolute"
              top="100%"
              left="0"
              width="100%"
              bg="white"
              borderRadius="md"
              boxShadow="lg"
              zIndex="20"
              maxH="300px"
              overflowY="auto"
            >
              {suggestedFolders.length > 0 && (
                <>
                  <Box px={4} py={2} fontSize="xs" fontWeight="bold" color="gray.500">
                    Folders
                  </Box>
                  {suggestedFolders.slice(0, 5).map(folder => (
                    <Box
                      key={folder.id}
                      px={4}
                      py={2}
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => {
                        setSearchTerm("");
                        setShowSearchDropdown(false);
                        handleFolderClick(folder);
                      }}
                    >
                      {folder.name}
                    </Box>
                  ))}
                </>
              )}

              {suggestedTemplates.length > 0 && (
                <>
                  <Box px={4} py={2} fontSize="xs" fontWeight="bold" color="gray.500">
                    Files
                  </Box>
                  {suggestedTemplates.slice(0, 5).map(template => (
                    <Box
                      key={template.id}
                      px={4}
                      py={2}
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => {
                        setSearchTerm("");
                        setShowSearchDropdown(false);
                        handleTemplateClick(template);
                      }}
                    >
                      {template.name}
                    </Box>
                  ))}
                </>
              )}

              {suggestedFolders.length === 0 &&
                suggestedTemplates.length === 0 && (
                  <Box px={4} py={3} color="gray.500">
                    No results found
                  </Box>
                )}
            </Box>
          )}
        </Box>

        <Box borderBottom="1px solid" borderColor="gray.200" mt={5} mb={6} />

        {/* Breadcrumbs */}
        <BreadcrumbNav
          view={view}
          currentFolder={currentFolder}
          templateName={templateName}
        />

        {/* Title and Actions */}
        <Flex align="center" justify="space-between" mb={8}>
          {(view === "folders" || view === "folderView") ? (
            <>
              <Text fontSize="2xl" fontWeight="bold">
                {view === "folderView" ? "Manage your files" : "Manage your folders"}
              </Text>

              {(view === "folders" || (view === "folderView" && templates.length != 0)) && (
                <HStack spacing={4}>
                  <NewTemplatePopover
                    isOpen={showNewTemplatePopover}
                    onOpenChange={setShowNewTemplatePopover}
                    onSubmit={handleCreateTemplateFromPopover}
                  />
                  <NewFolderPopover
                    isOpen={showNewFolderPopover}
                    onOpenChange={setShowNewFolderPopover}
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
                  onTriggerClick={handleSaveButtonClick}
                  onAddFolder={handleAddFolderOnSave}
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
              paginatedFolders.map((folder) => (
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
          <Flex flex="1" direction="column" align="center" justify={templates.length === 0 ? "center" : "flex-start"} minH="400px">
            {isLoadingTemplates ? (
              <Text>Loading templates...</Text>
            ) : templates.length === 0 ? (
              <EmptyFolderState
                isPopoverOpen={showFolderViewTemplatePopover}
                onPopoverOpenChange={setShowFolderViewTemplatePopover}
                onCreateTemplate={handleCreateTemplateFromFolderView}
              />
            ) : (
              <VStack align="stretch" spacing={4} width="100%">
                {paginatedTemplates.map((template) => (
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
              key={currentTemplateId}
              templateContent={templateContent}
              setTemplateContent={setTemplateContent}
            />
          </Box>
        )}

        {/* Pagination - TODO: implement real pagination */}
        {(view === "folders" || view === "folderView") && (
          <Pagination
            totalPages={view === "folders" ? totalFolderPages : totalTemplatePages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
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
