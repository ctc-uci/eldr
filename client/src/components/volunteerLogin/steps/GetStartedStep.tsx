import React from "react";
import { 
  VStack, 
  HStack, 
  Heading, 
  Select, 
  Input, 
  Button, 
  Box,
  Flex, 
  Progress, 
} from "@chakra-ui/react";

type Props = {
  onNext: () => void;
};

const GetStartedStep = ({ onNext }: Props) => {
  return (
    <Flex 
      w="100%" 
      h="100vh"
      align="center" 
      justify="center"
      direction="column"
    >
      <VStack spacing={12} width="100%" px={10}>
          <Heading as="h1" fontSize="50px" fontWeight={500} color="black">
            Let's get started!
          </Heading>
          <HStack spacing={4} width="100%" maxW="900px">
            <Select
              placeholder="Select Occupation"
              w="343px"
              h="40px"
              borderWidth="2px"
              borderColor="black"
              borderTopLeftRadius="4px"
              borderTopRightRadius="2px"
              borderBottomRightRadius="2px"
              borderBottomLeftRadius="2px"
              pt="8px"
              pb="8px"
              pl="12px"
              pr="6px"
            >
              <option value="notary">Notary</option>
            </Select>

            <Select 
              placeholder="Select Notary Status" 
              w="343px"
              h="40px"
              borderWidth="2px"
              borderColor="black"
              borderTopLeftRadius="4px"
              borderTopRightRadius="2px"
              borderBottomRightRadius="2px"
              borderBottomLeftRadius="2px"
              pt="8px"
              pb="8px"
              pl="12px"
              pr="6px">
              <option value="active">Active</option>
            </Select>

            <Input
              ml="10px"
              placeholder="Enter Affiliated Institution"
              w="343px"
              h="40px"
              borderWidth="2px"
              borderColor="black"
              borderTopLeftRadius="4px"
              borderTopRightRadius="2px"
              borderBottomRightRadius="2px"
              borderBottomLeftRadius="2px"
              pt="8px"
              pb="8px"
              pl="12px"
              pr="12px"
              />
          </HStack>
          <VStack spacing={6}>
              <Button
                w="102px"
                h="40px"
                onClick={onNext}
                borderColor="black"
                borderWidth="3px"
                borderRadius="2px"
                px={10}
                bg="#FAFAFA"
                >
                Continue
              </Button>
              <Box width="200px">
                <Progress value={30} size="xs" colorScheme="gray" borderRadius="full"/>
              </Box>
          </VStack>
      </VStack>
    </Flex>
  );
};

export default GetStartedStep;
