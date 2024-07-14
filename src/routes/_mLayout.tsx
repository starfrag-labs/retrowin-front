import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Loading } from '../components/Loading';
import { background, backgroundContainer } from '../styles/mobile/background.css';

export const Route = createFileRoute('/_mLayout')({
  pendingComponent: () => <Loading />,
  component: Component,
});

function Component() {
  return (
    <div className={backgroundContainer}>
      <div className={background}>
        <Outlet />
      </div>
    </div>
  );
}

