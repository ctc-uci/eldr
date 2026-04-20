import { Flex, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

import { completeVolunteerSignup } from "./completeVolunteerSignup";
import BackgroundStep from "./steps/BackgroundStep";
import CreateAccountStep from "./steps/CreateAccountStep";
import LanguageStep from "./steps/LanguageStep";
import LanguageProficiencyStep from "./steps/LanguageProficiencyStep";
import LawInterestStep from "./steps/LawInterestStep";
import LoginStep from "./steps/LoginStep";
import NotaryStep from "./steps/NotaryStep";
import RoleStep from "./steps/RoleStep";
import SuccessStep from "./steps/SuccessStep";
import {
  clearDraft,
  hasSignupBasics,
  loadDraft,
} from "./volunteerSignupDraft";
import {
  nextStep,
  pathForStep,
  type VolunteerLoginStep,
  VOLUNTEER_LOGIN_BASE,
  stepFromPathname,
} from "./volunteerLoginPaths";

export const VolunteerLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const { signup } = useAuthContext();

  const [completeError, setCompleteError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const step: VolunteerLoginStep = useMemo(() => {
    const parsed = stepFromPathname(location.pathname);
    if (parsed) return parsed;
    if (location.pathname.startsWith(`${VOLUNTEER_LOGIN_BASE}/`)) {
      return "login";
    }
    return "login";
  }, [location.pathname]);

  // Old bookmark: /login/volunteer/login -> /login/volunteer
  useEffect(() => {
    const p = location.pathname.replace(/\/$/, "");
    if (p === `${VOLUNTEER_LOGIN_BASE}/login`) {
      navigate(VOLUNTEER_LOGIN_BASE, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const parsed = stepFromPathname(location.pathname);
    if (
      location.pathname.startsWith(`${VOLUNTEER_LOGIN_BASE}/`) &&
      parsed === null
    ) {
      navigate(pathForStep("login"), { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (step !== "background") {
      setCompleteError(null);
    }
  }, [step]);

  useEffect(() => {
    if (step === "success") return;
    if (step === "login" || step === "create-account") return;
    // Draft is cleared after success while URL can still be `background` briefly;
    // do not redirect here or we race past `/success` to `create-account`.
    if (step === "background") return;
    if (!hasSignupBasics(loadDraft())) {
      navigate(pathForStep("create-account"), { replace: true });
    }
  }, [step, navigate]);

  const goToStep = useCallback(
    (s: VolunteerLoginStep) => {
      navigate(pathForStep(s));
    },
    [navigate]
  );

  const goNext = useCallback(() => {
    const n = nextStep(step);
    if (n) goToStep(n);
  }, [step, goToStep]);

  const handleCompleteSignup = useCallback(async () => {
    const d = loadDraft();
    if (!d || !hasSignupBasics(d)) {
      navigate(pathForStep("create-account"), { replace: true });
      return;
    }
    setCompleteError(null);
    setIsCompleting(true);
    try {
      await completeVolunteerSignup(backend, signup, d);
      navigate(pathForStep("success"), { replace: true });
      clearDraft();
    } catch (e: unknown) {
      const err = e as {
        code?: string;
        response?: { data?: { message?: string } | string };
        message?: string;
      };
      if (err.code === "auth/email-already-in-use") {
        setCompleteError(
          "An account with this email already exists. Please log in."
        );
        return;
      }
      const msg =
        (typeof err.response?.data === "object"
          ? err.response?.data?.message
          : undefined) ||
        err.response?.data ||
        err.message ||
        "Could not create your account. Please try again.";
      setCompleteError(typeof msg === "string" ? msg : "Could not create account.");
    } finally {
      setIsCompleting(false);
    }
  }, [backend, signup, navigate]);

  return (
    <Flex
      w="100%"
      minH="100vh"
      direction="column"
    >
      {completeError && step === "background" && (
        <Text
          role="alert"
          px={4}
          py={2}
          bg="red.50"
          color="red.800"
          fontSize="sm"
          borderBottomWidth="1px"
          borderColor="red.200"
        >
          {completeError}
        </Text>
      )}
      {step === "login" && (
        <LoginStep onNavigateToCreateAccount={() => goToStep("create-account")} />
      )}
      {step === "create-account" && (
        <CreateAccountStep onNext={goNext} />
      )}
      {step === "languages" && (
        <LanguageStep onNext={goNext} />
      )}
      {step === "language-proficiency" && (
        <LanguageProficiencyStep onNext={goNext} />
      )}
      {step === "law-interests" && (
        <LawInterestStep onNext={goNext} />
      )}
      {step === "notary" && (
        <NotaryStep onNext={goNext} />
      )}
      {step === "role" && (
        <RoleStep onNext={goNext} />
      )}
      {step === "background" && (
        <BackgroundStep
          onComplete={handleCompleteSignup}
          isSubmitting={isCompleting}
        />
      )}
      {step === "success" && (
        <SuccessStep onNext={() => goToStep("login")} />
      )}
    </Flex>
  );
};
