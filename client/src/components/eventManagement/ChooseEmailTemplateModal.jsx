import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  CloseButton,
  Collapsible,
  Dialog,
  Input,
  InputGroup,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronDown, Search } from "lucide-react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

/**
 * Modal to pick an email template from the same folder/template data as /email (GET /folders, GET /folders/:id/templates).
 */
export const ChooseEmailTemplateModal = ({
  open,
  onOpenChange,
  initialSelection,
  onConfirm,
}) => {
  const { backend } = useBackendContext();
  const [folders, setFolders] = useState([]);
  const [templatesByFolderId, setTemplatesByFolderId] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [draftSelection, setDraftSelection] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const foldersRes = await backend.get("/folders");
      const folderList = foldersRes.data ?? [];
      setFolders(folderList);
      const pairs = await Promise.all(
        folderList.map(async (f) => {
          const t = await backend.get(`/folders/${f.id}/templates`);
          return [f.id, t.data ?? []];
        })
      );
      setTemplatesByFolderId(Object.fromEntries(pairs));
    } catch (err) {
      console.error("Error loading folders/templates:", err);
      setFolders([]);
      setTemplatesByFolderId({});
    } finally {
      setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    if (!open) return;
    setDraftSelection(initialSelection ?? null);
    setSearch("");
  }, [open, initialSelection]);

  useEffect(() => {
    if (!open) return;
    loadData();
  }, [open, loadData]);

  const visibleFolders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return folders;
    return folders.filter((f) => {
      if ((f.name || "").toLowerCase().includes(q)) return true;
      const temps = templatesByFolderId[f.id] || [];
      return temps.some((t) => (t.name || "").toLowerCase().includes(q));
    });
  }, [folders, templatesByFolderId, search]);

  const getTemplatesForFolder = (folder) => {
    const temps = templatesByFolderId[folder.id] || [];
    const q = search.trim().toLowerCase();
    if (!q) return temps;
    if ((folder.name || "").toLowerCase().includes(q)) return temps;
    return temps.filter((t) => (t.name || "").toLowerCase().includes(q));
  };

  const handleSave = () => {
    if (!draftSelection) return;
    onConfirm?.(draftSelection);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement="center"
      size="lg"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="520px" bg="white">
            <Dialog.Header
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pr={2}
            >
              <Dialog.Title fontWeight="semibold" fontSize="lg">
                Choose Email Template
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" aria-label="Close" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body>
              <VStack align="stretch" gap={4}>
                <InputGroup startElement={<Search size={16} color="#A1A1AA" />}>
                  <Input
                    placeholder="Search for Template..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    borderColor="gray.300"
                    rounded="l2"
                  />
                </InputGroup>

                <Box
                  borderWidth="1px"
                  borderColor="gray.200"
                  rounded="l2"
                  maxH="360px"
                  overflowY="auto"
                >
                  {loading ? (
                    <Text py={6} px={4} color="gray.500" fontSize="sm">
                      Loading…
                    </Text>
                  ) : visibleFolders.length === 0 ? (
                    <Text py={6} px={4} color="gray.500" fontSize="sm">
                      No folders or templates match your search.
                    </Text>
                  ) : (
                    visibleFolders.map((folder) => (
                      <FolderTemplatesCollapsible
                        key={folder.id}
                        folder={folder}
                        templates={getTemplatesForFolder(folder)}
                        selectedId={draftSelection?.id}
                        onSelectTemplate={(t) =>
                          setDraftSelection({ id: t.id, name: t.name })
                        }
                      />
                    ))
                  )}
                </Box>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer gap={3} justifyContent="flex-end">
              <Button
                variant="outline"
                borderColor="gray.300"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                disabled={!draftSelection}
                opacity={draftSelection ? 1 : 0.5}
                onClick={handleSave}
              >
                Save
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

const FolderTemplatesCollapsible = ({
  folder,
  templates,
  selectedId,
  onSelectTemplate,
}) => {
  return (
    <Collapsible.Root defaultOpen={false}>
      <Collapsible.Trigger
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        py={3}
        px={4}
        cursor="pointer"
        borderBottomWidth="1px"
        borderColor="gray.200"
        _hover={{ bg: "gray.50" }}
      >
        <Text fontSize="sm" fontWeight="semibold" color="gray.800">
          {folder.name}
        </Text>
        <Collapsible.Indicator
          transition="transform 0.2s"
          _open={{ transform: "rotate(180deg)" }}
          _closed={{ transform: "rotate(0deg)" }}
        >
          <ChevronDown size={18} color="#4B5563" />
        </Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <VStack align="stretch" gap={0} pb={2} pt={1}>
          {templates.length === 0 ? (
            <Text fontSize="sm" color="gray.500" px={4} py={2}>
              No templates in this folder.
            </Text>
          ) : (
            templates.map((t) => {
              const selected =
                selectedId != null && String(selectedId) === String(t.id);
              return (
                <Button
                  key={t.id}
                  type="button"
                  variant="ghost"
                  w="100%"
                  justifyContent="flex-start"
                  h="auto"
                  py={2.5}
                  pl={8}
                  pr={4}
                  fontSize="sm"
                  fontWeight="normal"
                  color="gray.700"
                  rounded="none"
                  bg={selected ? "blue.50" : "transparent"}
                  borderLeftWidth={selected ? "3px" : "0"}
                  borderLeftColor="blue.500"
                  _hover={{ bg: selected ? "blue.50" : "gray.50" }}
                  onClick={() => onSelectTemplate(t)}
                >
                  {t.name}
                </Button>
              );
            })
          )}
        </VStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
