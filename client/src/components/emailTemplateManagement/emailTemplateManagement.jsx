import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import { Pencil, Save, Trash2 } from "lucide-react";

import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  HStack,
  Input,
  NativeSelect,
  Portal,
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
  NewTemplateSection,
  DeleteTemplateModal,
  RenameFolderDialog,
  ContextMenu,
  RenameDialog,
} from "./components";


import { useBackendContext } from "@/contexts/hooks/useBackendContext";

export const EmailTemplateManagement = () => {
  const { backend } = useBackendContext();
  const { folderId: urlFolderId, templateId: urlTemplateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const listContainerRef = useRef(null);
  // dynamic listing based on browswer size
  // card height: py=15*2 + lineHeight=24 + border=2 = 56px; gap between cards = 16px
  const CARD_HEIGHT = 56;
  const CARD_GAP = 16;

  useEffect(() => {
    const el = listContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const available = el.clientHeight;
      if (available <= 0) return;
      // n cards take: n*CARD_HEIGHT + (n-1)*CARD_GAP = n*(CARD_HEIGHT+CARD_GAP) - CARD_GAP
      const n = Math.max(1, Math.floor((available + CARD_GAP) / (CARD_HEIGHT + CARD_GAP)));
      setItemsPerPage(prev => {
        if (prev !== n) setCurrentPage(1);
        return n;
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
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
  const [initialTemplateSnapshot, setInitialTemplateSnapshot] = useState({
    name: "Untitled Template",
    subject: "",
    content: "",
  });
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [isNewTemplate, setIsNewTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [folders, setFolders] = useState([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [showMoveTemplateModal, setShowMoveTemplateModal] = useState(false);
  const [moveFolderId, setMoveFolderId] = useState("");
  const [isMovingTemplate, setIsMovingTemplate] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState(null); // { x, y, type: 'folder'|'template', item }
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null); // { type, item }
  const [deleteTarget, setDeleteTarget] = useState(null); // folder item targeted from context menu

  // inline title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitleValue, setEditingTitleValue] = useState("");
  const titleInputRef = useRef(null);

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

  // Reset pagination when switching views/folders so we don't land on an empty stale page.
  useEffect(() => {
    setCurrentPage(1);
  }, [view, urlFolderId]);

  const fetchTemplatesForFolder = useCallback(
    async (folderId) => {
      if (!folderId) return;
      try {
        setIsLoadingTemplates(true);
        const response = await backend.get(`/folders/${folderId}/templates`);
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setIsLoadingTemplates(false);
      }
    },
    [backend]
  );

  // fetch templates when viewing a folder
  useEffect(() => {
    if (!urlFolderId) return;
    fetchTemplatesForFolder(urlFolderId);
  }, [urlFolderId, fetchTemplatesForFolder]);

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
          const content = template.templateText || template.template_text || '';
          setTemplateContent(content);
          setInitialTemplateSnapshot({
            name: template.name || "Untitled Template",
            subject: template.subject || "",
            content,
          });
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

  // rename the current folder
  const handleRenameFolder = async (newName) => {
    if (!currentFolder?.id) return;
    try {
      const response = await backend.put(`/folders/${currentFolder.id}`, { name: newName });
      const updated = response.data;
      setFolders((prev) =>
        prev.map((f) => (f.id === updated.id ? { ...f, name: updated.name } : f))
      );
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  };


  // navigate to folder view when clicking on a folder
  const handleFolderClick = (folder) => {
    setCurrentPage(1);
    setTemplates([]);
    navigate(`/email/folder/${folder.id}`);
  };

  // handle clicking on a template to open it in editor
  const handleTemplateClick = async (template) => {
    // navigate to template editor with folder context in query param
    // always resolve from linked folders so search clicks can switch breadcrumb context
    // when currentFolder is valid for this template, preserve it; otherwise use first linked folder
    let folderIdForTemplate = null;

    if (template?.id) {
      try {
        const linkedFoldersResponse = await backend.get(`/email-templates/${template.id}/folders`);
        const linkedFolders = linkedFoldersResponse.data || [];

        if (linkedFolders.length > 0) {
          const matchedCurrentFolder = linkedFolders.find(
            (folder) => String(folder.id) === String(currentFolder?.id ?? "")
          );
          folderIdForTemplate = matchedCurrentFolder ? matchedCurrentFolder.id : linkedFolders[0].id;
        }
      } catch (error) {
        console.error("Error fetching linked folders for template:", error);
      }
    }

    const folderParam = folderIdForTemplate ? `?folderId=${folderIdForTemplate}` : '';
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
    setInitialTemplateSnapshot({
      name: "Untitled Template",
      subject: "",
      content: "",
    });
    setCurrentTemplateId(null);
    setIsNewTemplate(false);
  };

  const normalizeEditorContent = useCallback((content = "") => {
    const normalized = content.trim();
    return normalized === "<p></p>" ? "" : normalized;
  }, []);

  const hasUnsavedChanges = useMemo(() => {
    return (
      templateName !== initialTemplateSnapshot.name ||
      templateSubject !== initialTemplateSnapshot.subject ||
      normalizeEditorContent(templateContent) !== normalizeEditorContent(initialTemplateSnapshot.content)
    );
  }, [
    templateName,
    templateSubject,
    templateContent,
    initialTemplateSnapshot,
    normalizeEditorContent,
  ]);

  const openMoveTemplateModalWithDefaultFolder = () => {
    const firstAvailableFolder = folders.find(
      (folder) => String(folder.id) !== String(currentFolder?.id ?? "")
    );
    setMoveFolderId(firstAvailableFolder ? String(firstAvailableFolder.id) : "");
    setShowMoveTemplateModal(true);
  };

  const hasNoLinkedFolders = async (templateId) => {
    if (!templateId) return true;
    const linkedFoldersResponse = await backend.get(`/email-templates/${templateId}/folders`);
    return (linkedFoldersResponse.data || []).length === 0;
  };

  const handleSaveButtonClick = async () => {
    try {
      let shouldOpenMoveModal = false;

      if (isNewTemplate) {
        const response = await backend.post("/email-templates", {
          name: templateName.trim(),
          template_text: templateContent,
          subject: templateSubject.trim() || null,
        });
        const created = response.data;
        setCurrentTemplateId(created.id);
        setIsNewTemplate(false);
        setInitialTemplateSnapshot({
          name: templateName.trim() || "Untitled Template",
          subject: templateSubject,
          content: templateContent,
        });
        setAllTemplates((prev) => {
          const exists = prev.some((t) => t.id === created.id);
          if (exists) return prev;
          return [...prev, { ...created, name: created.name, templateText: created.templateText ?? templateContent }];
        });
        navigate(
          `/email/template/${created.id}${folderIdFromQuery ? `?folderId=${folderIdFromQuery}` : ""}`
        );

        // Only prompt for move/link if the newly-created template has no folder links yet
        try {
          shouldOpenMoveModal = await hasNoLinkedFolders(created.id);
        } catch (error) {
          // If link lookup fails, preserve current behavior and avoid blocking save
          shouldOpenMoveModal = false;
        }
      } else if (currentTemplateId) {
        await updateTemplateInDb();
        setInitialTemplateSnapshot({
          name: templateName.trim() || "Untitled Template",
          subject: templateSubject,
          content: templateContent,
        });
      } else {
        alert("No template to save.");
        return;
      }

      if (shouldOpenMoveModal) {
        openMoveTemplateModalWithDefaultFolder();
      }
    } catch (error) {
      alert("Failed to save template. Please try again.");
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

      setTemplates((prev) => [
        ...prev,
        {
          id: createdTemplate.id,
          name: createdTemplate.name,
          templateText: createdTemplate.templateText || "",
          subject: createdTemplate.subject || null,
        },
      ]);
      setAllTemplates((prev) => {
        const exists = prev.some((t) => String(t.id) === String(createdTemplate.id));
        if (exists) return prev;
        return [...prev, createdTemplate];
      });

      // set up template view for editing
      setCurrentTemplateId(createdTemplate.id);
      setTemplateName(createdTemplate.name);
      setTemplateSubject('');
      const content = createdTemplate.templateText || '';
      setTemplateContent(content);
      setInitialTemplateSnapshot({
        name: createdTemplate.name || "Untitled Template",
        subject: "",
        content,
      });
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

        setTemplates((prev) => [
          ...prev,
          {
            id: createdTemplate.id,
            name: createdTemplate.name,
            templateText: createdTemplate.templateText || "",
            subject: createdTemplate.subject || null,
          },
        ]);
        setAllTemplates((prev) => {
          const exists = prev.some((t) => String(t.id) === String(createdTemplate.id));
          if (exists) return prev;
          return [...prev, createdTemplate];
        });

        setCurrentTemplateId(createdTemplate.id);
        setTemplateName(createdTemplate.name);
        setTemplateSubject('');
        setTemplateContent('');
        setInitialTemplateSnapshot({
          name: createdTemplate.name || "Untitled Template",
          subject: "",
          content: "",
        });
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
        setInitialTemplateSnapshot({
          name,
          subject: "",
          content: "",
        });
        setIsNewTemplate(true);
        setShowNewTemplatePopover(false);
        navigate(`/email/template/${tempId}`);
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  // delete template handler
  const handleDeleteTemplate = async () => {
    if (!currentTemplateId) return;

    try {
      await backend.delete(`/email-templates/${currentTemplateId}`);

      // optimistically remove from local state
      setTemplates((prev) => prev.filter((t) => t.id !== currentTemplateId));
      setAllTemplates((prev) => prev.filter((t) => t.id !== currentTemplateId));

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

  // rename template handler (from context menu)
  const handleRenameTemplate = async (templateId, newName) => {
    if (!templateId) {
      setTemplateName(newName);
      return;
    }

    try {
      // The PUT endpoint requires name + template_text (and optionally subject).
      // Pull the existing values from state so we only change the name.
      const existing = templates.find((t) => t.id === templateId);
      await backend.put(`/email-templates/${templateId}`, {
        name: newName,
        template_text: existing?.templateText ?? existing?.template_text ?? "",
        subject: existing?.subject ?? null,
      });

      setTemplateName((prev) => (String(currentTemplateId) === String(templateId) ? newName : prev));
      setTemplates((prev) =>
        prev.map((t) => (t.id === templateId ? { ...t, name: newName } : t))
      );
      setAllTemplates((prev) =>
        prev.map((t) => (t.id === templateId ? { ...t, name: newName } : t))
      );
    } catch (error) {
      console.error('Error renaming template:', error);
    }
  };

  // rename folder handler (from context menu — folders not in folderView)
  const handleRenameFolderById = async (folderId, newName) => {
    try {
      const response = await backend.put(`/folders/${folderId}`, { name: newName });
      const updated = response.data;
      setFolders((prev) =>
        prev.map((f) => (f.id === updated.id ? { ...f, name: updated.name } : f))
      );
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  };

  // delete folder handler — works for both the folderView header button and context menu on root
  const handleDeleteFolder = async () => {
    const targetId = deleteTarget?.id ?? currentFolder?.id;
    if (!targetId) return;
    try {
      await backend.delete(`/folders/${targetId}`);
      // optimistically remove from local state immediately
      setFolders((prev) => prev.filter((f) => f.id !== targetId));
      setShowDeleteFolderModal(false);
      setDeleteTarget(null);
      // only navigate away if we're currently inside that folder
      if (currentFolder?.id === targetId) {
        navigate('/email');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleMoveTemplate = async () => {
    if (!moveFolderId) return;

    const destinationFolderId = String(moveFolderId);
    const sourceFolderId = currentFolder?.id ? String(currentFolder.id) : null;
    if (sourceFolderId && sourceFolderId === destinationFolderId) {
      setShowMoveTemplateModal(false);
      return;
    }

    try {
      setIsMovingTemplate(true);
      let effectiveTemplateId =
        currentTemplateId || (urlTemplateId && !urlTemplateId.startsWith("new-") ? urlTemplateId : null);

      // If move is triggered before we have a persistent id, create/save first
      if (!effectiveTemplateId && isNewTemplate) {
        const response = await backend.post("/email-templates", {
          name: templateName.trim(),
          template_text: templateContent,
          subject: templateSubject.trim() || null,
        });
        const created = response.data;
        effectiveTemplateId = created.id;
        setCurrentTemplateId(created.id);
        setIsNewTemplate(false);
        setInitialTemplateSnapshot({
          name: templateName.trim() || "Untitled Template",
          subject: templateSubject,
          content: templateContent,
        });
        setAllTemplates((prev) => {
          const exists = prev.some((t) => String(t.id) === String(created.id));
          if (exists) return prev;
          return [...prev, { ...created, name: created.name, templateText: created.templateText ?? templateContent }];
        });
      }

      if (!effectiveTemplateId) {
        alert("No saved template found to move.");
        return;
      }

      // check current template-folder links first to avoid duplicates
      const linkedFoldersResponse = await backend.get(`/email-templates/${effectiveTemplateId}/folders`);
      const isAlreadyLinked = (linkedFoldersResponse.data || []).some(
        (folder) => String(folder.id) === destinationFolderId
      );

      if (!isAlreadyLinked) {
        const destinationFolder = folders.find(
          (folder) => String(folder.id) === destinationFolderId
        );
        await backend.post(`/email-templates/${effectiveTemplateId}/folders`, {
          folderId: destinationFolder?.id ?? destinationFolderId,
        });
      }

      if (sourceFolderId) {
        try {
          await backend.delete(`/email-templates/${effectiveTemplateId}/folders/${sourceFolderId}`);
        } catch (error) {
          if (error?.response?.status !== 404) throw error;
        }
      }

      setShowMoveTemplateModal(false);
      setMoveFolderId("");
      navigate(`/email/folder/${destinationFolderId}`);
    } catch (error) {
      console.error("Error moving template:", error);
      alert("Failed to move template. Please try again.");
    } finally {
      setIsMovingTemplate(false);
    }
  };

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

  // Highlight search term matches in result text
  const HighlightMatch = ({ text, query }) => {
    if (!query) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <strong>{text.slice(idx, idx + query.length)}</strong>
        {text.slice(idx + query.length)}
      </>
    );
  };

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
    <Flex direction="column" flex="1" minH="100vh" bg="white" px={10} py={8}>
        {/* Search Bar */}
        <Box position="relative" width="100%">
          <SearchBar
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              setShowSearchDropdown(value.length > 0);
            }}
            onClear={() => {
              setSearchTerm("");
              setShowSearchDropdown(false);
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
                      <HighlightMatch text={folder.name} query={searchTerm} />
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
                      <HighlightMatch text={template.name} query={searchTerm} />
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

        {/* Breadcrumbs - hidden on root folder page */}
        {view !== "folders" && (
          <>
            <BreadcrumbNav
              view={view}
              currentFolder={currentFolder}
              templateName={templateName}
              mt={5}
              mb={6}
            />
          </>
        )}

        {/* Title and Actions */}
        <Flex align="center" justify="space-between" mb={8} pt={view === "folders" ? "40px" : 0}>
          {(view === "folders" || view === "folderView") ? (
            <>
              <Flex align="center" gap="6px">
                <Text fontSize="2xl" fontWeight="bold">
                  {view === "folderView" ? (currentFolder?.name ?? "Folder") : "Manage your folders"}
                </Text>
                {view === "folderView" && currentFolder && (
                  <RenameFolderDialog
                    folderName={currentFolder.name}
                    onRename={handleRenameFolder}
                  />
                )}
              </Flex>

              {/* Right side actions */}
              <HStack spacing={4}>
                {view === "folders" && (
                  <>
                    <NewTemplatePopover
                      isOpen={showNewTemplatePopover}
                      onOpenChange={setShowNewTemplatePopover}
                      onSubmit={handleCreateTemplateFromPopover}
                      buttonProps={{ h: "40px", fontSize: "14px", px: "16px", fontWeight: "500" }}
                    />
                    <NewFolderPopover
                      isOpen={showNewFolderPopover}
                      onOpenChange={setShowNewFolderPopover}
                      onSubmit={handleCreateFolderFromPopover}
                      buttonProps={{ h: "40px", fontSize: "14px", px: "16px", fontWeight: "500" }}
                    />
                  </>
                )}
                {view === "folderView" && templates.length !== 0 && (
                  <NewTemplatePopover
                    isOpen={showNewTemplatePopover}
                    onOpenChange={setShowNewTemplatePopover}
                    onSubmit={handleCreateTemplateFromPopover}
                    buttonProps={{
                      h: "40px",
                      fontSize: "14px",
                      px: "16px",
                      fontWeight: "500",
                      ...(showDeleteFolderModal
                        ? {
                            backgroundColor: "#E4E4E7",
                            color: "black",
                            _hover: { bg: "#E4E4E7" },
                          }
                        : {}),
                    }}
                  />
                )}
                {view === "folderView" && 
                  (templates.length === 0 ?
                    <Button
                      bg="#DC2626"
                      color="white"
                      h="40px"
                      px="16px"
                      fontSize="14px"
                      fontWeight="500"
                      borderRadius="4px"
                      borderWidth="1px"
                      borderColor="#DC2626"
                      onClick={() => setShowDeleteFolderModal(true)}
                      display="flex"
                      gap="8px"
                      alignItems="center"
                    >
                      <Trash2 size={16} />
                      Delete Folder
                    </Button>
                  :
                    <Button
                      bg={showNewTemplatePopover ? "#E4E4E7" : "white"}
                      color={showNewTemplatePopover ? "black" : "#991919"}
                      h="40px"
                      px="16px"
                      fontSize="14px"
                      fontWeight="500"
                      borderRadius="4px"
                      borderWidth="1px"
                      borderColor={showNewTemplatePopover ? "#E4E4E7" : "#FECACA"}
                      _hover={showNewTemplatePopover ? { bg: "#E4E4E7" } : { bg: "#FEE2E2" }}
                      onClick={() => setShowDeleteFolderModal(true)}
                      display="flex"
                      gap="8px"
                      alignItems="center"
                    >
                      <Trash2 size={16} />
                      Delete Folder
                    </Button>
                )}
              </HStack>
            </>
          ) : (
            <>
              <HStack spacing={10} w="100%" alignContent="space-between">
                <HStack spacing={4}>
                  {isEditingTitle ? (
                    <Input
                      ref={titleInputRef}
                      value={editingTitleValue}
                      onChange={(e) => setEditingTitleValue(e.target.value)}
                      onBlur={() => {
                        const trimmed = editingTitleValue.trim();
                        if (trimmed && trimmed !== templateName) {
                          handleRenameTemplate(currentTemplateId, trimmed);
                        }
                        setIsEditingTitle(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        } else if (e.key === "Escape") {
                          setIsEditingTitle(false);
                        }
                      }}
                      fontSize="3xl"
                      fontWeight="600"
                      lineHeight="1.2"
                      border="none"
                      borderBottom="2px solid"
                      borderColor="#487C9E"
                      borderRadius="0"
                      px="0"
                      bg="transparent"
                      _focus={{ boxShadow: "none", borderColor: "#294A5F" }}
                      autoFocus
                      h="auto"
                      minW="200px"
                    />
                  ) : (
                    <Text
                      fontSize="3xl"
                      fontWeight="600"
                      lineHeight="1.2"
                      cursor="text"
                      onDoubleClick={() => {
                        setEditingTitleValue(templateName);
                        setIsEditingTitle(true);
                      }}
                      title="Double-click to rename"
                    >
                      {templateName}
                    </Text>
                  )}
                  <Pencil
                    size={20}
                    cursor="pointer"
                    onClick={() => {
                      setRenameTarget({
                        type: "template",
                        item: { id: currentTemplateId, name: templateName },
                      });
                      setShowRenameDialog(true);
                    }}
                  />
                </HStack>
                
                <HStack spacing={4} ml="auto">
                  <Button
                    h="40px"
                    px="16px"
                    fontSize="14px"
                    fontWeight="500"
                    borderRadius="4px"
                    display="flex"
                    gap="8px"
                    alignItems="center"
                    backgroundColor={
                      showRenameDialog || showDeleteModal
                        ? "#E4E4E7"
                        : showMoveTemplateModal
                          ? "#294A5F"
                          : "#487C9E"
                    }
                    color={showRenameDialog || showDeleteModal ? "black" : "white"}
                    _hover={{
                      bg:
                        showRenameDialog || showDeleteModal
                          ? "#E4E4E7"
                          : showMoveTemplateModal
                            ? "#294A5F"
                            : "#294A5F",
                    }}
                    onClick={async () => {
                      if (hasUnsavedChanges) {
                        await handleSaveButtonClick();
                        return;
                      }
                      try {
                        const templateIdToCheck =
                          currentTemplateId ||
                          (urlTemplateId && !urlTemplateId.startsWith("new-") ? urlTemplateId : null);
                        const shouldOpenMoveModal = await hasNoLinkedFolders(templateIdToCheck);
                        if (shouldOpenMoveModal) {
                          openMoveTemplateModalWithDefaultFolder();
                        }
                      } catch (error) {
                        // don't block user flow on lookup errors
                      }
                    }}
                  >
                    {hasUnsavedChanges ? <Save size={16} /> : <Pencil size={16} />}
                    {hasUnsavedChanges ? "Save" : "Edit"}
                  </Button>

                  <Button
                    variant="outline"
                    color={showMoveTemplateModal || showRenameDialog ? "black" : "#991919"}
                    borderColor={showMoveTemplateModal || showRenameDialog ? "#E4E4E7" : "#FECACA"}
                    bg={showMoveTemplateModal || showRenameDialog ? "#E4E4E7" : "transparent"}
                    _hover={showMoveTemplateModal || showRenameDialog ? { bg: "#E4E4E7" } : { bg: "#FEE2E2" }}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </HStack>
              </HStack>
            </>
          )}
        </Flex>

        {/* Folder List View */}
        {view === "folders" && (
          <VStack ref={listContainerRef} align="stretch" spacing={4} mb={8} flex="1" overflow="hidden">
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
                  onContextMenu={(e) =>
                    setContextMenu({ x: e.clientX, y: e.clientY, type: "folder", item: folder })
                  }
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
                    onContextMenu={(e) =>
                      setContextMenu({ x: e.clientX, y: e.clientY, type: "template", item: template })
                    }
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
              templateSubject={templateSubject}
              setTemplateSubject={setTemplateSubject}
              templateContent={templateContent}
              setTemplateContent={setTemplateContent}
            />
          </Box>
        )}

        {/* Pagination */}
        {(view === "folders" || (view === "folderView" && templates.length > 0)) && (
          <Pagination
            totalPages={view === "folders" ? totalFolderPages : totalTemplatePages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={view === "folders" ? folders.length : templates.length}
            itemsPerPage={itemsPerPage}
          />
        )}

      {/* Right-click Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onView={() => {
            if (contextMenu.type === "folder") handleFolderClick(contextMenu.item);
            else handleTemplateClick(contextMenu.item);
          }}
          onRename={() => {
            setRenameTarget({ type: contextMenu.type, item: contextMenu.item });
            setShowRenameDialog(true);
          }}
          onDelete={() => {
            if (contextMenu.type === "folder") {
              // store the target folder and open the confirmation modal directly
              // (no navigation needed — handleDeleteFolder now uses deleteTarget)
              setDeleteTarget(contextMenu.item);
              setShowDeleteFolderModal(true);
            } else {
              setCurrentTemplateId(contextMenu.item.id);
              setShowDeleteModal(true);
            }
          }}
        />
      )}

      {/* Rename Dialog (context menu trigger) */}
      <RenameDialog
        isOpen={showRenameDialog}
        onClose={() => { setShowRenameDialog(false); setRenameTarget(null); }}
        currentName={renameTarget?.item?.name ?? ""}
        title={renameTarget?.type === "folder" ? "Rename Folder" : "Rename Template"}
        onRename={(newName) => {
          if (renameTarget?.type === "folder") {
            handleRenameFolderById(renameTarget.item.id, newName);
          } else {
            if (renameTarget?.item?.id) {
              handleRenameTemplate(renameTarget.item.id, newName);
            } else {
              setTemplateName(newName);
            }
          }
        }}
      />

      <Dialog.Root
        open={showMoveTemplateModal}
        onOpenChange={(e) => {
          setShowMoveTemplateModal(e.open);
          if (!e.open) setMoveFolderId("");
        }}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.400" />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="448px"
              w="448px"
              borderRadius="6px"
              boxShadow="0px 0px 1px 0px rgba(24,24,27,0.3), 0px 8px 16px 0px rgba(24,24,27,0.1)"
              bg="white"
              overflow="hidden"
            >
              <Dialog.CloseTrigger position="absolute" top="0" right="0" asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
              <Dialog.Header pt="24px" pb="16px" px="24px">
                <Dialog.Title fontSize="18px" fontWeight="600" lineHeight="28px" color="black">
                  Move &quot;{templateName}&quot;
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pt="8px" pb="16px" px="24px">
                <Flex direction="column" gap="4px">
                  <Text fontSize="14px" fontWeight="500" lineHeight="20px" color="black">
                    Select Folder
                  </Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={moveFolderId}
                      onChange={(e) => setMoveFolderId(e.target.value)}
                      h="40px"
                      px="12px"
                      fontSize="14px"
                      borderWidth="1px"
                      borderColor="#E4E4E7"
                      borderRadius="4px"
                      bg="white"
                    >
                      <option value="" disabled>
                        Select destination folder
                      </option>
                      {folders
                        .filter((folder) => String(folder.id) !== String(currentFolder?.id ?? ""))
                        .map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer pt="8px" pb="16px" px="24px" justifyContent="flex-end" gap="12px">
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    h="40px"
                    px="16px"
                    fontSize="14px"
                    fontWeight="500"
                    borderWidth="1px"
                    borderColor="#E4E4E7"
                    borderRadius="4px"
                    color="#27272A"
                    bg="white"
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  h="40px"
                  px="16px"
                  fontSize="14px"
                  fontWeight="500"
                  borderRadius="4px"
                  bg="#487C9E"
                  color="white"
                  _hover={{ bg: "#3D6B89" }}
                  onClick={handleMoveTemplate}
                  disabled={!moveFolderId || isMovingTemplate}
                >
                  Move
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Delete Template Modal */}
      <DeleteTemplateModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteTemplate}
      />

      {/* Confirm Delete Folder Dialog (top-level so it works from both header button and context menu) */}
      <Dialog.Root
        open={showDeleteFolderModal}
        onOpenChange={(e) => {
          setShowDeleteFolderModal(e.open);
          if (!e.open) setDeleteTarget(null);
        }}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.400" />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="400px"
              w="400px"
              borderRadius="6px"
              boxShadow="0px 0px 1px 0px rgba(24,24,27,0.3), 0px 8px 16px 0px rgba(24,24,27,0.1)"
              bg="white"
              overflow="hidden"
            >
              <Dialog.CloseTrigger position="absolute" top="0" right="0" asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
              <Dialog.Header pt="24px" pb="8px" px="24px">
                <Dialog.Title fontSize="18px" fontWeight="600" color="black">
                  Delete Folder
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body px="24px" pb="16px">
                <Text fontSize="14px" color="#52525B">
                  Are you sure you want to delete <strong>{deleteTarget?.name ?? currentFolder?.name}</strong>? This action cannot be undone.
                </Text>
              </Dialog.Body>
              <Dialog.Footer px="24px" pb="16px" justifyContent="flex-end" gap="12px">
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    h="40px"
                    px="16px"
                    fontSize="14px"
                    fontWeight="500"
                    borderWidth="1px"
                    borderColor="#E4E4E7"
                    borderRadius="4px"
                    color="#27272A"
                    bg="white"
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  h="40px"
                  px="16px"
                  fontSize="14px"
                  fontWeight="500"
                  borderRadius="4px"
                  bg="#DC2626"
                  color="white"
                  _hover={{ bg: "#B91C1C" }}
                  onClick={handleDeleteFolder}
                >
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};
