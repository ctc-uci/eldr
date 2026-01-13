import React from "react";

import { Flex } from "@chakra-ui/react";

type Props = {
  onNext: () => void;
};

const InterestsStep = ({ onNext }: Props) => {
  return (
    <Flex
      w="100%"
      h="100%"
    >
      InterestsStep
    </Flex>
  );
};

export default InterestsStep;
