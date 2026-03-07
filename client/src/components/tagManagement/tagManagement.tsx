import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Info,
  ListFilter,
  ListPlus,
  Plus,
  SquarePlus,
  Tag,
  Tags,
} from "lucide-react";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { buildAppliedTo, type TagItem } from "./types";
import { StaffSidebar } from "./StaffSidebar";
import { TagRow } from "./TagRow";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { CreateTagView } from "./CreateTagView";

export const TagManagement = () => {
  const { backend } = useBackendContext();
  const [tags, setTags] = useState<TagItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "create">("list");

  const sortParam = activeTab === "most-used" ? "most-used" : activeTab === "recent" ? "recent" : undefined;

  const fetchTags = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (sortParam) params.sort = sortParam;

      const { data } = await backend.get("/tags", { params });
      const mapped: TagItem[] = data.map(
        (t: { id: number; tag: string; description: string | null; caseCount: number; clinicCount: number; volunteerCount: number }) => ({
          id: t.id,
          name: t.tag,
          description: t.description ?? "",
          appliedTo: buildAppliedTo(t),
        })
      );
      setTags(mapped);
    } catch (e) {
      console.error("Failed to fetch tags", e);
    }
  }, [backend, searchQuery, sortParam]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return tags
      .filter((t) => t.name.toLowerCase().includes(q))
      .map((t) => t.name)
      .slice(0, 5);
  }, [tags, searchQuery]);

  const handleDelete = async (id: number) => {
    try {
      await backend.delete(`/tags/${id}`);
      setTags((prev) => prev.filter((t) => t.id !== id));
      setExpandedId(null);
    } catch (e) {
      console.error("Failed to delete tag", e);
    }
  };

  const handleEdit = (_id: number) => {
    // Placeholder for edit functionality
  };

  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCreateTag = async (newTag: { name: string; applyTo: string; description: string }) => {
    try {
      await backend.post("/tags", {
        text: newTag.name,
        description: newTag.description,
      });
      setView("list");
      fetchTags();
    } catch (e) {
      console.error("Failed to create tag", e);
    }
  };

  return (
    <Flex h="100vh" bg="white">
      <StaffSidebar />

      {view === "create" ? (
        <CreateTagView onCancel={() => setView("list")} onSave={handleCreateTag} />
      ) : (
        <Box flex={1} overflow="auto" px="70px" py="60px">
          <Flex align="center" gap="20px" mb="10px">
            <SearchAutocomplete
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              suggestions={suggestions}
              onSelectSuggestion={(val) => setSearchQuery(val)}
            />

            <Button
              bg="#5797bd"
              color="white"
              h="40px"
              px="16px"
              borderRadius="4px"
              fontSize="14px"
              fontWeight={500}
              _hover={{ bg: "#4a86a8" }}
              flexShrink={0}
              onClick={() => setView("create")}
            >
              <Plus size={20} />
              Create Tag
            </Button>
          </Flex>

          <VStack align="start" gap="16px" py="10px" mb="10px">
            <Tabs.Root
              value={activeTab}
              onValueChange={(e) => setActiveTab(e.value)}
              variant="plain"
            >
              <Tabs.List bg="white" borderRadius="4px" h="36px" gap={0}>
                <Tabs.Trigger
                  value="all"
                  px="12px"
                  py="4px"
                  gap="10px"
                  fontSize="14px"
                  color="#52525b"
                  borderRadius="4px"
                  border="none"
                  _selected={{ bg: "#f4f4f5", color: "#27272a" }}
                >
                  <Tag size={16} />
                  All
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="most-used"
                  px="12px"
                  py="4px"
                  gap="10px"
                  fontSize="14px"
                  color="#52525b"
                  borderRadius="4px"
                  border="none"
                  _selected={{ bg: "#f4f4f5", color: "#27272a" }}
                >
                  <Tags size={16} />
                  Most Used
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="recent"
                  px="12px"
                  py="4px"
                  gap="10px"
                  fontSize="14px"
                  color="#52525b"
                  borderRadius="4px"
                  border="none"
                  _selected={{ bg: "#f4f4f5", color: "#27272a" }}
                >
                  <SquarePlus size={16} />
                  Recently Added
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            <Text fontSize="20px" fontWeight={500} lineHeight="30px" color="black">
              Tags
            </Text>

            <Button
              bg="#e4e4e7"
              color="black"
              h="32px"
              px="10px"
              borderRadius="4px"
              fontSize="12px"
              fontWeight={500}
            >
              <ListFilter size={16} />
              Filter & Sort
            </Button>
          </VStack>

          <Flex
            align="center"
            gap="10px"
            px="10px"
            py="10px"
            borderBottomWidth="1px"
            borderColor="#e4e4e7"
          >
            <HStack px="16px" w="257px" flexShrink={0} gap="8px">
              <Tag size={20} color="black" />
              <Text fontSize="14px" fontWeight={500} color="black">
                Name
              </Text>
            </HStack>
            <HStack px="16px" w="300px" flexShrink={0} gap="8px">
              <Info size={20} color="black" />
              <Text fontSize="14px" fontWeight={500} color="black">
                Description
              </Text>
            </HStack>
            <HStack px="16px" flex={1} gap="8px">
              <ListPlus size={20} color="black" />
              <Text fontSize="14px" fontWeight={500} color="black">
                Applied to
              </Text>
            </HStack>
          </Flex>

          <Box>
            {tags.map((tag) => (
              <TagRow
                key={tag.id}
                tag={tag}
                expandedId={expandedId}
                onToggleExpand={handleToggleExpand}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </Box>
        </Box>
      )}
    </Flex>
  );
};
