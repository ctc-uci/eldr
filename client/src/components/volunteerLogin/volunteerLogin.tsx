import { useState } from "react";

import { Flex } from "@chakra-ui/react";

import BackgroundStep from "./steps/BackgroundStep";
import CreateAccountStep from "./steps/CreateAccountStep";
import LanguageStep from "./steps/LanguageStep";
import LawInterestStep from "./steps/LawInterestStep";
import LoginStep from "./steps/LoginStep";
import NotaryStep from "./steps/NotaryStep";
import SuccessStep from "./steps/SuccessStep";
import WelcomeStep from "./steps/WelcomeStep";

export const VolunteerLogin = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const next = () => setStepIndex((i) => i + 1);
  const back = () => setStepIndex((i) => i - 1);

  return (
    <Flex
      w="100vw"
      h="100vh"
    >
      {stepIndex === 0 && <WelcomeStep onNext={next} />}
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
      {stepIndex === 3 && <LanguageStep onNext={next} />}
      {stepIndex === 4 && (
        <LawInterestStep
          onNext={next}
          onBack={back}
        />
      )}
      {stepIndex === 5 && <NotaryStep onNext={next} />}
      {stepIndex === 6 && <BackgroundStep onNext={next} />}
      {stepIndex === 7 && <SuccessStep onNext={() => setStepIndex(1)} />}
    </Flex>
  );
};
