import { createContext, ReactNode, useEffect, useState } from "react";

import { Spinner } from "@chakra-ui/react";

import { AxiosInstance } from "axios";
import {
  AuthError,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getRedirectResult,
  GoogleAuthProvider,
  linkWithCredential,
  OAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { NavigateFunction } from "react-router-dom";

import { auth } from "../utils/auth/firebase";
import { useBackendContext } from "./hooks/useBackendContext";

const PENDING_CRED_KEY = "pendingCred";

interface StoredCredential {
  providerId: string;
  idToken?: string;
  accessToken?: string;
}

interface AuthContextProps {
  currentUser: User | null;
  signup: ({ email, password }: EmailPassword) => Promise<UserCredential>;
  login: ({ email, password }: EmailPassword) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: ({ email }: Pick<EmailPassword, "email">) => Promise<void>;
  handleRedirectResult: (
    backend: AxiosInstance,
    navigate: NavigateFunction,
    callbacks?: {
      onAccountConflict?: (existingProviderId: string | null) => void;
    }
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface EmailPassword {
  email: string;
  password: string;
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
   * If a pending OAuth credential was saved to sessionStorage during a previous
   * account-conflict redirect, reconstruct it and link it to the signed-in user.
   */
  const linkPendingCredential = async (user: User) => {
    const pendingCredJson = sessionStorage.getItem(PENDING_CRED_KEY);
    if (!pendingCredJson) return;

    sessionStorage.removeItem(PENDING_CRED_KEY);
    try {
      const { providerId, idToken, accessToken }: StoredCredential =
        JSON.parse(pendingCredJson);

      const pendingCred =
        providerId === "google.com"
          ? GoogleAuthProvider.credential(idToken ?? null, accessToken)
          : new OAuthProvider(providerId).credential({ idToken, accessToken });

      await linkWithCredential(user, pendingCred);
    } catch (err) {
      console.error("Failed to link pending credential:", err);
    }
  };

  /**
   * Ensures the signed-in Firebase user exists in the DB.
   * Rolls back the Firebase user if DB creation fails.
   */
  const syncUserWithDB = async (
    backend: AxiosInstance,
    uid: string,
    email: string | null
  ) => {
    const response = await backend.get(`/users/${uid}`);
    if (response.data.length > 0) return;

    try {
      await backend.post("/users/create", { email, firebaseUid: uid });
    } catch (e) {
      await backend.delete(`/users/${uid}`);
      console.error("Account was not created:", e);
    }
  };

  /**
   * Given an `auth/account-exists-with-different-credential` error:
   * - Stores the pending credential in sessionStorage for later linking.
   * - Returns the provider ID that already owns the email, or null if unknown.
   */
  const handleAccountConflict = async (authError: AuthError) => {
    const pendingCred =
      OAuthProvider.credentialFromError(authError) ??
      GoogleAuthProvider.credentialFromError(authError);

    if (pendingCred) {
      const credData: StoredCredential = {
        providerId: pendingCred.providerId,
        idToken: pendingCred.idToken,
        accessToken: pendingCred.accessToken,
      };
      sessionStorage.setItem(PENDING_CRED_KEY, JSON.stringify(credData));
    }

    const email = (authError.customData?.email as string) ?? "";
    if (!email) return null;

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods[0] ?? null;
    } catch {
      return null;
    }
  };

  /**
   * Processes the result of a `signInWithRedirect` call.
   * - Links any previously saved pending credential.
   * - Syncs the user with the DB.
   * - Handles `auth/account-exists-with-different-credential` by saving the
   *   pending credential and notifying the component via `onAccountConflict`.
   */
  const handleRedirectResult = async (
    backend: AxiosInstance,
    navigate: NavigateFunction,
    callbacks?: {
      onAccountConflict?: (existingProviderId: string | null) => void;
    }
  ) => {
    try {
      const result = await getRedirectResult(auth);
      if (!result) return;

      await linkPendingCredential(result.user);
      await syncUserWithDB(backend, result.user.uid, result.user.email);
      navigate("/dashboard");
    } catch (error) {
      const authError = error as AuthError;

      if (authError.code === "auth/account-exists-with-different-credential") {
        const existingProviderId = await handleAccountConflict(authError);
        callbacks?.onAccountConflict?.(existingProviderId);
        return;
      }

      console.error("Redirect result error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
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
