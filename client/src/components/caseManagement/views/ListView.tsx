import { useState } from "react";

import {
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
  TagLabel,
  VStack,
} from "@chakra-ui/react";

import { FiPlus, FiSearch } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { IoCloseOutline, IoSwapVertical } from "react-icons/io5";
import { TbXboxX } from "react-icons/tb";

import CaseCard from "../CaseCard";
import SearchableDropdown from "../SearchableDropdown";
import { Case } from "../types/case";

const caseCards: Case[] = [
  {
    title:
      "Elder Financial Protection - Solar Panel Loan Dispute - PLC 24-0088454",
    assignee: "Spencer Shay",
    description:
      "Client is an older adult, a monolingual Spanish speaker, living on a fixed income. In late 2022, a door-to-door salesperson sold him solar panels for his home, under the impression that the cost would be covered by a government program.",
    tags: {
      language: "Spanish",
      area: "Financial Protection",
    },
  },
  {
    title: "Case 2",
    assignee: "Vy Vu",
    description:
      "Client is an older adult, a monolingual Spanish speaker, living on a fixed income. In late 2022, a door-to-door salesperson sold him solar panels for his home, under the impression that the cost would be covered by a government program.",
    tags: {
      language: "English",
      area: "Appeals",
    },
  },
  {
    title: "Case 3",
    assignee: "Dommenick Lacuata",
    description:
      "Client is an older adult, a monolingual Spanish speaker, living on a fixed income. In late 2022, a door-to-door salesperson sold him solar panels for his home, under the impression that the cost would be covered by a government program.",
    tags: {
      language: "Spanish",
      area: "Appeals",
    },
  },
  {
    title: "Case 4",
    assignee: "Joshua Sullivan",
    description:
      "Client is an older adult, a monolingual Spanish speaker, living on a fixed income. In late 2022, a door-to-door salesperson sold him solar panels for his home, under the impression that the cost would be covered by a government program.",
    tags: {
      language: "French",
      area: "Debt",
    },
  },
];

type Props = {
  onCreateClick: () => void;
  onEditClick: (c: Case) => void;
  onCaseClick: (c: Case) => void;
  onDeleteConfirm: () => void;
};

const ListView = ({
  onCreateClick,
  onEditClick,
  onCaseClick,
  onDeleteConfirm,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [appliedLanguage, setAppliedLanguage] = useState("");
  const [appliedArea, setAppliedArea] = useState("");

  const handleApply = () => {
    setAppliedLanguage(selectedLanguage);
    setAppliedArea(selectedArea);
  };

  const handleClear = () => {
    setSelectedLanguage("");
    setSelectedArea("");
    setAppliedLanguage("");
    setAppliedArea("");
  };

  const removeLanguageFilter = () => {
    setAppliedLanguage("");
    setSelectedLanguage("");
  };

  const removeAreaFilter = () => {
    setAppliedArea("");
    setSelectedArea("");
  };

  const filteredCases = caseCards.filter((c) => {
    const matchesLanguage = appliedLanguage
      ? c.tags.language === appliedLanguage
      : true;

    const matchesArea = appliedArea ? c.tags.area === appliedArea : true;

    const matchesSearch = searchQuery
      ? c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesLanguage && matchesArea && matchesSearch;
  });

  return (
    <VStack
      w="100%"
      h="100%"
      spacing="16px"
    >
      {/* Search bar + Create button */}
      <Flex
        w="95%"
        h="50px"
        gap="20px"
        alignItems="center"
        justifyContent="center"
      >
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch size={20} />
          </InputLeftElement>
          <Input
            type="tel"
            placeholder="Search a case"
            bg="white"
            border="2px solid black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            _placeholder={{
              opacity: 1,
              color: "black",
              fontStyle: "italic",
              fontWeight: 600,
            }}
            _focus={{
              borderColor: "black",
              boxShadow: "none",
            }}
            _hover="none"
          />
        </InputGroup>
        <Button
          leftIcon={<FiPlus size={24} />}
          bg="#ADADAD"
          onClick={onCreateClick}
          px="30px"
          borderRadius={4}
          border="3px solid black"
        >
          Create New Case
        </Button>
      </Flex>

      {/* Filter bar */}
      <Flex
        w="95%"
        minH="70px"
        bg="white"
        border="2px solid black"
        borderRadius={4}
        px="30px"
        py="10px"
        gap={4}
      >
        {/* Sort and filter dropdowns */}
        <HStack
          spacing={3}
          mr="36px"
        >
          <Button
            bg="#B9AEA7"
            border="2px solid black"
            px="8px"
            py="6px"
            h="auto"
            borderRadius="2px"
            leftIcon={<IoSwapVertical />}
            iconSpacing="4px"
          >
            By Newest
          </Button>
          <Divider
            orientation="vertical"
            border="1px solid black"
            h="30px"
          />
          <SearchableDropdown
            placeholder="Languages"
            options={["English", "Spanish", "French", "German", "Italian"]}
            value={selectedLanguage}
            onChange={setSelectedLanguage}
          />
          <SearchableDropdown
            placeholder="Areas of Interest"
            options={[
              "Advocacy for Children",
              "Appeals",
              "Civil Rights",
              "Conservatorship",
              "Debt",
              "Disability Rights",
            ]}
            value={selectedArea}
            onChange={setSelectedArea}
          />
        </HStack>

        {/* Applied Filters */}
        {(appliedLanguage || appliedArea) && (
          <HStack spacing={4}>
            {appliedLanguage && (
              <Tag
                size="md"
                borderRadius="full"
                variant="solid"
                bg="#D8D2CF"
                color="black"
                px="14px"
                py="6px"
                border="2px solid black"
              >
                <TagLabel mr="4px">{appliedLanguage}</TagLabel>
                <TbXboxX
                  size={18}
                  cursor="pointer"
                  onClick={removeLanguageFilter}
                />
              </Tag>
            )}
            {appliedArea && (
              <Tag
                size="md"
                borderRadius="full"
                variant="solid"
                bg="#D8D2CF"
                color="black"
                px="14px"
                py="6px"
                border="2px solid black"
              >
                <TagLabel mr="4px">{appliedArea}</TagLabel>
                <TbXboxX
                  size={18}
                  cursor="pointer"
                  onClick={removeAreaFilter}
                />
              </Tag>
            )}
          </HStack>
        )}

        {/* Apply and Clear buttons */}
        <HStack
          spacing={3}
          marginLeft="auto"
        >
          <Button
            size="sm"
            bg="#8F8F8F"
            onClick={handleApply}
            isDisabled={!selectedLanguage && !selectedArea}
            leftIcon={<IoMdCheckmark size={20} />}
          >
            Apply
          </Button>
          <Button
            size="sm"
            bg="#8F8F8F"
            onClick={handleClear}
            isDisabled={
              !appliedLanguage &&
              !appliedArea &&
              !selectedLanguage &&
              !selectedArea
            }
            leftIcon={<IoCloseOutline size={20} />}
          >
            Clear
          </Button>
        </HStack>
      </Flex>

      {/* Cases list */}
      <Flex
        w="95%"
        h="73vh"
        bg="#B1B1B1"
        py="15px"
        px="20px"
        overflowY="auto"
      >
        <VStack
          w="full"
          spacing={4}
        >
          {filteredCases.map((c: Case) => (
            <CaseCard
              key={c.title}
              caseData={c}
              onEditClick={() => onEditClick(c)}
              onCaseClick={() => onCaseClick(c)}
              onDeleteConfirm={onDeleteConfirm}
            />
          ))}
        </VStack>
      </Flex>
    </VStack>
  );
};

export default ListView;
