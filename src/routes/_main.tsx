import {
  Link,
  Navigate,
  Outlet,
  createFileRoute,
  defer,
} from '@tanstack/react-router';
import { Logo } from '../components/logo';
import { Profile } from '../components/profile';
import { useState } from 'react';
import { pageContainer } from '../css/styles/container.css';
import { header } from '../css/styles/header.css';
import { useTokenStore } from '../store/tokenStore';
import { useQueryClient } from '@tanstack/react-query';
import { createRootFolder, readFolder } from '../utils/api/cloud';
import { useUserStore } from '../store/userStore';

export const Route = createFileRoute('/_main')({
  component: MainComponent,
  loader: async ({ context: { queryClient } }) => {
    const accessToken = useTokenStore.getState().accessToken;
    const {profile, isCloudUser }= useUserStore.getState();
    if (!accessToken || !isCloudUser || !profile) {
      return;
    }
    const rootFolderData = queryClient.ensureQueryData({
      queryKey: ['read', 'folder', 'root'],
      queryFn: async () => {
        let data = await readFolder(accessToken, profile.uuidKey)
          .then((response) => {
            return response.data;
          })
          .catch(() => {
            return null;
          });
        if (!data) {
          const createResult = await createRootFolder(accessToken).catch(() => {
            return false;
          });
          if (createResult) {
            data = await readFolder(accessToken, profile.uuidKey).then((response) => {
              return response.data;
            });
          }
        }
        return data;
      },
    });
    return {
      profile,
      rootFolderData: defer(rootFolderData)
    };
  },
});

function MainComponent() {
  const queryClient = useQueryClient();
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const [showProfile, setShowProfile] = useState(false);
  const { profile, rootFolderData } = Route.useLoaderData();

  const logout = () => {
    setAccessToken('');
    queryClient.clear();
  };
  const switchShowProfile = () => {
    setShowProfile(!showProfile);
  };

  if (!profile) {
    return <Navigate to=".." />;
  }

  return (
    <div>
      <header className={header}>
        <Logo />
        <Link to="..">home</Link>
        {showProfile ? (
          <Profile
            logout={logout}
            switchShowProfile={switchShowProfile}
            profile={profile}
          />
        ) : (
          <button onClick={switchShowProfile}>profile</button>
        )}
      </header>
      <div className={pageContainer}>
        <Outlet />
      </div>
    </div>
  );
}
