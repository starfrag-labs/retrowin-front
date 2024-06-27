import { useCallback, useEffect } from "react";
import { useTokenStore } from "../store/token.store"
import { isValid } from "../api/auth";
import { useUserStore } from "../store/user.store";
import { defaultContainer } from "../styles/global/container.css";

export const AuthManager = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const accessToken = useTokenStore((state) => state.accessToken);
  const isCloudUser = useUserStore((state) => state.isCloudUser);

  const validateToken = useCallback(async () => {
    if (accessToken) {
      await isValid()
    }
  }, [accessToken]);

  useEffect(() => {
    validateToken();
  }, [accessToken, validateToken]);

  return <div className={defaultContainer}>{isCloudUser && children}</div>;
}
