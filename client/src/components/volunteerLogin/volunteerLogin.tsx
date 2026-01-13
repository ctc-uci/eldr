import { useState } from "react";

import { Box } from "@chakra-ui/react";

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

  return (
    <Box
      w="100%"
      maxW="480px"
    >
      {stepIndex === 0 && <WelcomeStep onNext={next} />}
      {stepIndex === 1 && <LoginStep onNext={next} />}
      {stepIndex === 2 && <CreateAccountStep onNext={next} />}
      {stepIndex === 3 && <GetStartedStep onNext={next} />}
      {stepIndex === 4 && <AboutYouStep onNext={next} />}
      {stepIndex === 5 && <InterestsStep onNext={next} />}
      {stepIndex === 6 && <SuccessStep />}
    </Box>
  );
};

export default VolunteerLogin;
