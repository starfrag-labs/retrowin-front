import { Navigate, createFileRoute } from '@tanstack/react-router';
import { Logo } from '../components/logo';
import { api } from '../utils/config';
import { getProfile, isValid, issue } from '../utils/api/auth';
import { z } from 'zod';
import { button } from '../css/styles/button.css';
import { indexBackground } from '../css/styles/background.css';
import { blurContainer } from '../css/styles/container.css';
import { useTokenStore } from '../store/tokenStore';
import { checkUser, enrollUser } from '../utils/api/cloud';
import { useUserStore } from '../store/userStore';

const codeSchema = z.object({
  code: z.string().optional(),
});

export const Route = createFileRoute('/')({
  component: IndexComponent,
  validateSearch: codeSchema,
  beforeLoad: async ({ search: { code } }) => {
    if (!code) {
      return {
        accessToken: null,
      };
    }
    const accessToken = await issue(code)
      .then((response) => {
        const token = response.headers['authorization'].split(' ')[1];
        return token;
      })
      .catch(() => {
        return null;
      });
    return {
      accessToken: accessToken,
    };
  },
  loader: async ({ context: { accessToken } }) => {
    const { setIsCloudUser, setProfile } = useUserStore.getState();
    const setAccessToken = useTokenStore.getState().setAccessToken;
    if (accessToken) {
      setAccessToken(accessToken);
    }
    let storedToken = '';
    storedToken = useTokenStore.getState().accessToken;
    console.log('token' + storedToken);
    await isValid(storedToken).catch(() => {
      setAccessToken('');
      storedToken = '';
    });

    if (!storedToken) {
      return;
    }
    await checkUser(storedToken)
      .then(() => {
        setIsCloudUser(true);
      })
      .catch(() => {
        setIsCloudUser(false);
      });

    let isCloudUser: boolean = false;
    isCloudUser = useUserStore.getState().isCloudUser;
    if (!isCloudUser) {
      const enrollResult = await enrollUser(storedToken).catch(() => {
        return false;
      });
      if (!enrollResult) {
        return;
      }
      await checkUser(storedToken)
        .then(() => {
          setIsCloudUser(true);
        })
        .catch(() => {
          setIsCloudUser(false);
        });
    }
    await getProfile(storedToken)
      .then((response) => {
        const profile = response.data.data;
        setProfile(profile);
      })
      .catch(() => {
        return;
      });
  },
});

function IndexComponent() {
  const accessToken = useTokenStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to="./cloud" />;
  }

  // If the user is not logged in, show the login page
  const loginUrl = `${api.oauth}?redirect_url=${api.redirectUrl}`;
  return (
    <div className={indexBackground}>
      <div className={blurContainer}>
        <Logo fontSize="4rem" />
        <div>
          Upload and share your files with your friends, family, and the world.
        </div>
        <a href={loginUrl}>
          <button className={button}>Login</button>
        </a>
      </div>
    </div>
  );
}
