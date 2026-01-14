import React from "react";
import { 
  VStack, 
  HStack, 
  Heading, 
  Select, 
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
            Tell us more about yourself!
          </Heading>
          <HStack spacing="20px" w="100%" justify="center">
            <HStack spacing="-2px">
              <Select
              placeholder="Primary Language"
              w="199px"
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
              <option value="english">English</option>
            </Select>

            <Select 
              placeholder="Proficiency" 
              w="150px"
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
              <option value="fluent">Fluent</option>
            </Select>
           </HStack>

           <HStack spacing="-2px">
              <Select
              placeholder="Secondary Language"
              w="221px"
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
              <option value="english">English</option>
            </Select>

            <Select 
              placeholder="Proficiency" 
              w="150px"
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
              <option value="fluent">Fluent</option>
            </Select>
           </HStack>

           <HStack spacing="-2px">
              <Select
              placeholder="Tertiary Language"
              w="198px"
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
              <option value="english">English</option>
            </Select>

            <Select 
              placeholder="Proficiency" 
              w="150px"
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
              <option value="fluent">Fluent</option>
            </Select>
           </HStack>

      
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
                <Progress value={50} size="xs" colorScheme="gray" borderRadius="full"/>
              </Box>
          </VStack>
      </VStack>
    </Flex>
  );
};

export default GetStartedStep;
