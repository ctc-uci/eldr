import React from "react";

import { Button } from "@chakra-ui/react";

type Props = {
  onNext: () => void;
};

const WelcomeStep = ({ onNext }: Props) => {
  return (
    <div>
      WelcomeStep
      <Button
        colorScheme="blue"
        onClick={onNext}
      >
        Continue
      </Button>
    </div>
  );
};

export default WelcomeStep;
