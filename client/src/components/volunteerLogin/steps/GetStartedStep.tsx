import React from "react";
import { 
  VStack, 
  Stack, 
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
      justify="flex-start"
      direction="column"
    >
      <Box 
        w="100%" 
        h={{ base: "134px", md: "106px" }} 
        bg="#E8E8E8" 
      />
      <VStack spacing={{ base: 8, md: 12}} width="100%" px={10} pt={{ base: "60px", md: "120px" }}>
          <Heading as="h1" fontSize={{ base: "30px",md: "50px"}} fontWeight={500} color="black">
            Let's get started!
          </Heading>
          <Stack spacing={{ base: 4, md: "-2px" }} 
                 width="100%" 
                 maxW="1029px" 
                 direction={{ base: "column", md: "row" }}
                 align="center"
                 >
            <Select
              placeholder="Select Occupation"
              w={{ base: "100%", md: "343px" }}
              h="40px"
              borderWidth="2px"
              borderColor="black"
              borderTopLeftRadius="4px"
              borderBottomLeftRadius="4px"
              borderTopRightRadius={{ base: "4px", md: "0px" }}
              borderBottomRightRadius={{ base: "4px", md: "0px" }}
              pt="8px"
              pb="8px"
              pl="12px"
              pr="6px"
            >
              <option value="notary">Notary</option>
            </Select>

            <Select 
              placeholder="Select Notary Status" 
              w={{ base: "100%", md: "343px" }}
              h="40px"
              borderWidth="2px"
              borderColor="black"
              borderTopLeftRadius={{ base: "4px", md: "0px" }}
              borderTopRightRadius={{ base: "4px", md: "0px" }}
              borderBottomRightRadius={{ base: "4px", md: "0px" }}
              borderBottomLeftRadius={{ base: "4px", md: "0px" }}
              ml={{ base: 0, md: "-2px" }}
              pt="8px"
              pb="8px"
              pl="12px"
              pr="6px">
              <option value="active">Active</option>
            </Select>

            <Input
              placeholder="Enter Affiliated Institution"
              w={{ base: "100%", md: "343px" }}
              h="40px"
              borderWidth="2px"
              borderColor="black"
              borderTopLeftRadius={{ base: "4px", md: "0px" }}
              borderTopRightRadius="4px"
              borderBottomRightRadius="4px"
              borderBottomLeftRadius={{ base: "4px", md: "0px" }}
              ml={{ base: 0, md: "-2px" }}
              pt="8px"
              pb="8px"
              pl="12px"
              pr="12px"
              />
          </Stack>
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
