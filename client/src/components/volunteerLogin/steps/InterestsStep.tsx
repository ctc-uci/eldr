import React from "react";
import { 
  VStack, 
  Stack, 
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
    base: "What are your interests?", 
    md: "What are you interested in?" 
  });

  const placeholderText = useBreakpointValue({
    base: "Interest",
    md: "Primary Area of Interest"
  });

  const secondaryPlaceholder = useBreakpointValue({
    base: "Interest",
    md: "Secondary Area of Interest"
  });

  const tertiaryPlaceholder = useBreakpointValue({
    base: "Interest",
    md: "Tertiary Area of Interest"
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
      <VStack spacing={{ base: 4, md: 12 }} width="100%" px={10} pt={{ base: "60px", md: "120px" }}>
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
            spacing={0} 
            width="100%" 
            maxW="900px" 
            justify="center"
            align="center"
          >
            <Select
              placeholder={placeholderText}
              w={{ base: "100%", md: "244px" }}
              h="40px"
              borderWidth="2px"
              borderColor="black"
              borderRadius="2px"
              pt="8px"
              pb="8px"
              pl="12px"
              pr="6px"
            >
              <option value="n/a">N/A</option>
            </Select>

            <Select 
              placeholder={secondaryPlaceholder} 
              w={{ base: "100%", md: "269px" }}
              h="40px"
              borderWidth="2px"
              borderColor="black"
              borderRadius="2px"
              pt="8px"
              pb="8px"
              pl="12px"
              pr="6px"
            >
              <option value="n/a">N/A</option>
            </Select>

            <Select 
              placeholder={tertiaryPlaceholder} 
              w={{ base: "100%", md: "244px" }}
              h="40px"
              borderWidth="2px"
              borderColor="black"
              borderRadius="2px"
              pt="8px"
              pb="8px"
              pl="12px"
              pr="6px"
            >
              <option value="n/a">N/A</option>
            </Select>
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
                <Progress value={75} size="xs" colorScheme="gray" borderRadius="full"/>
              </Box>
          </VStack>
      </VStack>
    </Flex>
  );
};

export default GetStartedStep;