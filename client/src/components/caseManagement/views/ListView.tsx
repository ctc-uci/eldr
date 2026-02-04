import {
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";

import { FiPlus, FiSearch } from "react-icons/fi";

import CaseCard from "../CaseCard";
import SearchableDropdown from "../SearchableDropdown";

const caseCards = [
  {
    title:
      "Elder Financial Protection - Solar Panel Loan Dispute - PLC 24-0088454",
    assignee: "Spencer Shay",
    description:
      "Client is an older adult, a monolingual Spanish speaker, living on a fixed income. In late 2022, a door-to-door salesperson sold him solar panels for his home, under the impression that the cost would be covered by a government program.",
    tags: ["Financial Protection", "Spanish"],
  },
  {
    title: "Case 2",
    assignee: "Spencer Shay",
    description:
      "Client is an older adult, a monolingual Spanish speaker, living on a fixed income. In late 2022, a door-to-door salesperson sold him solar panels for his home, under the impression that the cost would be covered by a government program.",
    tags: ["Financial Protection", "Spanish"],
  },
  {
    title: "Case 3",
    assignee: "Spencer Shay",
    description:
      "Client is an older adult, a monolingual Spanish speaker, living on a fixed income. In late 2022, a door-to-door salesperson sold him solar panels for his home, under the impression that the cost would be covered by a government program.",
    tags: ["Financial Protection", "Spanish"],
  },
];

type Props = {
  onCreateClick: () => void;
  onEditClick: () => void;
  onCaseClick: () => void;
};

const ListView = ({ onCreateClick, onEditClick, onCaseClick }: Props) => {
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
        h="50px"
        bg="white"
        border="2px solid black"
        borderRadius={4}
      >
        <HStack>
          <SearchableDropdown></SearchableDropdown>
          <Divider
            orientation="vertical"
            border="1px solid black"
            h="50%"
          />
          <SearchableDropdown></SearchableDropdown>
          <SearchableDropdown></SearchableDropdown>
        </HStack>
        <HStack></HStack>
        <HStack></HStack>
      </Flex>

      {/* Cases list */}
      <Flex
        w="95%"
        h="700px"
        bg="#B1B1B1"
        py="15px"
        px="20px"
      >
        <VStack w="full">
          {caseCards.map(({ title, assignee, description, tags }) => (
            <CaseCard
              title={title}
              assignee={assignee}
              description={description}
              tags={tags}
              onEditClick={onEditClick}
              onCaseClick={onCaseClick}
            />
          ))}
        </VStack>
      </Flex>
    </VStack>
  );
};

export default ListView;
