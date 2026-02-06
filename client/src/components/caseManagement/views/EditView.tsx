import { useState } from "react";

import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import { Case } from "../types/case";

type Props = {
  caseData: Case | null;
  onBackClick: () => void;
};

const EditView = ({ caseData, onBackClick }: Props) => {
  const [formData, setFormData] = useState({
    title: "",
    practiceArea: "",
    description: "",
    notes: "",
  });

  const handleSubmit = () => {
    console.log("Form data:", formData);
  };

  const handleDelete = () => {
    console.log("Delete case");
  };

  return (
    <Box w="100%">
      <Alert
        status="warning"
        bg="#F4D03F"
        color="black"
      >
        <AlertIcon color="black" />
        You are currently editing this case, save your changes before exiting.
      </Alert>

      <Box
        bg="white"
        w="100%"
        p={8}
      >
        <Link
          href="#"
          display="flex"
          mb={6}
          alignItems="center"
          fontSize="sm"
          color="black"
          _hover={{ textDecoration: "underline" }}
          onClick={onBackClick}
        >
          <ArrowBackIcon mr={2} />
          Back to ELDR Case Catalog
        </Link>

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
          <Button
            variant="outline"
            borderColor="black"
            color="black"
            leftIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete Case
          </Button>
        </HStack>

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
                <FormLabel
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Title
                </FormLabel>
                <Input
                  bg="white"
                  border="1px solid"
                  borderColor="black"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Practice Area
                </FormLabel>
                <Select
                  bg="white"
                  border="1px solid"
                  borderColor="black"
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
                <FormLabel
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Description
                </FormLabel>
                <Textarea
                  bg="white"
                  border="1px solid"
                  borderColor="black"
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </FormControl>

              <FormControl flex={1}>
                <FormLabel
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
                </FormLabel>
                <Textarea
                  bg="white"
                  border="1px solid"
                  borderColor="black"
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
                bg="white"
                borderColor="black"
                color="black"
                onClick={handleSubmit}
              >
                SAVE
              </Button>
              <Button
                variant="outline"
                bg="white"
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
    </Box>
  );
};
export default EditView;
