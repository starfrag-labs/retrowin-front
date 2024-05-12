import {
  Link,
  Navigate,
  Outlet,
  createFileRoute,
} from '@tanstack/react-router';
import { Logo } from '../components/logo';
import { Profile } from '../components/profile';
import { useState } from 'react';
import { pageContainer } from '../css/styles/container.css';
import { header } from '../css/styles/header.css';
import { useUserStore } from '../store/userStore';

export const Route = createFileRoute('/_main')({
  component: MainComponent,
});

function MainComponent() {
  const loggedIn = useUserStore((state) => state.loggedIn);
  const updateAccessToken = useUserStore((state) => state.updateAccessToken);
  const updateLoggedIn = useUserStore((state) => state.updateLoggedIn);
  const [showProfile, setShowProfile] = useState(false);

  const logout = () => {
    updateAccessToken('');
    updateLoggedIn(false);
  };

  const switchShowProfile = () => {
    setShowProfile(!showProfile);
  };

  if (!loggedIn) {
    return <Navigate to=".." />;
  }

  return (
    <div>
      <header className={header}>
        <Logo />
        <Link to="..">home</Link>
        {showProfile ? (
          <Profile logout={logout} switchShowProfile={switchShowProfile} />
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
