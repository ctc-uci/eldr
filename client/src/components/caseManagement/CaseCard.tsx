import { Flex, HStack, IconButton, Tag, Text, VStack } from "@chakra-ui/react";

import { FiArrowRight, FiEdit3, FiTrash2 } from "react-icons/fi";

import { Case } from "./types/case";

type Props = {
  caseData: Case;
  onEditClick: () => void;
  onCaseClick: () => void;
};

const CaseCard = ({ caseData, onEditClick, onCaseClick }: Props) => {
  return (
    <Flex
      bg="white"
      minH="260px"
      w="full"
      justify="space-between"
      alignItems="flex-start"
      p="30px"
    >
      {/* Content Area */}
      <VStack
        align="flex-start"
        spacing={3}
        flex={1}
        mr={4}
      >
        <VStack
          align="flex-start"
          spacing={1}
          mb="12px"
        >
          <Text
            fontWeight="bold"
            fontSize="xl"
            as="u"
            mb="6px"
            cursor="pointer"
            onClick={onCaseClick}
          >
            {caseData.title}
          </Text>
          <Text
            fontSize="md"
            color="black"
            size="16px"
            fontWeight="bold"
            fontStyle="italic"
          >
            Assigned to: {caseData.assignee}
          </Text>
        </VStack>

        <Text
          fontSize="md"
          color="gray.700"
          noOfLines={2}
          size="16px"
          mb="12px"
        >
          {caseData.description}
        </Text>

        <HStack
          spacing={2}
          align="center"
        >
          <Text
            fontSize="md"
            fontWeight="medium"
            color="gray.600"
          >
            Tags:
          </Text>
          <HStack
            spacing={2}
            flexWrap="wrap"
          >
            <Tag
              key={caseData.tags.area}
              size="md"
              bg="#D8D2CF"
              borderRadius="full"
            >
              {caseData.tags.area}
            </Tag>
            <Tag
              key={caseData.tags.language}
              size="md"
              bg="#D8D2CF"
              borderRadius="full"
            >
              {caseData.tags.language}
            </Tag>
          </HStack>
        </HStack>
      </VStack>

      {/* Buttons Area */}
      <HStack spacing={2}>
        <IconButton
          aria-label="Delete case"
          icon={<FiTrash2 size={30} />}
          variant="ghost"
          size="lg"
          _hover="none"
          _active={{ bg: "transparent" }}
        />
        <IconButton
          aria-label="Edit case"
          icon={<FiEdit3 size={30} />}
          variant="ghost"
          colorScheme="gray"
          size="lg"
          _hover="none"
          _active={{ bg: "transparent" }}
          onClick={onEditClick}
        />
        <IconButton
          aria-label="View case"
          icon={<FiArrowRight size={30} />}
          variant="ghost"
          size="lg"
          _hover="none"
          _active={{ bg: "transparent" }}
          onClick={onCaseClick}
        />
      </HStack>
    </Flex>
  );
};

export default CaseCard;
