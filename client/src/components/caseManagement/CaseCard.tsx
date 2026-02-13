import { Steps, Flex, HStack, IconButton, Tag, Text, useDisclosure, VStack } from "@chakra-ui/react";

import { FiArrowRight, FiEdit3, FiTrash2 } from "react-icons/fi";

import DeleteConfirm from "./DeleteConfirm";
import { Case } from "./types/case";

type Props = {
  caseData: Case;
  onEditClick: () => void;
  onCaseClick: () => void;
  onDeleteConfirm: () => void;
};

const CaseCard = ({
  caseData,
  onEditClick,
  onCaseClick,
  onDeleteConfirm,
}: Props) => {
  const { open, onOpen, onClose } = useDisclosure();

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
        gap={3}
        flex={1}
        mr={4}
      >
        <VStack
          align="flex-start"
          gap={1}
          mb="12px"
        >
          <Text fontWeight="bold" fontSize="xl" mb="6px" cursor="pointer" asChild><u onClick={onCaseClick}>
              {caseData.title}
            </u></Text>
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
          lineClamp={2}
          size="16px"
          mb="12px"
        >
          {caseData.description}
        </Text>

        <HStack
          gap={2}
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
            gap={2}
            flexWrap="wrap"
          >
            <Tag.Root
              key={caseData.tags.area}
              size="md"
              bg="#D8D2CF"
              borderRadius="full"
            >
              {caseData.tags.area}
            </Tag.Root>
            <Tag.Root
              key={caseData.tags.language}
              size="md"
              bg="#D8D2CF"
              borderRadius="full"
            >
              {caseData.tags.language}
            </Tag.Root>
          </HStack>
        </HStack>
      </VStack>
      {/* Buttons Area */}
      <HStack gap={2}>
        <IconButton
          aria-label="Delete case"
          variant="ghost"
          size="lg"
          _hover="none"
          _active={{ bg: "transparent" }}
          onClick={onOpen}><FiTrash2 size={30} /></IconButton>
        <IconButton
          aria-label="Edit case"
          variant="ghost"
          colorPalette="gray"
          size="lg"
          _hover="none"
          _active={{ bg: "transparent" }}
          onClick={onEditClick}><FiEdit3 size={30} /></IconButton>
        <IconButton
          aria-label="View case"
          variant="ghost"
          size="lg"
          _hover="none"
          _active={{ bg: "transparent" }}
          onClick={onCaseClick}><FiArrowRight size={30} /></IconButton>
      </HStack>
      <DeleteConfirm
        isOpen={isOpen}
        onClose={onClose}
        onDeleteConfirm={onDeleteConfirm}
      />
    </Flex>
  );
};

export default CaseCard;
