import {
  AbsoluteCenter,
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

const WelcomeStep = ({ onNext, onBack }: Props) => {
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
          mb="50px"
        >
          ELDR Volunteer Portal
        </Heading>
        <VStack spacing="10px">
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
          >
            <Button
              variant="link"
              textDecoration="underline"
              color="black"
              onClick={onBack}
            >
              Return to Menu
            </Button>
          </Flex>
        </VStack>
        <VStack spacing="14px">
          <Button
            bg="#FAFAFA"
            w="297px"
            h="49px"
            borderWidth="3px"
            borderColor="black"
          >
            Login
          </Button>
          <Flex
            align="center"
            w="100%"
          >
            <Divider borderColor="black" />
            <Text padding="2">OR</Text>
            <Divider borderColor="black" />
          </Flex>
          <Button
            bg="#FAFAFA"
            w="297px"
            h="49px"
            borderWidth="3px"
            borderColor="black"
          >
            Google SSO
          </Button>
          <Button
            bg="#FAFAFA"
            w="297px"
            h="49px"
            borderWidth="3px"
            borderColor="black"
          >
            Office 365
          </Button>
          <Button
            variant="link"
            textDecoration="underline"
            color="black"
            onClick={onNext}
          >
            <Text
              as="span"
              fontWeight={400}
            >
              Don't have an account? Create one{" "}
              <Text
                as="span"
                fontWeight="bold"
              >
                here
              </Text>
            </Text>
          </Button>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default WelcomeStep;
