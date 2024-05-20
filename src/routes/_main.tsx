import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from '@tanstack/react-router';
import { useState } from 'react';
import { pageContainer } from '../css/styles/container.css';
import { header } from '../css/styles/header.css';
import { useTokenStore } from '../store/tokenStore';
import { useUserStore } from '../store/userStore';
import { Logo } from '../components/Logo';
import { Profile } from '../components/Profile';

export const Route = createFileRoute('/_main')({
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
  component: MainComponent,
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
