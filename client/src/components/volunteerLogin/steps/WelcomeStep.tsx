import React from "react";

import { Button, Center, Flex, HStack, Text } from "@chakra-ui/react";

type Props = {
  onNext: () => void;
};

const WelcomeStep = ({ onNext }: Props) => {
  return (
    <Flex
      w="100%"
      h="100%"
    >
      <Center
        bg="#E8E8E8"
        w="631px"
      >
        <Text>box 1</Text>
      </Center>
      <Center>
        <Text>box 1</Text>
      </Center>
    </Flex>
  );
};

export default WelcomeStep;
