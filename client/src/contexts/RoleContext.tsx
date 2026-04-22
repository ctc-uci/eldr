import { createContext, ReactNode, useEffect, useState } from "react";

import { onIdTokenChanged } from "firebase/auth";

import type { User as DbUser, User } from "../types/user";
import { cookieKeys, setCookie } from "../utils/auth/cookie";
import { auth } from "../utils/auth/firebase";
import { useBackendContext } from "./hooks/useBackendContext";

type DbUserRole = DbUser["role"];

function roleFromUsersPayload(data: unknown): DbUserRole | undefined {
  if (Array.isArray(data)) {
    return (data[0] as User | undefined)?.role;
  }
  if (data && typeof data === "object" && "role" in data) {
    return (data as User).role;
  }
  return undefined;
}

interface RoleContextProps {
  role: DbUserRole | undefined;
  loading: boolean;
}

export const RoleContext = createContext<RoleContextProps | null>(null);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { backend } = useBackendContext();

  const [role, setRole] = useState<DbUserRole | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Match AuthContext: onIdTokenChanged runs when the session token is ready
    // (including after signInWithCustomToken), avoiding auth vs token races.
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          try {
            const idToken = await user.getIdToken();
            setCookie({ key: cookieKeys.ACCESS_TOKEN, value: idToken });
          } catch {
            /* ignore */
          }

          const response = await backend.get(`/users/${user.uid}`);
          setRole(roleFromUsersPayload(response.data));
        } else {
          setRole(undefined);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`Error setting role: ${msg}`);
        setRole(undefined);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [backend]);

  // Always render children so <Router> stays mounted during role refetch after
  // auth changes (e.g. volunteer signup). ProtectedRoute gates on `loading`.
  return (
    <RoleContext.Provider value={{ role, loading }}>
      {children}
    </RoleContext.Provider>
  );
};
