import React from "react";
import { 
  VStack, 
  Heading,
  Text,
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
    base: "Account Created", 
    md: "Account Creation Successful!" 
  });

  const subText = useBreakpointValue({
    base: "Congratulations! Continue Forward",
    md: ""
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
      <VStack spacing={{ base: 6, md: 12 }} width="100%" px={10} pt={{ base: "60px", md: "120px" }}>
          <VStack spacing={2}>
            <Heading 
              as="h1" 
              fontSize={{ base: "32px", md: "50px" }} 
              fontWeight={500} 
              color="black"
              textAlign="center"
            >
              {headingText}
            </Heading>
            {subText && (
              <Text fontSize="18px" textAlign="center">
                {subText}
              </Text>
            )}
          </VStack>

          <VStack spacing={6}>
              <Button
                w={{ base: "280px", md: "348px" }}
                h={{ base: "80px", md: "105px" }}
                fontSize={{ base: "18px", md: "22px" }}
                onClick={onNext}
                borderColor="black"
                borderWidth="3px"
                borderRadius="4px"
                px={10}
                bg="#FAFAFA"
                variant="outline"
                _hover={{ bg: "#F0F0F0" }}
              >
                Continue to Dashboard
              </Button>
              
              <Text 
                fontSize="14px" 
                textDecoration="underline" 
                cursor="pointer"
                display={{ base: "block", md: "none" }}
                alignSelf="flex-end"
                mt="-20px"
              >
                Return to Menu
              </Text>

              <Box width={{ base: "300px", md: "200px" }} pt={4}>
                <Progress value={100} size="xs" colorScheme="gray" borderRadius="full"/>
              </Box>
          </VStack>
      </VStack>
    </Flex>
  );
};

export default GetStartedStep;