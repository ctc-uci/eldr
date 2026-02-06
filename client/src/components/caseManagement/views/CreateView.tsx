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
};

const CreateView = ({ onBackClick }: Props) => {
  const [formData, setFormData] = useState({
    title: "",
    practiceArea: "",
    description: "",
    notes: "",
  });

  const handleSubmit = () => {
    console.log("Form data:", formData);
  };

  return (
    <Box
      bg="white"
      w="100%"
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
        p={6}
        borderRadius="md"
      >
        <VStack
          spacing={6}
          align="stretch"
        >
          <HStack
            spacing={4}
            align="start"
          >
            <FormControl flex={2}>
              <FormLabel>Title</FormLabel>
              <Input
                bg="white"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </FormControl>
            <FormControl flex={1}>
              <FormLabel>Practice Area</FormLabel>
              <Select
                bg="white"
                value={formData.practiceArea}
                placeholder="Select..."
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
            spacing={4}
            align="start"
          >
            <FormControl flex={1}>
              <FormLabel>Description</FormLabel>
              <Textarea
                bg="white"
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </FormControl>

            <FormControl flex={1}>
              <FormLabel>
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
              borderColor="black"
              color="black"
              onClick={handleSubmit}
            >
              SAVE
            </Button>
            <Button
              variant="outline"
              bg="transparent"
              borderColor="black"
              color="black"
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
