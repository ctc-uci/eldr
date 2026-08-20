import { Box, Button, Link, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import LoginCardLayout from "@/components/login/LoginCardLayout";
import LoginFormField from "@/components/login/LoginFormField";
import LoginLayout from "@/components/login/LoginLayout";
import LoginSSOButtons from "@/components/login/LoginSSOButtons";
import { toaster } from "@/components/ui/toaster";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { auth } from "@/utils/auth/firebase";
import {
  authenticateGoogleUser,
  authenticateMicrosoftUser,
} from "@/utils/auth/providers";

type Props = {
  onNavigateToCreateAccount: () => void;
};

type VolunteerLookupRow = {
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

const LoginStep: React.FC<Props> = ({ onNavigateToCreateAccount }) => {
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const { handleRedirectResult } = useAuthContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const toastLoginError = useCallback((msg: string) => {
    toaster.error({
      title: "An error occurred while signing in",
      description: msg,
    });
  }, []);

  const handleLogin = async () => {
    try {
      setFirstNameError(false);
      setLastNameError(false);
      setEmailError(false);

      if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        toastLoginError("Please enter first name, last name, and email.");
        return;
      }

      const response = await backend.get("/volunteers");
      const volunteers = (response.data ?? []) as VolunteerLookupRow[];

      const f = firstName.trim().toLowerCase();
      const l = lastName.trim().toLowerCase();
      const e = email.trim().toLowerCase();

      const match = volunteers.find((v) => {
        const vf = (v.firstName ?? v.first_name ?? "").toLowerCase().trim();
        const vl = (v.lastName ?? v.last_name ?? "").toLowerCase().trim();
        const ve = (v.email ?? "").toLowerCase().trim();

        return vf === f && vl === l && ve === e;
      });

      if (!match) {
        const firstExists = volunteers.some(
          (v) => (v.firstName ?? v.first_name ?? "").toLowerCase().trim() === f
        );

        const lastExists = volunteers.some(
          (v) => (v.lastName ?? v.last_name ?? "").toLowerCase().trim() === l
        );

        const emailExists = volunteers.some(
          (v) => (v.email ?? "").toLowerCase().trim() === e
        );

        setFirstNameError(!firstExists);
        setLastNameError(firstExists && !lastExists);
        setEmailError(firstExists && lastExists && !emailExists);

        if (!firstExists) setFirstName("");
        if (firstExists && !lastExists) setLastName("");
        if (firstExists && lastExists && !emailExists) setEmail("");

        return;
      }

      const tokenResponse = await backend.post("/users/custom-token", {
        email: match.email!.toLowerCase().trim(),
      });

      const customToken = tokenResponse.data?.customToken;

      if (!customToken) {
        throw new Error("Unable to generate authentication token.");
      }

      await signInWithCustomToken(auth, customToken);

      navigate("/event-catalog/all-events", { replace: true });
    } catch (err: unknown) {
      const authError = err as { message?: string };

      toastLoginError(authError?.message ?? "Unable to sign in.");
    }
  };

  const handleGoogleLogin = async () => {
    await authenticateGoogleUser();
  };

  const handleMicrosoftLogin = async () => {
    await authenticateMicrosoftUser();
  };

  useEffect(() => {
    const runRedirectResult = async () => {
      try {
        await handleRedirectResult(backend, navigate);
      } catch (error) {
        const authError = error as { message?: string };
        toastLoginError(
          authError?.message ?? "Unable to sign in with Google right now."
        );
      }
    };

    void runRedirectResult();
  }, [backend, handleRedirectResult, navigate, toastLoginError]);

  return (
    <LoginLayout>
      <LoginCardLayout>
        <LoginFormField
          label="First Name"
          required
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={firstNameError}
          errorText={
            firstNameError
              ? "No matching first name found. Please try again."
              : undefined
          }
        />

        <LoginFormField
          label="Last Name"
          required
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={lastNameError}
          errorText={
            lastNameError
              ? "No matching last name found. Please try again."
              : undefined
          }
        />

        <LoginFormField
          label="Email"
          required
          type="email"
          placeholder="Enter an email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          errorText={
            emailError
              ? "Email not found or does not match this account."
              : undefined
          }
        />

        <Button
          bg="white"
          borderColor="#E4E4E7"
          borderWidth="1px"
          color="black"
          h={{ base: "40px", md: "48px" }}
          w="30vw"
          minW="320px"
          maxW="460px"
          borderRadius="6px"
          fontSize={{ base: "13px", md: "14px" }}
          fontWeight={500}
          _active={{ bg: "black", color: "white" }}
          _hover={{
            bg: "#F4F4F5",
            _active: {
              bg: "black",
              color: "white",
            },
          }}
          justifyContent="center"
          px="20px"
          mt="4px"
          onClick={handleLogin}
          position="relative"
        >
          Login
          <Box position="absolute" right="16px">
            <LuArrowRight size={16} />
          </Box>
        </Button>

        <LoginSSOButtons
          onGoogleLogin={handleGoogleLogin}
          onMicrosoftLogin={handleMicrosoftLogin}
        />

        <Text fontSize="13px" color="gray.500" textAlign="center">
          <Link
            href="#"
            color="#3182CE"
            textDecoration="underline"
            onClick={(e) => {
              e.preventDefault();
              onNavigateToCreateAccount();
            }}
          >
            Create an account
          </Link>
        </Text>
      </LoginCardLayout>
    </LoginLayout>
  );
};

export default LoginStep;
