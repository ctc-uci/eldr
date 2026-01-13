import React from "react";

import { Flex } from "@chakra-ui/react";

type Props = {
  onNext: () => void;
};

const CreateAccountStep = ({ onNext }: Props) => {
  return (
    <Flex
      w="100%"
      h="100%"
    >
      CreateAccountStep
    </Flex>
  );
};

export default CreateAccountStep;
