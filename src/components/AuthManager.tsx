import { useCallback, useEffect } from "react";
import { useTokenStore } from "../store/token.store"
import { isValid, refresh } from "../api/auth";
import { useUserStore } from "../store/user.store";
import { defaultContainer } from "../styles/global/container.css";

export const AuthManager = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const accessToken = useTokenStore((state) => state.accessToken);
  const isCloudUser = useUserStore((state) => state.isCloudUser);
  const setAccessToken = useTokenStore((state) => state.setAccessToken);

  const validateToken = useCallback(async () => {
    console.log(accessToken);
    
    if (accessToken) {
      await isValid(accessToken)
        .then((response) => {
          console.log(response);
        })
        .catch(async () => {
          const newToken = await refresh(accessToken).then((response) => {
            const token = response.headers['authorization'].split(
              ' '
            )[1] as string;
            return token;
          });
          setAccessToken(newToken);
        });
    }
  }, [accessToken, setAccessToken]);

  useEffect(() => {
    validateToken();
  }, [accessToken, validateToken]);

  return <div className={defaultContainer}>{isCloudUser && children}</div>;
}
