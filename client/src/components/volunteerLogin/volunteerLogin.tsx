import { useState } from "react";

import { Flex } from "@chakra-ui/react";

// import AboutYouStep from "./steps/AboutYouStep";
// import CreateAccountStep from "./steps/CreateAccountStep";
// import GetStartedStep from "./steps/GetStartedStep";
// import InterestsStep from "./steps/InterestsStep";
import LoginStep from "./steps/LoginStep";
// import SuccessStep from "./steps/SuccessStep";

export const VolunteerLogin = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const next = () => setStepIndex((i) => i + 1);
  // const back = () => setStepIndex((i) => i - 1);

  return (
    <Flex
      w="100vw"
      h="100vh"
    >
      {stepIndex === 0 && (
        <LoginStep
          onNext={next}
        />
      )}
      {/* {stepIndex === 1 && (
        <CreateAccountStep
          onNext={next}
          onBack={back}
        />
      )}
      {stepIndex === 2 && <GetStartedStep onNext={next} />}
      {stepIndex === 3 && <AboutYouStep onNext={next} />}
      {stepIndex === 4 && <InterestsStep onNext={next} />} */}
    </Flex>
  );
};
