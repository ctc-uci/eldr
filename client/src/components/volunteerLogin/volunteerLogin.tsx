import { useState } from "react";

import { Flex } from "@chakra-ui/react";

import AboutYouStep from "./steps/AboutYouStep";
import CreateAccountStep from "./steps/CreateAccountStep";
import GetStartedStep from "./steps/GetStartedStep";
import InterestsStep from "./steps/InterestsStep";
import LoginStep from "./steps/LoginStep";
import SuccessStep from "./steps/SuccessStep";
import WelcomeStep from "./steps/WelcomeStep";

const VolunteerLogin = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const next = () => setStepIndex((i) => i + 1);
  const back = () => setStepIndex((i) => i - 1);

  return (
    <Flex
      w="100vw"
      h="100vh"
    >
      {stepIndex === 0 && (
        <WelcomeStep
          onNext={next}
          onBack={back}
        />
      )}
      {stepIndex === 1 && (
        <LoginStep
          onNext={next}
          onBack={back}
        />
      )}
      {stepIndex === 2 && (
        <CreateAccountStep
          onNext={next}
          onBack={back}
        />
      )}
      {stepIndex === 3 && (
        <GetStartedStep
          onNext={next}
          onBack={back}
        />
      )}
      {stepIndex === 4 && (
        <AboutYouStep
          onNext={next}
          onBack={back}
        />
      )}
      {stepIndex === 5 && (
        <InterestsStep
          onNext={next}
          onBack={back}
        />
      )}
      {stepIndex === 6 && <SuccessStep onBack={back} />}
    </Flex>
  );
};

export default VolunteerLogin;
