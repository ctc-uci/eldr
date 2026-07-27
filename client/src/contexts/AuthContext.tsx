import { createContext, ReactNode, useEffect, useState } from "react";

import { Spinner } from "@chakra-ui/react";

import { AxiosInstance } from "axios";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onIdTokenChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { NavigateFunction } from "react-router-dom";

import { cookieKeys, setCookie } from "../utils/auth/cookie";
import { auth } from "../utils/auth/firebase";
import { useBackendContext } from "./hooks/useBackendContext";

interface AuthContextProps {
  currentUser: User | null;
  signup: ({ email, password }: EmailPassword) => Promise<UserCredential>;
  login: ({ email, password }: EmailPassword) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: ({ email }: Pick<EmailPassword, "email">) => Promise<void>;
  handleRedirectResult: (
    backend: AxiosInstance,
    navigate: NavigateFunction
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface EmailPassword {
  email: string;
  password: string;
}

function splitDisplayName(displayName?: string | null) {
  const normalized = String(displayName ?? "").trim();
  if (!normalized) {
    return null;
  }

  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return null;
  }

  if (parts.length === 2) {
    return { firstName: parts[0], lastName: parts[1] };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { backend } = useBackendContext();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async ({ email, password }: EmailPassword) => {
    if (currentUser) {
      signOut(auth);
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await backend.post("/users/create", {
      email: email,
      firebaseUid: userCredential.user.uid,
    });

    return userCredential;
  };

  const login = ({ email, password }: EmailPassword) => {
    if (currentUser) {
      signOut(auth);
    }

    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = ({ email }: Pick<EmailPassword, "email">) => {
    return sendPasswordResetEmail(auth, email);
  };

  /**
   * Helper function which keeps our DB and our Firebase in sync.
   * If a user signs in with Google redirect, we ensure the DB has a user + volunteer row.
   *
   * The volunteer endpoint upserts both records, including a stub volunteer profile.
   */
  const handleRedirectResult = async (
    backend: AxiosInstance,
    navigate: NavigateFunction
  ) => {
    try {
      const result = await getRedirectResult(auth);

      if (result) {
        if (!result.user.email) {
          throw new Error("Google account is missing an email address.");
        }

        const nameParts = splitDisplayName(result.user.displayName);
        if (!nameParts) {
          throw new Error(
            "Google SSO needs a first and last name. Please update your Google profile name and try again."
          );
        }

        await backend.post("/volunteers", {
          firebaseUid: result.user.uid,
          first_name: nameParts.firstName,
          last_name: nameParts.lastName,
          email: result.user.email,
          phone_number: null,
          form_completed: false,
          form_link: null,
          is_signed_confidentiality: null,
          is_attorney: null,
          is_notary: null,
          affiliated_employer: null,
          law_school_year: null,
          state_bar_certificate: null,
          state_bar_number: null,
        });

        navigate("/event-catalog/all-events", { replace: true });
      }
    } catch (error) {
      console.error("Redirect result error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          setCookie({ key: cookieKeys.ACCESS_TOKEN, value: idToken });
        } catch (e) {
          console.error("Could not sync Firebase ID token to cookie:", e);
        }
      } else {
        document.cookie = `${cookieKeys.ACCESS_TOKEN}=; max-age=0; path=/`;
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        handleRedirectResult,
      }}
    >
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};
