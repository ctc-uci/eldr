import { Flex } from "@chakra-ui/react";
import { useState } from "react";
 
import BackgroundStep from "./steps/BackgroundStep";
import CreateAccountStep from "./steps/CreateAccountStep";
import LanguageStep from "./steps/LanguageStep";
import LanguageProficiencyStep from "./steps/LanguageProficiencyStep";
import LawInterestStep from "./steps/LawInterestStep";
import LoginStep from "./steps/LoginStep";
import NotaryStep from "./steps/NotaryStep";
import RoleStep from "./steps/RoleStep";  
import SuccessStep from "./steps/SuccessStep";
 
export const VolunteerLogin = () => {
  const [stepIndex, setStepIndex] = useState(1);
  const [volunteerId, setVolunteerId] = useState<number | undefined>(undefined);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
 
  const next = () => setStepIndex((prev) => Math.min(prev + 1, 9));
  const back = () => setStepIndex((prev) => Math.max(prev - 1, 1));
 
  const handleCreateAccountNext = (id: number) => {
    setVolunteerId(id);
    next();
  };
 
  return (
    <Flex
      w="100%"
      minH="100vh"
    >
      {stepIndex === 1 && (
        <LoginStep
          onNext={next}
          onBack={back}
        />
      )}
      {stepIndex === 2 && (
        <CreateAccountStep
          onNext={handleCreateAccountNext}
          onBack={back}
        />
      )}
      {stepIndex === 3 && (
        <LanguageStep
          onNext={next}
          volunteerId={volunteerId}
          onLanguagesSelected={setSelectedLanguages}
        />
      )}
      {stepIndex === 4 && (
        <LanguageProficiencyStep
          onNext={next}
          volunteerId={volunteerId}
          selectedLanguages={selectedLanguages}
        />
      )}
      {stepIndex === 5 && (
        <LawInterestStep
          onNext={next}
          onBack={back}
          volunteerId={volunteerId}
        />
      )}
      {stepIndex === 6 && (
        <NotaryStep
          onNext={next}
          volunteerId={volunteerId}
        />
      )}
      {stepIndex === 7 && <RoleStep onNext={next} />}
      {stepIndex === 8 && <BackgroundStep onNext={next} />}
      {stepIndex === 9 && <SuccessStep onNext={() => setStepIndex(1)} />}
    </Flex>
  );
};