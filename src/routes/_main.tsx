import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from '@tanstack/react-router';
import { Logo } from '../components/logo';
import { Profile } from '../components/profile';
import { useState } from 'react';
import { pageContainer } from '../css/styles/container.css';
import { header } from '../css/styles/header.css';
import { useTokenStore } from '../store/tokenStore';
import { useUserStore } from '../store/userStore';

export const Route = createFileRoute('/_main')({
  component: MainComponent,
  loader: async () => {
    const accessToken = useTokenStore.getState().accessToken;
    const { profile, isCloudUser } = useUserStore.getState();
    if (!accessToken || !isCloudUser || !profile) {
      throw redirect({
        to: '/',
      });
    }
    return {
      profile,
    };
  },
});

function MainComponent() {
  const [showProfile, setShowProfile] = useState(false);
  const loaderData = Route.useLoaderData();

  const switchShowProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div>
      <header className={header}>
        <Logo />
        <Link to="..">home</Link>
        {showProfile ? (
          <Profile
            switchShowProfile={switchShowProfile}
            profile={loaderData.profile}
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
