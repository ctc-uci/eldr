import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const CreateAccountStep = ({ onNext, onBack }: Props) => {
  return (
    <Flex
      w="100%"
      h="100%"
    >
      <Center
        bg="#E8E8E8"
        w="43%"
      >
        <Box
          w="323px"
          h="294px"
          bg="#D9D9D9"
        ></Box>
      </Center>
      <Flex
        flex="1"
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap="6"
      >
        <Heading
          fontWeight={500}
          fontSize="50px"
          mb="15px"
        >
          Create an Account
        </Heading>
        <VStack
          spacing="10px"
          mb="10px"
        >
          <Input
            placeholder="Enter first name"
            w="704px"
            border="2px"
          />
          <Input
            placeholder="Enter last name"
            w="704px"
            border="2px"
          />
          <Input
            placeholder="Enter email"
            w="704px"
            border="2px"
          />
          <Flex
            w="704px"
            justifyContent="end"
            fontWeight={500}
          >
            <Text>
              Didn't mean to come here?{" "}
              <Button
                variant="link"
                textDecoration="underline"
                color="black"
                onClick={onBack}
              >
                Go back
              </Button>
            </Text>
          </Flex>
        </VStack>
        <Button
          bg="#FAFAFA"
          w="297px"
          h="49px"
          borderWidth="3px"
          borderColor="black"
        >
          Create Account
        </Button>
      </Flex>
    </Flex>
  );
};

export default CreateAccountStep;
