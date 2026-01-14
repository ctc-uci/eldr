import { Box, Button, Flex, Heading, Progress, VStack } from "@chakra-ui/react";

const SuccessStep = () => {
  return (
    <Flex
      w="100%"
      h="100vh"
      align="center"
      justify="center"
      direction="column"
    >
      <VStack
        spacing={12}
        width="100%"
        px={10}
      >
        <Heading
          as="h1"
          fontSize="50px"
          fontWeight={500}
          color="black"
        >
          Account Creation Successful!
        </Heading>

        <VStack spacing={6}>
          <Button
            w="213px"
            h="73px"
            borderColor="black"
            borderWidth="3px"
            borderTopLeftRadius="4px"
            borderTopRightRadius="2px"
            borderBottomLeftRadius="2px"
            borderBottomRightRadius="2px"
            px={10}
            bg="#FAFAFA"
            pt="8px"
            pb="8px"
            pl="16px"
            pr="16px"
          >
            Continue to Dashboard
          </Button>
          <Box width="200px">
            <Progress
              value={100}
              size="xs"
              colorScheme="gray"
              borderRadius="full"
            />
          </Box>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default SuccessStep;
