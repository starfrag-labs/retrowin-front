import { Navigate, Outlet, createFileRoute } from '@tanstack/react-router';
import { userState } from '../features/user/userState';
import { useRecoilState } from 'recoil';
import { Logo } from '../components/logo';
import { Profile } from '../components/profile';
import { useState } from 'react';
import { pageContainer } from '../css/styles/container.css';
import { header } from '../css/styles/header.css';

export const Route = createFileRoute('/_main')({
  component: MainComponent,
});

function MainComponent() {
  const [user, setUser] = useRecoilState(userState);
  const [showProfile, setShowProfile] = useState(false);

  const logout = () => {
    setUser({
      ...user,
      loggedIn: false,
    });
  };

  const switchShowProfile = () => {
    setShowProfile(!showProfile);
  };

  if (!user.loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <header className={header}>
        <Logo />
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
