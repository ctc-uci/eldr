import { 
  Box,
  Button,
  Flex, 
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";


const SuccessStep = () => {
  /* TEMPORARY SUCCESS PAGE, WILL BE ADJUSTED */
  return (
    <Flex 
      w="100%" 
      h="100vh"
      minH="600px"
      align="center" 
      justify="center"
      bg="gray.50"
    >
      <Box textAlign="center" maxW="600px" px={12}>
        <Stack gap={6} alignItems="center">
          <Icon 
            as={FaCheckCircle} 
            boxSize={24} 
            color="green.500"
          />
          
          <Heading 
            fontSize={{ base: "3xl", md: "5xl" }} 
            fontWeight="bold" 
            color="black"
          >
            Account Creation Successful!
          </Heading>
          
          <Text 
            fontSize={{ base: "lg", md: "xl" }}
            color="gray.600"
            mb={4}
          >
            Congratulations! Your account has been created successfully. 
            Click below to continue to your dashboard.
          </Text>

          <Button
            bg="blue.500"
            color="white"
            w="full"
            maxW="400px"
            h="50px"
            fontSize="lg"
            fontWeight="semibold"
            borderRadius="sm"
            _hover={{ bg: "blue.600" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            Continue to Dashboard
            <Icon as={FaArrowRight} boxSize={5} />
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default SuccessStep;