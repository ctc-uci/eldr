import { useState } from "react";

import {
  Steps,
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  NativeSelect,
  Text,
  Textarea,
  useDisclosure,
  VStack,
  Field,
} from "@chakra-ui/react";
import BackButton from "../BackButton";

import DeleteConfirm from "../DeleteConfirm";
import { Case } from "../types/case";
import { LuTrash2 } from 'react-icons/lu';

type Props = {
  caseData: Case | null;
  onBackClick: () => void;
  onSaveClick: () => void;
  onDeleteConfirm: () => void;
};

const EditView = ({
  caseData,
  onBackClick,
  onSaveClick,
  onDeleteConfirm,
}: Props) => {
  const [formData, setFormData] = useState({
    title: caseData?.title || "",
    practiceArea: caseData?.tags.area || "",
    description: caseData?.description || "",
    notes: "",
  });
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      w="100%"
      h="100%"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Alert.Root
        status="warning"
        bg="#FBE383"
        color="black"
        w="95%"
        top={0}
        left={0}
        zIndex={10}
        borderTopRadius="md"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
      >
        <Alert.Indicator color="black" />
        You are currently editing this case, save your changes before exiting.
      </Alert.Root>
      <Box
        bg="white"
        w="95%"
        h="95%"
        p={12}
      >
        <BackButton onBackClick={onBackClick} />

        <HStack
          justify="space-between"
          align="center"
          mb={6}
        >
          <Heading
            as="h1"
            size="lg"
          >
            Editting Case
          </Heading>
          <Button variant="outline" borderColor="black" color="black" onClick={onOpen}><LuTrash2 />Delete Case
                      </Button>
        </HStack>

        <Box
          bg="#F0EFEF"
          p={6}
          borderRadius="md"
        >
          <VStack
            gap={6}
            align="stretch"
          >
            <HStack
              gap={12}
              align="start"
            >
              <Field.Root flex={2}>
                <Field.Label
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Title
                </Field.Label>
                <Input
                  bg="white"
                  border="2px solid black"
                  value={String(formData.title)}
                  onValueChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </Field.Root>
              <Field.Root flex={1}>
                <Field.Label
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Practice Area
                </Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    bg="white"
                    border="2px solid black"
                    value={String(formData.practiceArea)}
                    placeholder="Select..."
                    onValueChange={(e) =>
                      setFormData({ ...formData, practiceArea: e.target.value })
                    }>
                    <option value="family">Family Law</option>
                    <option value="criminal">Criminal Law</option>
                    <option value="corporate">Corporate Law</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
            </HStack>
            <HStack
              gap={12}
              align="start"
            >
              <Field.Root flex={1}>
                <Field.Label
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Description
                </Field.Label>
                <Textarea
                  bg="white"
                  border="2px solid black"
                  rows={6}
                  value={String(formData.description)}
                  onValueChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Field.Root>

              <Field.Root flex={1}>
                <Field.Label
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Notes{" "}
                  <Text
                    as="span"
                    fontWeight="normal"
                    fontStyle="italic"
                  >
                    (Only Viewed by You)
                  </Text>
                </Field.Label>
                <Textarea
                  bg="white"
                  border="2px solid black"
                  rows={6}
                  value={String(formData.notes)}
                  onValueChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </Field.Root>
            </HStack>
            <HStack
              justify="flex-end"
              gap={3}
            >
              <Button
                variant="outline"
                bg="white"
                borderColor="black"
                color="black"
                p={2}
                onClick={onSaveClick}
              >
                SAVE
              </Button>
              <Button
                variant="outline"
                bg="white"
                borderColor="black"
                color="black"
                p={2}
                onClick={onBackClick}
              >
                CANCEL
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
      <DeleteConfirm
        isOpen={isOpen}
        onClose={onClose}
        onDeleteConfirm={onDeleteConfirm}
      />
    </Flex>
  );
};
export default EditView;
