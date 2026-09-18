import { useEffect, useMemo, useState } from "react";

import { Box, Button, Flex, Input, InputGroup } from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { Search } from "lucide-react";
import { TbTag } from "react-icons/tb";

import { CreateTagPopover } from "./CreateTagPopover";
import { DeleteTagDialog } from "./DeleteTagDialog";
import { EditTagDialog } from "./EditTagDialog";
import { MultiSelectActionBar } from "./MultiSelectActionBar";
import { TagSectionTable } from "./TagSectionTable";

type TagRow = {
  id: number;
  name: string;
  clinicCount: number;
  volunteerCount: number;
};

type Section = {
  title: string;
  rows: TagRow[];
};

type TagFormValues = {
  name: string;
  category: string;
};

const initialSections: Section[] = [
  { title: "Areas of Practice", rows: [] },
  { title: "Workshop Types", rows: [] },
  { title: "Languages", rows: [] },
  { title: "Roles", rows: [] },
  { title: "Miscellaneous", rows: [] },
];

const sectionAliasMap: Record<string, string> = {
  "Areas of Practice": "Areas of Practice",
  "Workshop Types": "Workshop Types",
  Languages: "Languages",
  Roles: "Roles",
  Miscellaneous: "Miscellaneous",
};

export const TagManagement = () => {
  const { backend } = useBackendContext();
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [sortField, setSortField] = useState<
    "name" | "clinicCount" | "volunteerCount"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isCreatePopoverOpen, setIsCreatePopoverOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<{
    sectionTitle: string;
    row: TagRow;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTagGroups = async () => {
      try {
        const [areasRes, workshopTypesRes, languagesRes, rolesRes, tagsRes] =
          await Promise.all([
            backend.get("/areas-of-practice"),
            backend.get("/workshop-types"),
            backend.get("/languages"),
            backend.get("/roles"),
            backend.get("/tags"),
          ]);

        const safeAreas = Array.isArray(areasRes?.data) ? areasRes.data : [];
        const safeWorkshopTypes = Array.isArray(workshopTypesRes?.data)
          ? workshopTypesRes.data
          : [];
        const safeLanguages = Array.isArray(languagesRes?.data)
          ? languagesRes.data
          : [];
        const safeRoles = Array.isArray(rolesRes?.data) ? rolesRes.data : [];
        const safeTags = Array.isArray(tagsRes?.data) ? tagsRes.data : [];

        setSections([
          {
            title: "Areas of Practice",
            rows: safeAreas.map(
              (entry: {
                id: number;
                areasOfPractice?: string;
                areaOfPractice?: string;
                name?: string;
                clinicCount?: number;
                volunteerCount?: number;
              }) => ({
                id: entry.id,
                name:
                  entry.areasOfPractice ??
                  entry.areaOfPractice ??
                  entry.name ??
                  "",
                clinicCount: entry.clinicCount ?? 0,
                volunteerCount: entry.volunteerCount ?? 0,
              })
            ),
          },
          {
            title: "Workshop Types",
            rows: safeWorkshopTypes.map(
              (entry: {
                id: number;
                workshopType?: string;
                name?: string;
              }) => ({
                id: entry.id,
                name: entry.workshopType ?? entry.name ?? "",
                clinicCount: 0,
                volunteerCount: 0,
              })
            ),
          },
          {
            title: "Languages",
            rows: safeLanguages.map(
              (entry: {
                id: number;
                language?: string;
                name?: string;
                clinicCount?: number;
                volunteerCount?: number;
              }) => ({
                id: entry.id,
                name: entry.language ?? entry.name ?? "",
                clinicCount: entry.clinicCount ?? 0,
                volunteerCount: entry.volunteerCount ?? 0,
              })
            ),
          },
          {
            title: "Roles",
            rows: safeRoles.map(
              (entry: {
                id: number;
                roleName?: string;
                name?: string;
                clinicCount?: number;
                volunteerCount?: number;
              }) => ({
                id: entry.id,
                name: entry.roleName ?? entry.name ?? "",
                clinicCount: entry.clinicCount ?? 0,
                volunteerCount: entry.volunteerCount ?? 0,
              })
            ),
          },
          {
            title: "Miscellaneous",
            rows: safeTags.map(
              (entry: {
                id: number;
                tag?: string;
                name?: string;
                clinicCount?: number;
                volunteerCount?: number;
              }) => ({
                id: entry.id,
                name: entry.tag ?? entry.name ?? "",
                clinicCount: entry.clinicCount ?? 0,
                volunteerCount: entry.volunteerCount ?? 0,
              })
            ),
          },
        ]);
      } catch (error) {
        console.error("Failed to load tag groups", error);
      }
    };

    fetchTagGroups();
  }, [backend]);

  const getRowKey = (sectionTitle: string, rowName: string) =>
    `${sectionTitle}::${rowName}`;

  const selectedRows = useMemo(
    () =>
      sections.flatMap((section) =>
        section.rows
          .filter((row) =>
            selectedRowKeys.includes(getRowKey(section.title, row.name))
          )
          .map((row) => ({ sectionTitle: section.title, row }))
      ),
    [sections, selectedRowKeys]
  );

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sections
      .map((section) => ({
        ...section,
        rows: [...section.rows]
          .filter(
            (row) =>
              row.name.toLowerCase().includes(query) || query.length === 0
          )
          .sort((a, b) => {
            const comparison =
              sortField === "name"
                ? a.name.localeCompare(b.name, undefined, {
                    sensitivity: "base",
                  })
                : a[sortField] - b[sortField];
            return sortDirection === "asc" ? comparison : -comparison;
          }),
      }))
      .filter((section) => query.length === 0 || section.rows.length > 0);
  }, [searchQuery, sections, sortDirection, sortField]);

  const handleSort = (field: "name" | "clinicCount" | "volunteerCount") => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  };

  const toggleRowSelection = (sectionTitle: string, rowName: string) => {
    const rowKey = getRowKey(sectionTitle, rowName);

    setSelectedRowKeys((prev) =>
      prev.includes(rowKey)
        ? prev.filter((key) => key !== rowKey)
        : [...prev, rowKey]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const getDeletePath = (sectionTitle: string, id: number) => {
    const basePaths: Record<string, string> = {
      "Areas of Practice": "areas-of-practice",
      "Workshop Types": "workshop-types",
      Languages: "languages",
      Roles: "roles",
      Miscellaneous: "tags",
    };
    const basePath = basePaths[sectionTitle];
    return basePath ? `/${basePath}/${id}` : null;
  };

  const handleConfirmDelete = async () => {
    if (selectedRows.length === 0 || isDeleting) return;

    try {
      setIsDeleting(true);
      const rowsToDelete = [...selectedRows];
      const deletePaths = rowsToDelete
        .map(({ sectionTitle, row }) => getDeletePath(sectionTitle, row.id))
        .filter((path): path is string => path !== null);

      await Promise.all(deletePaths.map((path) => backend.delete(path)));

      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          rows: section.rows.filter(
            (row) =>
              !rowsToDelete.some(
                (selected) =>
                  selected.sectionTitle === section.title &&
                  selected.row.id === row.id
              )
          ),
        }))
      );
      setSelectedRowKeys([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete selected tags", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSectionSelection = (
    sectionTitle: string,
    rows: Section["rows"]
  ) => {
    const sectionKeys = rows.map((row) => getRowKey(sectionTitle, row.name));
    const allSelected = sectionKeys.every((key) =>
      selectedRowKeys.includes(key)
    );

    setSelectedRowKeys((prev) => {
      if (allSelected) {
        return prev.filter((key) => !sectionKeys.includes(key));
      }

      return [...new Set([...prev, ...sectionKeys])];
    });
  };

  const handleEditSelected = () => {
    if (selectedRows.length !== 1) return;

    const selected = selectedRows[0];
    if (!selected) return;

    setEditingRow(selected);
  };

  const handleEdit = async (nextName: string) => {
    if (!editingRow) return;

    const updateRequest = {
      "Areas of Practice": () =>
        backend.put(`/areas-of-practice/${editingRow.row.id}`, {
          areaOfPractice: nextName,
        }),
      "Workshop Types": () =>
        backend.put(`/workshop-types/${editingRow.row.id}`, {
          workshopType: nextName,
        }),
      Languages: () =>
        backend.put(`/languages/${editingRow.row.id}`, { language: nextName }),
      Roles: () =>
        backend.put(`/roles/${editingRow.row.id}`, { roleName: nextName }),
      Miscellaneous: () =>
        backend.put(`/tags/${editingRow.row.id}`, { text: nextName }),
    }[editingRow.sectionTitle];

    if (!updateRequest) return;
    await updateRequest();

    setSections((prev) =>
      prev.map((section) =>
        section.title === editingRow.sectionTitle
          ? {
              ...section,
              rows: section.rows.map((item) =>
                item.id === editingRow.row.id
                  ? { ...item, name: nextName }
                  : item
              ),
            }
          : section
      )
    );
    setSelectedRowKeys([]);
  };

  const handleCreateTag = async (newTag: TagFormValues) => {
    if (!newTag.category || !newTag.name.trim()) return;

    const targetSection =
      sectionAliasMap[newTag.category] ?? "Areas of Practice";
    const createRequest = {
      "Areas of Practice": () =>
        backend.post("/areas-of-practice", {
          areaOfPractice: newTag.name.trim(),
        }),
      "Workshop Types": () =>
        backend.post("/workshop-types", { workshopType: newTag.name.trim() }),
      Languages: () =>
        backend.post("/languages", { language: newTag.name.trim() }),
      Roles: () => backend.post("/roles", { roleName: newTag.name.trim() }),
      Miscellaneous: () => backend.post("/tags", { text: newTag.name.trim() }),
    }[targetSection];

    if (!createRequest) return;

    const response = await createRequest();
    const createdEntry = Array.isArray(response?.data)
      ? response.data[0]
      : response?.data;
    if (!createdEntry?.id) return;

    setSections((prev) =>
      prev.map((section) =>
        section.title === targetSection
          ? {
              ...section,
              rows: [
                {
                  id: createdEntry.id,
                  name: newTag.name.trim(),
                  clinicCount: 0,
                  volunteerCount: 0,
                },
                ...section.rows,
              ],
            }
          : section
      )
    );

    setIsCreatePopoverOpen(false);
  };

  return (
    <Flex
      h="100vh"
      bg="white"
      justify="center"
    >
      <Box
        w="100%"
        maxW="1280px"
        px="24px"
        py="18px"
      >
        <Flex
          justify="space-between"
          align="center"
          gap="18px"
          mb="18px"
        >
          <Box flex={1} />

          <Flex
            align="center"
            gap="16px"
            ml="auto"
            w="100%"
          >
            <Box
              position="relative"
              flex={1}
            >
              <InputGroup
                endElement={
                  <Search
                    size={16}
                    color="gray.400"
                  />
                }
              >
                <Input
                  placeholder="Search for a tag..."
                  h="48px"
                  borderColor="gray.300"
                  borderRadius="4px"
                  bg="white"
                  fontSize="16px"
                  _placeholder={{ color: "gray.400" }}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </InputGroup>
            </Box>

            <Box
              position="relative"
              flexShrink={0}
            >
              <Button
                bg="brand.navy"
                color="white"
                h="40px"
                px="18px"
                borderRadius="4px"
                fontSize="14px"
                fontWeight={600}
                _hover={{ bg: "primary.500" }}
                onClick={() => setIsCreatePopoverOpen((prev) => !prev)}
              >
                <TbTag
                  size={18}
                  style={{ marginRight: "8px" }}
                />
                Create Tag
              </Button>

              {isCreatePopoverOpen && (
                <Box
                  position="absolute"
                  top="48px"
                  right={0}
                  zIndex={2}
                >
                  <CreateTagPopover onSave={handleCreateTag} />
                </Box>
              )}
            </Box>
          </Flex>
        </Flex>

        <MultiSelectActionBar
          selectedRows={selectedRows}
          onEdit={handleEditSelected}
          onDelete={handleDeleteSelected}
          onClear={() => setSelectedRowKeys([])}
        />

        <Box
          borderTop="1px solid"
          borderColor="gray.200"
        >
          {filteredSections.map((section) => (
            <TagSectionTable
              key={section.title}
              sectionTitle={section.title}
              rows={section.rows}
              selectedRowKeys={selectedRowKeys}
              sortField={sortField}
              sortDirection={sortDirection}
              onToggleRowSelection={toggleRowSelection}
              onToggleSectionSelection={toggleSectionSelection}
              onNameSortClick={() => handleSort("name")}
              onClinicSortClick={() => handleSort("clinicCount")}
              onVolunteerSortClick={() => handleSort("volunteerCount")}
              getRowKey={getRowKey}
            />
          ))}
        </Box>

        {editingRow && (
          <EditTagDialog
            open
            currentName={editingRow.row.name}
            onClose={() => setEditingRow(null)}
            onSave={handleEdit}
          />
        )}

        <DeleteTagDialog
          open={isDeleteDialogOpen}
          count={selectedRows.length}
          isDeleting={isDeleting}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </Box>
    </Flex>
  );
};
