/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useCallback, useState } from "react";
import { useLoginSocialMutation, useSyncSocialMutation } from "@/services/auth";
import { LoginSocialRequest } from "@/interfaces/ILogin";
import { useAuthToken } from "@/hooks/useAuthToken";
import { handleError } from "@/utils/apiError";
import routes from "@/constants/routes";

interface AuthSocialContextType {
  loginOrSyncSocial: (data: LoginSocialRequest) => Promise<any>;
  justAuthenticated: boolean;
  clearJustAuthenticated: () => void;
}

const AuthSocialContext = createContext<AuthSocialContextType | undefined>(undefined);

export const AuthSocialProvider = ({ children }: { children: React.ReactNode }) => {
  const [loginSocial] = useLoginSocialMutation();
  const [syncSocial] = useSyncSocialMutation();
  const { setToken, token } = useAuthToken();
  const { ROOT } = routes;

  const [justAuthenticated, setJustAuthenticated] = useState(false);

  const loginOrSyncSocial = useCallback(
    async (data: LoginSocialRequest) => {
      try {
        let result;
        if (!token) {
          result = await loginSocial({
            ...data,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }).unwrap();

          if (result?.data.token) {
            setToken(result.data.token);
            setJustAuthenticated(true);
            window.location.href = ROOT;
          }
        } else {
          result = await syncSocial({ ...data }).unwrap();
          setJustAuthenticated(true);
        }

        return result;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [loginSocial, syncSocial, token, setToken, ROOT]
  );

  const clearJustAuthenticated = () => setJustAuthenticated(false);

  return (
    <AuthSocialContext.Provider value={{ loginOrSyncSocial, justAuthenticated, clearJustAuthenticated }}>
      {children}
    </AuthSocialContext.Provider>
  );
};

export const useAuthSocial = () => {
  const context = useContext(AuthSocialContext);
  if (!context) {
    throw new Error("useAuthSocial must be used within AuthSocialProvider");
  }
  return context;
};
