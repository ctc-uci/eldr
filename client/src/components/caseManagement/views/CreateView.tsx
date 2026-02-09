import { useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
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
          spacing={6}
          align="stretch"
        >
          <HStack
            spacing={12}
            align="start"
          >
            <FormControl flex={2}>
              <FormLabel fontWeight="bold">Title</FormLabel>
              <Input
                bg="white"
                value={formData.title}
                border="2px solid black"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </FormControl>
            <FormControl flex={1}>
              <FormLabel fontWeight="bold">Practice Area</FormLabel>
              <Select
                bg="white"
                value={formData.practiceArea}
                placeholder="Select..."
                border="2px solid black"
                onChange={(e) =>
                  setFormData({ ...formData, practiceArea: e.target.value })
                }
              >
                <option value="family">Family Law</option>
                <option value="criminal">Criminal Law</option>
                <option value="corporate">Corporate Law</option>
              </Select>
            </FormControl>
          </HStack>
          <HStack
            spacing={12}
            align="start"
          >
            <FormControl flex={1}>
              <FormLabel fontWeight="bold">Description</FormLabel>
              <Textarea
                bg="white"
                rows={6}
                border="2px solid black"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </FormControl>

            <FormControl flex={1}>
              <FormLabel fontWeight="bold">
                Notes{" "}
                <Text
                  as="span"
                  fontWeight="normal"
                  fontStyle="italic"
                >
                  (Only Viewed by You)
                </Text>
              </FormLabel>
              <Textarea
                bg="white"
                rows={6}
                value={formData.notes}
                border="2px solid black"
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </FormControl>
          </HStack>
          <HStack
            justify="flex-end"
            spacing={3}
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
