import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Show,
  VStack,
} from "@chakra-ui/react";

import MobileLayout from "../layouts/MobileLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const MobileWelcome = ({ onNext }: Props) => {
  return <Box>MobileWelcome</Box>;
};

const DesktopWelcome = ({ onNext }: Props) => {
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
          mb="150px"
        >
          Welcome ELDR!
        </Heading>
        <VStack spacing="20px">
          <Button
            bg="#FAFAFA"
            w="300px"
            h="80px"
            borderWidth="3px"
            borderColor="black"
          >
            Staff
          </Button>
          <Button
            bg="#FAFAFA"
            w="300px"
            h="80px"
            borderWidth="3px"
            borderColor="black"
            onClick={onNext}
          >
            Volunteer
          </Button>
        </VStack>
      </Flex>
    </Flex>
  );
};

const WelcomeStep = ({ onNext, onBack }: Props) => {
  return (
    <>
      <Show below="md">
        <MobileLayout onBack={onBack}>
          <MobileWelcome
            onNext={onNext}
            onBack={onBack}
          />
        </MobileLayout>
      </Show>

      <Show above="md">
        <DesktopWelcome
          onNext={onNext}
          onBack={onBack}
        />
      </Show>
    </>
  );
};

export default WelcomeStep;
