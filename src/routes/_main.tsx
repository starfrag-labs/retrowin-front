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
// import { checkUser, enrollUser } from '../utils/api/cloud';

export const Route = createFileRoute('/_main')({
  component: MainComponent,
});

function MainComponent() {
  const loggedIn = useUserStore((state) => state.loggedIn);
  const updateAccessToken = useUserStore((state) => state.updateAccessToken);
  const updateLoggedIn = useUserStore((state) => state.updateLoggedIn);
  const [showProfile, setShowProfile] = useState(false);

  if (loggedIn === 'loggedOut') {
    return <Navigate to=".." />;
  }

  // const isUser = async (accessToken: string) => {
  //   const checkUserResponse = await checkUser(accessToken);
  //   if (checkUserResponse.status === 200) {
  //     return true;
  //   }
  //   const createUserResponse = await enrollUser(accessToken);
  //   if (createUserResponse.status === 200) {
  //     return true;
  //   }
  //   return false;
  // };

  const logout = () => {
    updateAccessToken('');
    updateLoggedIn('loggedOut');
  };

  const switchShowProfile = () => {
    setShowProfile(!showProfile);
  };

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
