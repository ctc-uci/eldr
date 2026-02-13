import { useState } from "react";

import {
  Steps,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  NativeSelect,
  Text,
  Textarea,
  VStack,
  Field,
} from "@chakra-ui/react";

import BackButton from "../BackButton";

type Props = {
  onBackClick: () => void;
  onSaveClick: () => void;
};

const CreateView = ({ onBackClick, onSaveClick }: Props) => {
  const [formData, setFormData] = useState({
    title: "",
    practiceArea: "",
    description: "",
    notes: "",
  });

  return (
    <Box
      bg="white"
      w="95%"
      h="95%"
      p={8}
    >
      <BackButton onBackClick={onBackClick} />
      <Heading
        as="h1"
        size="lg"
        mb={6}
      >
        Create New Case
      </Heading>
      <Box
        bg="#F0EFEF"
        p={12}
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
              <Field.Label fontWeight="bold">Title</Field.Label>
              <Input
                bg="white"
                value={String(formData.title)}
                border="2px solid black"
                onValueChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Field.Root>
            <Field.Root flex={1}>
              <Field.Label fontWeight="bold">Practice Area</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  bg="white"
                  value={String(formData.practiceArea)}
                  placeholder="Select..."
                  border="2px solid black"
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
              <Field.Label fontWeight="bold">Description</Field.Label>
              <Textarea
                bg="white"
                rows={6}
                border="2px solid black"
                value={String(formData.description)}
                onValueChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Field.Root>

            <Field.Root flex={1}>
              <Field.Label fontWeight="bold">
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
                rows={6}
                value={String(formData.notes)}
                border="2px solid black"
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
              bg="transparent"
              border="2px solid black"
              color="black"
              p={2}
              onClick={onSaveClick}
            >
              SAVE
            </Button>
            <Button
              variant="outline"
              bg="transparent"
              border="2px solid black"
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
  );
};
export default CreateView;
