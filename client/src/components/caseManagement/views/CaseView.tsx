import {
  Button,
  Flex,
  HStack,
  Tag,
  TagLabel,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FiEdit3 } from "react-icons/fi";
import { IoMdMail } from "react-icons/io";
import { IoArrowBackCircleOutline, IoTrashBin } from "react-icons/io5";

import { Case } from "../types/case";

type Props = {
  caseData: Case | null;
  onEditClick: () => void;
  onSendClick: () => void;
  onBackClick: () => void;
};

const CaseView = ({
  caseData,
  onEditClick,
  onSendClick,
  onBackClick,
}: Props) => {
  if (!caseData) {
    return (
      <Flex
        w="95%"
        h="95%"
        bg="white"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          fontSize="xl"
          color="gray.500"
        >
          No case selected
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      w="95%"
      h="95%"
      bg="white"
      direction="column"
      p="50px"
    >
      {/* Back button */}
      <Flex>
        <Button
          variant="ghost"
          fontSize="2xl"
          textDecoration="underline"
          mb="30px"
          px={0}
          iconSpacing="16px"
          _hover={{
            textDecoration: "underline",
            bg: "transparent",
          }}
          leftIcon={<IoArrowBackCircleOutline size={34} />}
        >
          Back to ELDR Case Catalog
        </Button>
      </Flex>

      {/* Main content */}
      <VStack>
        <HStack
          w="full"
          justifyContent="space-between"
          alignItems="start"
        >
          {/* Title & Tags */}
          <VStack alignItems="start">
            <Text
              fontSize="2rem"
              fontWeight="bold"
              w="1000px"
              mb="10px"
            >
              {caseData.title}
            </Text>
            <Tag
              size="xl"
              borderRadius="full"
              variant="solid"
              bg="#D8D2CF"
              color="black"
              fontWeight="bold"
              px="50px"
              py="10px"
              border="2px solid #978D87"
            >
              <TagLabel mr="4px">{caseData.tags.area}</TagLabel>
            </Tag>
          </VStack>

          {/* Buttons */}
          <VStack
            spacing={5}
            mb={8}
          >
            <Button
              bg="#ADADAD"
              px="30px"
              borderRadius={4}
              border="3px solid black"
              w="260px"
              fontSize="xl"
              leftIcon={<FiEdit3 />}
              onClick={onEditClick}
            >
              Edit Case
            </Button>
            <Button
              bg="#ADADAD"
              px="30px"
              borderRadius={4}
              border="3px solid black"
              w="260px"
              fontSize="xl"
              leftIcon={<IoTrashBin />}
            >
              Delete Case
            </Button>
            <Button
              bg="#ADADAD"
              px="30px"
              borderRadius={4}
              border="3px solid black"
              w="260px"
              fontSize="xl"
              leftIcon={<IoMdMail />}
              onClick={onSendClick}
            >
              Send to Volunteer(s)
            </Button>
          </VStack>
        </HStack>

        {/* Case Details */}
        <Flex
          alignItems="start"
          direction="column"
          w="full"
        >
          <Flex
            bg="#F0EFEF"
            w="340px"
            px="40px"
            paddingTop="16px"
            roundedTop="xl"
          >
            <Text
              textColor="#909090"
              fontSize="1.6rem"
              fontWeight="bold"
            >
              Case Details
            </Text>
          </Flex>
          <Flex
            direction="column"
            bg="#F0EFEF"
            px="40px"
            py="50px"
          >
            <Text
              fontSize="1.2rem"
              fontWeight="bold"
              mb="14px"
            >
              Description
            </Text>
            <Text
              fontSize="16px"
              mb="30px"
            >
              Client is an older adult, a monolingual Spanish speaker, living on
              a fixed income. In late 2022, a door-to-door salesperson sold him
              solar panels for his home, under the impression that the cost
              would be covered by a government program. aecenas vitae mattis
              tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo,
              non suscipit magna interdum eu. Curabitur pellentesque nibh nibh,
              at maximus ante fermentum sit amet. Pellentesque commodo lacus at
              sodales sodales. Lorem ipsum dolor sit amet consectetur adipiscing
              elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit
              amet sapien fringilla, mattis ligula consectetur, ultrices mauris.
              Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
              Vestibulum auctor ornare leo, non suscipit magna interdum eu.
              Curabitur pellentesque nibh nibh, at maximus ante fermentum sit
              amet .Vestibulum auctor ornare leo, non suscipit magna interdum
              eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum
              sit amet.
            </Text>
            <Text
              fontSize="1.2rem"
              fontWeight="bold"
              mb="14px"
            >
              Notes{" "}
              <Text
                as="span"
                fontStyle="italic"
                fontWeight="normal"
              >
                {" "}
                (Only Viewed by You)
              </Text>
            </Text>
            <Text fontSize="16px">
              Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa
              mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien
              fringilla, mattis ligula consectetur, ultrices mauris. Maecenas
              vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum
              auctor ornare leo, non suscipit magna interdum eu. Curabitur
              pellentesque nibh nibh, at maximus ante fermentum sit amet.{" "}
            </Text>
          </Flex>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default CaseView;
