import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useState } from "react";

type Props = {};

const CreateCase = (props: Props) => {
  const [formData, setFormData] = useState({
    title: "",
    practiceArea: "",
    description: "",
    notes: "",
  });

  const handleSubmit = () => {
    console.log("Form data:", formData);
  };

  const handleCancel = () => {
    console.log("Cancelled");
  };

  return (
    <Box maxW="800px" mx="auto" p={8}>
      <Link
        href="#"
        display="flex"
        mb={6}
        alignItems="center"
        fontSize="sm"
        color="black"
        _hover={{ textDecoration: "underline" }}>
          <ArrowBackIcon mr={2} />
          Back to ELDR Case Catalog
        </Link>
        <Box bg="gray" p={8} borderRadius="md">
          <Heading as="h1" size="lg" mb={6}>
            Create New Case
          </Heading>

          <VStack spacing={6} align="stretch">
            <HStack spacing={4} align="start">
              <FormControl flex={2}>
                <FormLabel>Title</FormLabel>
                <Input bg="white" value={formData.title} onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Practice Area</FormLabel>
                <Select
                  bg="white"
                  value={formData.practiceArea}
                  placeholder="Slect..."
                  onChange={(e) =>  
                        setFormData({ ...formData, practiceArea: e.target.value })}
                  >
                    <option value="family">Family Law</option>
                    <option value="criminal">Criminal Law</option>
                    <option value="corporate">Corporate Law</option>
                </Select>
              </FormControl>
            </HStack>
            <HStack spacing={4} align="start">
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
                  <Text as="span" fontWeight="normal" fontStyle="italic">
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
            <HStack justify="flex-end" spacing={3}>
              <Button variant="outline" onClick={handleCancel}>
              CANCEL
              </Button>
             <Button colorScheme="gray" bg="gray.700" onClick={handleSubmit}>
              SAVE
              </Button>
            </HStack>
          </VStack>
        </Box>
    </Box>
  );

};
export default CreateCase;
