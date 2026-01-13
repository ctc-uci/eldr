import React from "react";

import { Flex } from "@chakra-ui/react";

type Props = {
  onNext: () => void;
};

const LoginStep = ({ onNext }: Props) => {
  return (
    <Flex
      w="100%"
      h="100%"
    >
      LoginStep
    </Flex>
  );
};

export default LoginStep;
