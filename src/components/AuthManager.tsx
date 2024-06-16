import { useCallback, useEffect } from "react";
import { useTokenStore } from "../store/token.store"
import { isValid, refresh } from "../api/auth";
import { useUserStore } from "../store/user.store";

export const AuthManager = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const accessToken = useTokenStore((state) => state.accessToken);
  const isCloudUser = useUserStore((state) => state.isCloudUser);
  const setAccessToken = useTokenStore((state) => state.setAccessToken);

  const validateToken = useCallback(async () => {
    if (accessToken) {
      await isValid(accessToken).catch(async () => {
        const newToken = await refresh(accessToken)
          .then((response) => {
            const token = response.headers['authorization'].split(
              ' '
            )[1] as string;
            return token;
          })
          .catch(() => {
            return '';
          });
        setAccessToken(newToken);
      });
    }
  }, [accessToken, setAccessToken]);

  useEffect(() => {
    validateToken();
  }, [accessToken, validateToken]);

  return <div>{isCloudUser && children}</div>;
}
