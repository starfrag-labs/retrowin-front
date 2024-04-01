import {
  Link,
  Navigate,
  Outlet,
  createFileRoute,
} from '@tanstack/react-router';
import { header } from '../css/styles/header.css';
import { pageContainer } from '../css/styles/container.css';
import { userState } from '../features/user/userState';
import { useRecoilState } from 'recoil';
import { Logo } from '../components/logo';
import { Profile } from '../components/profile';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
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

  if (user.loggedIn === false) {
    return <Navigate to="/login" />;
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
        <Link
          to={'/about'}
          activeProps={{
            className: 'font-bold',
          }}
        >
          About
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
