import React from "react";

import { Button, Flex } from "@chakra-ui/react";

type Props = {
  onNext: () => void;
};

const CreateAccountStep = ({ onNext }: Props) => {
  return (
    <Flex
      w="100%"
      h="100%"
    >
      <Button
        position="absolute"
        top={4}
        right={4}
        zIndex={10}
        colorScheme="blue"
        onClick={onNext}
      >
        Continue
      </Button>
      CreateAccountStep
    </Flex>
  );
};

export default CreateAccountStep;
