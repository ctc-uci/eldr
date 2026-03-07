import { useState, useMemo, useRef, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  Tabs,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleUser,
  ClipboardList,
  Info,
  ListFilter,
  ListPlus,
  Mail,
  Plus,
  Search,
  SquarePlus,
  Tag,
  Tags,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useLocation } from "react-router-dom";

type AppliedType = "Cases" | "Events" | "Profiles";

interface TagAppliedTo {
  type: AppliedType;
  count: number;
}

interface TagItem {
  id: number;
  name: string;
  description: string;
  appliedTo: TagAppliedTo[];
}

const APPLIED_BORDER_COLORS: Record<AppliedType, string> = {
  Cases: "#ef4444",
  Events: "#116932",
  Profiles: "#2563eb",
};

const APPLY_TO_OPTIONS = ["Cases", "Events", "Profiles"] as const;

const SAMPLE_TAGS: TagItem[] = [
  { id: 1, name: "Korean", description: "Korean Language Support", appliedTo: [{ type: "Cases", count: 5 }, { type: "Events", count: 32 }, { type: "Profiles", count: 20 }] },
  { id: 2, name: "Senior-Client", description: "Case / Event Requirement", appliedTo: [{ type: "Cases", count: 10 }, { type: "Events", count: 10 }] },
  { id: 3, name: "Urgent Volunteer", description: "Custom label for [Event]", appliedTo: [{ type: "Events", count: 20 }] },
  { id: 4, name: "Veteran", description: "Case / Event Detail", appliedTo: [{ type: "Cases", count: 2 }] },
  { id: 5, name: "Low-Income", description: "Case / Event Detail", appliedTo: [{ type: "Cases", count: 7 }, { type: "Events", count: 5 }] },
  { id: 6, name: "Immigration", description: "Case / Event Category", appliedTo: [{ type: "Cases", count: 3 }, { type: "Events", count: 10 }, { type: "Profiles", count: 20 }] },
  { id: 7, name: "Family Elderly Law", description: "Case / Event Category", appliedTo: [{ type: "Events", count: 21 }] },
  { id: 8, name: "Interpreter", description: "Case / Event Requirement", appliedTo: [{ type: "Events", count: 2 }, { type: "Profiles", count: 6 }] },
  { id: 9, name: "Medical Advocate", description: "Case / Event Requirement", appliedTo: [{ type: "Events", count: 5 }, { type: "Profiles", count: 1 }] },
  { id: 10, name: "Translator", description: "Case / Event Requirement", appliedTo: [{ type: "Profiles", count: 5 }] },
];

const NAV_ITEMS = [
  { label: "Event Catalog", icon: ClipboardList, path: "/event-catalog" },
  { label: "Case Catalog", icon: BriefcaseBusiness, path: "/case-catalog" },
  { label: "Email Template", icon: Mail, path: "/email" },
  { label: "Manage Profiles", icon: CircleUser, path: "/manage-profiles" },
  { label: "Manage Tags", icon: Tag, path: "/manage-tags" },
];

function StaffSidebar() {
  const location = useLocation();

  return (
    <Flex
      direction="column"
      w="269px"
      h="100vh"
      bg="white"
      borderRightWidth="1px"
      borderColor="#e0e0e0"
      py="49px"
      px="30px"
      flexShrink={0}
      justifyContent="space-between"
    >
      <VStack align="start" gap="38px">
        <Image
          src="/eldr-logo.png"
          alt="Elder Law & Disability Rights Center"
          h="60px"
          w="168px"
          objectFit="contain"
        />

        <VStack gap="24px" w="full">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Flex
                key={item.label}
                as="a"
                href={item.path}
                align="center"
                gap="12px"
                w="full"
                px="23px"
                py="16px"
                borderRadius="8px"
                bg={isActive ? "#d8f1ff" : "transparent"}
                cursor="pointer"
                _hover={{ bg: isActive ? "#d8f1ff" : "#f4f4f5" }}
                textDecoration="none"
              >
                <Icon size={23} color="#294a5f" />
                <Text
                  fontSize="16px"
                  fontWeight="bold"
                  color="#294a5f"
                  lineHeight="24px"
                >
                  {item.label}
                </Text>
              </Flex>
            );
          })}
        </VStack>
      </VStack>

      <Avatar.Root size="lg">
        <Avatar.Fallback name="Staff" />
        <Avatar.Image src="" />
      </Avatar.Root>
    </Flex>
  );
}

function AppliedChip({ type, count }: TagAppliedTo) {
  return (
    <Flex
      align="center"
      justify="center"
      h="32px"
      px="10px"
      borderRadius="4px"
      border="1px solid"
      borderColor={APPLIED_BORDER_COLORS[type]}
    >
      <Text fontSize="12px" fontWeight={500} color="#27272a" whiteSpace="nowrap">
        {type} ({count})
      </Text>
    </Flex>
  );
}

function TagRow({
  tag,
  expandedId,
  onToggleExpand,
  onDelete,
  onEdit,
}: {
  tag: TagItem;
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  const isExpanded = expandedId === tag.id;

  return (
    <Box w="full">
      <Flex
        align="center"
        gap="10px"
        px="10px"
        py="10px"
        borderBottomWidth={isExpanded ? "0" : "1px"}
        borderColor="#f4f4f5"
        w="full"
      >
        <Flex align="center" px="16px" w="257px" flexShrink={0}>
          <Flex
            align="center"
            justify="center"
            h="36px"
            px="14px"
            borderRadius="4px"
            bg="#f4f4f5"
            border="1px solid #d4d4d8"
          >
            <Text fontSize="14px" fontWeight={500} color="black" whiteSpace="nowrap">
              {tag.name}
            </Text>
          </Flex>
        </Flex>

        <Flex align="center" px="16px" w="300px" flexShrink={0}>
          <Text fontSize="14px" fontWeight={500} color="black" lineHeight="20px">
            {tag.description}
          </Text>
        </Flex>

        <Flex align="center" gap="10px" px="16px" flex={1}>
          {tag.appliedTo.map((applied) => (
            <AppliedChip key={applied.type} {...applied} />
          ))}
        </Flex>

        <IconButton
          aria-label={isExpanded ? "Collapse" : "Expand"}
          variant="ghost"
          size="sm"
          color="#71717a"
          onClick={() => onToggleExpand(tag.id)}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </IconButton>
      </Flex>

      {isExpanded && (
        <Flex
          align="center"
          justify="space-between"
          ml="26px"
          pl="10px"
          pr="10px"
          py="10px"
          borderBottomWidth="1px"
          borderColor="#f4f4f5"
          bg="#fafafa"
          borderRadius="3px"
        >
          <Box
            borderBottomWidth="1px"
            borderColor="#e4e4e7"
            pb="6px"
          >
            <Text fontSize="14px" fontWeight={400} color="black">
              {tag.name}
            </Text>
          </Box>
          <HStack gap="12px">
            <Button
              size="sm"
              h="32px"
              px="12px"
              bg="#fefce8"
              border="1px solid #fef08a"
              color="#27272a"
              fontSize="12px"
              fontWeight={500}
              borderRadius="4px"
              _hover={{ bg: "#fef9c3" }}
              onClick={() => onEdit(tag.id)}
            >
              <TriangleAlert size={14} />
              Edit
            </Button>
            <Button
              size="sm"
              h="32px"
              px="12px"
              bg="#fee2e2"
              border="1px solid #fecaca"
              color="#27272a"
              fontSize="12px"
              fontWeight={500}
              borderRadius="4px"
              _hover={{ bg: "#fecaca" }}
              onClick={() => onDelete(tag.id)}
            >
              <Trash2 size={14} color="#ef4444" />
              Delete
            </Button>
          </HStack>
        </Flex>
      )}
    </Box>
  );
}

function SearchAutocomplete({
  searchQuery,
  onSearchChange,
  suggestions,
  onSelectSuggestion,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  suggestions: string[];
  onSelectSuggestion: (value: string) => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box ref={wrapperRef} position="relative" flex={1}>
      <InputGroup startElement={<Search size={16} color="#a1a1aa" />}>
        <Input
          placeholder="Search for a tag..."
          borderColor="#ccccd1"
          borderRadius="4px"
          h="48px"
          fontSize="16px"
          _placeholder={{ color: "#a1a1aa" }}
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setShowSuggestions(e.target.value.trim().length > 0);
          }}
          onFocus={() => {
            if (searchQuery.trim().length > 0) setShowSuggestions(true);
          }}
        />
      </InputGroup>

      {showSuggestions && suggestions.length > 0 && (
        <Box
          position="absolute"
          top="52px"
          left={0}
          right={0}
          bg="white"
          border="1px solid #e4e4e7"
          borderRadius="4px"
          boxShadow="0 4px 12px rgba(0,0,0,0.08)"
          zIndex={10}
          maxH="240px"
          overflowY="auto"
        >
          {suggestions.map((s) => (
            <Box
              key={s}
              px="18px"
              py="10px"
              cursor="pointer"
              fontSize="14px"
              color="#27272a"
              _hover={{ bg: "#f4f4f5" }}
              onClick={() => {
                onSelectSuggestion(s);
                setShowSuggestions(false);
              }}
            >
              {s}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

function CreateTagView({ onCancel, onSave }: { onCancel: () => void; onSave: (tag: { name: string; applyTo: string; description: string }) => void }) {
  const [tagName, setTagName] = useState("");
  const [applyTo, setApplyTo] = useState("");
  const [description, setDescription] = useState("");
  const [applyDropdownOpen, setApplyDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setApplyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (!tagName.trim() || !applyTo || !description.trim()) return;
    onSave({ name: tagName.trim(), applyTo, description: description.trim() });
  };

  return (
    <Box flex={1} overflow="auto" px="70px" py="60px">
      {/* Breadcrumb */}
      <HStack gap="8px" mb="10px">
        <Button
          variant="ghost"
          px="16px"
          h="40px"
          fontSize="16px"
          fontWeight="bold"
          color="#27272a"
          borderRadius="4px"
          onClick={onCancel}
        >
          Tag Management
        </Button>
        <ChevronRight size={16} color="#27272a" opacity={0.8} />
        <Button
          variant="ghost"
          px="20px"
          h="48px"
          fontSize="16px"
          fontWeight="bold"
          color="#5797bd"
          borderRadius="4px"
          textDecoration="underline"
        >
          Create Tag
        </Button>
      </HStack>

      {/* Header */}
      <Box
        borderBottomWidth="1px"
        borderColor="#d4d4d8"
        pb="30px"
        pt="16px"
        pl="76px"
        mb="50px"
      >
        <Text fontSize="30px" fontWeight="bold" lineHeight="38px" color="#294a5f">
          Create New Tag
        </Text>
      </Box>

      {/* Form */}
      <Flex gap="57px" align="flex-start" pl="0">
        {/* Left column */}
        <VStack align="start" gap="47px" flex={1} maxW="571px">
          {/* Tag Name */}
          <VStack align="start" gap="6px" w="full">
            <HStack gap="4px">
              <Text fontSize="18px" fontWeight={500} lineHeight="28px" color="black">
                Tag Name
              </Text>
              <Text fontSize="10px" color="#991919" lineHeight="14px">*</Text>
            </HStack>
            <Input
              placeholder="Type here"
              h="52px"
              borderColor="#e4e4e7"
              borderRadius="4px"
              px="18px"
              fontSize="16px"
              _placeholder={{ color: "#a1a1aa" }}
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
          </VStack>

          {/* Description */}
          <VStack align="start" gap="6px" w="full">
            <HStack gap="4px">
              <Text fontSize="18px" fontWeight={500} lineHeight="28px" color="black">
                Description
              </Text>
              <Text fontSize="10px" color="#991919" lineHeight="14px">*</Text>
            </HStack>
            <Textarea
              placeholder="Type here"
              h="320px"
              borderColor="#e4e4e7"
              borderRadius="4px"
              px="18px"
              py="14px"
              fontSize="16px"
              resize="vertical"
              _placeholder={{ color: "#a1a1aa" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </VStack>
        </VStack>

        {/* Right column */}
        <VStack align="start" gap="6px" w="379px" flexShrink={0}>
          <HStack gap="4px">
            <Text fontSize="18px" fontWeight={500} lineHeight="28px" color="black">
              Apply to
            </Text>
            <Text fontSize="10px" color="#991919" lineHeight="14px">*</Text>
          </HStack>
          <Box ref={dropdownRef} position="relative" w="full">
            <Flex
              align="center"
              justify="space-between"
              h="54px"
              px="8px"
              border="1px solid #e4e4e7"
              borderRadius="4px"
              cursor="pointer"
              onClick={() => setApplyDropdownOpen(!applyDropdownOpen)}
            >
              <Text
                fontSize="16px"
                color={applyTo ? "black" : "#a1a1aa"}
                lineHeight="24px"
              >
                {applyTo || "Type to search"}
              </Text>
              <ChevronDown size={20} color="#71717a" />
            </Flex>

            {applyDropdownOpen && (
              <Box
                position="absolute"
                top="58px"
                left={0}
                right={0}
                bg="white"
                border="1px solid #e4e4e7"
                borderRadius="4px"
                boxShadow="0 4px 12px rgba(0,0,0,0.08)"
                zIndex={10}
              >
                {APPLY_TO_OPTIONS.map((option) => (
                  <Box
                    key={option}
                    px="12px"
                    py="10px"
                    cursor="pointer"
                    fontSize="14px"
                    color="#27272a"
                    bg={applyTo === option ? "#f4f4f5" : "transparent"}
                    _hover={{ bg: "#f4f4f5" }}
                    onClick={() => {
                      setApplyTo(option);
                      setApplyDropdownOpen(false);
                    }}
                  >
                    {option}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </VStack>
      </Flex>

      {/* Action buttons */}
      <Flex justify="flex-end" gap="23px" mt="50px">
        <Button
          bg="#5797bd"
          color="white"
          h="48px"
          px="20px"
          borderRadius="4px"
          fontSize="16px"
          fontWeight={500}
          _hover={{ bg: "#4a86a8" }}
          onClick={handleSubmit}
        >
          Create & Save
        </Button>
        <Button
          bg="#e4e4e7"
          color="#27272a"
          h="48px"
          px="20px"
          borderRadius="4px"
          fontSize="16px"
          fontWeight={500}
          _hover={{ bg: "#d4d4d8" }}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Flex>
    </Box>
  );
}

export const TagManagement = () => {
  const [tags, setTags] = useState<TagItem[]>(SAMPLE_TAGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "create">("list");

  const filteredTags = useMemo(() => {
    let result = [...tags];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    if (activeTab === "most-used") {
      result.sort(
        (a, b) =>
          b.appliedTo.reduce((sum, x) => sum + x.count, 0) -
          a.appliedTo.reduce((sum, x) => sum + x.count, 0)
      );
    }
    return result;
  }, [tags, searchQuery, activeTab]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return tags
      .filter((t) => t.name.toLowerCase().includes(q))
      .map((t) => t.name)
      .slice(0, 5);
  }, [tags, searchQuery]);

  const handleDelete = (id: number) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    setExpandedId(null);
  };

  const handleEdit = (_id: number) => {
    // Placeholder for edit functionality
  };

  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCreateTag = (newTag: { name: string; applyTo: string; description: string }) => {
    const nextId = Math.max(...tags.map((t) => t.id), 0) + 1;
    const created: TagItem = {
      id: nextId,
      name: newTag.name,
      description: newTag.description,
      appliedTo: [{ type: newTag.applyTo as AppliedType, count: 0 }],
    };
    setTags((prev) => [created, ...prev]);
    setView("list");
  };

  return (
    <Flex h="100vh" bg="white">
      <StaffSidebar />

      {view === "create" ? (
        <CreateTagView onCancel={() => setView("list")} onSave={handleCreateTag} />
      ) : (
        <Box flex={1} overflow="auto" px="70px" py="60px">
          {/* Search bar + Create Tag button */}
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

          {/* Tabs + heading */}
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

          {/* Table header */}
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

          {/* Tag rows */}
          <Box>
            {filteredTags.map((tag) => (
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
