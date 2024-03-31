import {
  Link,
  Navigate,
  Outlet,
  createFileRoute,
} from '@tanstack/react-router';
import { header } from '../css/styles/header.css';
import { button } from '../css/styles/button.css';
import { pageContainer } from '../css/styles/container.css';
import { userState } from '../features/user/userState';
import { useRecoilState } from 'recoil';
import { Logo } from '../components/logo';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const [user] = useRecoilState(userState);

  if (user.loggedIn === false) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <header className={header}>
        <Logo />
        <button className={button}>logout</button>
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
