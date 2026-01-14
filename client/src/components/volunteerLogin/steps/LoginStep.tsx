import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
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
      >
        <Heading
          fontWeight={500}
          fontSize="50px"
          mb="200px"
        >
          Welcome ELDR!
        </Heading>
        <VStack>
          <Input
            placeholder="Enter first name"
            w="704px"
          />
          <Input
            placeholder="Enter last name"
            w="704px"
          />
          <Input
            placeholder="Enter email"
            w="704px"
          />
        </VStack>
        <VStack></VStack>
      </Flex>
    </Flex>
  );
};

export default WelcomeStep;
