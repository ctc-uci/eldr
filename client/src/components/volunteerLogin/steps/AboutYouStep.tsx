import React from "react";
import { 
  VStack, 
  Stack, 
  HStack, 
  Heading, 
  Select, 
  Button, 
  Box,
  Flex, 
  Progress,
  useBreakpointValue 
} from "@chakra-ui/react";

type Props = {
  onNext: () => void;
};

const GetStartedStep = ({ onNext }: Props) => {
  const headingText = useBreakpointValue({ 
    base: "Tell us more!", 
    md: "Tell us more about yourself!" 
  });

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
      <VStack spacing={{ base: 8, md: 12 }} width="100%" px={10} pt={{ base: "60px", md: "120px" }}>
          <Heading 
            as="h1" 
            fontSize={{ base: "30px", md: "50px" }} 
            fontWeight={500} 
            color="black"
            textAlign="center"
          >
            {headingText}
          </Heading>

          <Stack 
            direction={{ base: "column", md: "row" }} 
            spacing={{ base: 4, md: "20px" }} 
            w="100%" 
            justify="center"
            align="center"
          >
            <HStack spacing="-2px" w={{ base: "100%", md: "auto" }}>
              <Select
                placeholder="Language"
                w={{ base: "100%", md: "199px" }}
                h="40px"
                borderWidth="2px"
                borderColor="black"
                borderLeftRadius="4px"
                borderRightRadius="0px"
                pt="8px"
                pb="8px"
                pl="12px"
                pr="6px"
              >
                <option value="english">English</option>
              </Select>
              <Select 
                placeholder="Proficiency" 
                w={{ base: "100%", md: "150px" }}
                h="40px"
                borderWidth="2px"
                borderColor="black"
                borderLeftRadius="0px"
                borderRightRadius="4px"
                pt="8px"
                pb="8px"
                pl="12px"
                pr="6px"
              >
                <option value="fluent">Fluent</option>
              </Select>
            </HStack>

            <HStack spacing="-2px" w={{ base: "100%", md: "auto" }}>
              <Select
                placeholder="Language"
                w={{ base: "100%", md: "221px" }}
                h="40px"
                borderWidth="2px"
                borderColor="black"
                borderLeftRadius="4px"
                borderRightRadius="0px"
                pt="8px"
                pb="8px"
                pl="12px"
                pr="6px"
              >
                <option value="spanish">Spanish</option>
              </Select>
              <Select 
                placeholder="Proficiency" 
                w={{ base: "100%", md: "150px" }}
                h="40px"
                borderWidth="2px"
                borderColor="black"
                borderLeftRadius="0px"
                borderRightRadius="4px"
                pt="8px"
                pb="8px"
                pl="12px"
                pr="6px"
              >
                <option value="intermediate">Intermediate</option>
              </Select>
            </HStack>

            <HStack spacing="-2px" w={{ base: "100%", md: "auto" }}>
              <Select
                placeholder="Language"
                w={{ base: "100%", md: "198px" }}
                h="40px"
                borderWidth="2px"
                borderColor="black"
                borderLeftRadius="4px"
                borderRightRadius="0px"
                pt="8px"
                pb="8px"
                pl="12px"
                pr="6px"
              >
                <option value="french">French</option>
              </Select>
              <Select 
                placeholder="Proficiency" 
                w={{ base: "100%", md: "150px" }}
                h="40px"
                borderWidth="2px"
                borderColor="black"
                borderLeftRadius="0px"
                borderRightRadius="4px"
                pt="8px"
                pb="8px"
                pl="12px"
                pr="6px"
              >
                <option value="basic">Basic</option>
              </Select>
            </HStack>
          </Stack>
          
          <VStack spacing={6}>
              <Button
                w="102px"
                h="40px"
                onClick={onNext}
                borderColor="black"
                borderWidth="3px"
                borderRadius="2px"
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