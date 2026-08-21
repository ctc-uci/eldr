import { Box, Button, IconButton, Link } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { LuArrowRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import LoginCardLayout from "@/components/login/LoginCardLayout";
import LoginFormField from "@/components/login/LoginFormField";
import LoginLayout from "@/components/login/LoginLayout";
import LoginSSOButtons from "@/components/login/LoginSSOButtons";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import {
  authenticateGoogleUser,
  authenticateMicrosoftUser,
} from "@/utils/auth/providers";
import { clearCookies } from "@/utils/auth/cookie";
import { refreshToken } from "@/utils/auth/firebase";
import {
  getAuth,
  getRedirectResult,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Cookies } from "react-cookie";

type UserRecord = {
  email?: string;
  role?: string;
};

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [passFilled, setPassFilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [ssoError, setSsoError] = useState("");
  const auth = getAuth();

  const isAdmin = (lookupEmail: string, users: UserRecord[]) => {
    const normalizedEmail = lookupEmail.trim().toLowerCase();
    return users.some(
      (curr) =>
        (curr.email ?? "").trim().toLowerCase() === normalizedEmail &&
        (curr.role === "staff" || curr.role === "supervisor")
    );
  };

  const handleAdminLogin = async () => {
    let valid = true;

    if (!email.trim()) {
      setEmailError("Please enter a valid email.");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Please enter a valid password.");
      valid = false;
    }

    if (!valid) return;

    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Authenticate with Firebase first
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);

      // 2. Retrieve user role securely using their specific UID
      const response = await backend.get(`/users/${userCredential.user.uid}`);
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      const userRole = userData?.role;

      if (userRole !== "staff" && userRole !== "supervisor") {
        // Not authorized as admin, sign out and show error
        await signOut(auth);
        setEmailError("Email not found or not authorized. Please try again.");
        return;
      }

      navigate("/events");
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };

      if (
        firebaseError.code === "auth/invalid-credential" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        setPasswordError("Invalid password. Please try again.");
        return;
      }

      if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/invalid-email"
      ) {
        setEmailError("Email not found. Please try again.");
        return;
      }

      setEmailError(firebaseError.message ?? "Sign in failed. Please try again.");
    }
  };

  const handleGoogleSso = async () => {
    await authenticateGoogleUser();
  };

  const handleMicrosoftSso = async () => {
    await authenticateMicrosoftUser();
  };

  useEffect(() => {
    const handleAdminRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result) return;

        const ssoEmail = (result.user.email ?? "").trim().toLowerCase();
        if (!ssoEmail) {
          await signOut(auth);
          setSsoError("No staff account exists with those credentials.");
          return;
        }

        await refreshToken();

        const response = await backend.get(`/users/${result.user.uid}`);
        const userData = Array.isArray(response.data) ? response.data[0] : response.data;
        const userRole = userData?.role;

        if (userRole !== "staff" && userRole !== "supervisor") {
          await signOut(auth);
          clearCookies(new Cookies());
          setSsoError("No staff account exists with those credentials.");
          return;
        }

        navigate("/events");
      } catch (error: unknown) {
        const firebaseError = error as { message?: string };
        await signOut(auth);
        clearCookies(new Cookies());
        setSsoError(firebaseError.message ?? "Sign in failed. Please try again.");
      }
    };

    void handleAdminRedirectResult();
  }, [auth, backend, navigate]);

  return (
    <LoginLayout>
      <LoginCardLayout>
        <LoginFormField
          label="Email"
          required
          type="email"
          placeholder="Enter an email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          errorText={emailError}
        />

        <LoginFormField
          label="Password"
          required
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            const val = e.target.value;
            setPassFilled(val.length > 0);
            setPassword(val);
            setPasswordError("");
          }}
          errorText={passwordError}
          rightElement={
            passFilled ? (
              <IconButton
                variant="ghost"
                boxSize="20px"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
                _hover={{ bg: "transparent" }}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </IconButton>
            ) : null
          }
        />

        <Box w="30vw" minW="320px" maxW="460px" textAlign="right" mt="-4px">
          <Link
            textDecoration="underline"
            color="#3182CE"
            href="/adminForgotPass?from=admin"
            fontSize={{ base: "13px", md: "14px" }}
          >
            Forgot Password?
          </Link>
        </Box>

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
          onClick={handleAdminLogin}
          position="relative"
        >
          Login
          <Box position="absolute" right="16px">
            <LuArrowRight size={16} />
          </Box>
        </Button>

        <LoginSSOButtons
          onGoogleLogin={handleGoogleSso}
          onMicrosoftLogin={handleMicrosoftSso}
          ssoError={ssoError}
        />
      </LoginCardLayout>
    </LoginLayout>
  );
};