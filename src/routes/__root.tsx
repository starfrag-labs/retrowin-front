import { createRootRoute, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { themes } from '../css/themes/index.css';
import { root } from '../css/styles/root.css';
import { useRecoilState } from 'recoil';
import { userState } from '../features/user/userState';

export const Route = createRootRoute({
  component: RootComponent,
});

const setTheme = (theme: string) => {
  switch (theme) {
    case 'dark':
      return themes.dark;
    case 'light':
      return themes.light;
    default:
      return themes.default;
  }
};

function RootComponent() {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate({ from: '/' });
  return (
    <>
      <div className={setTheme('light')}>
        <div className={root}>
          {user.theme ? <div>true</div> : navigate({ to: '/login' })}
          <TanStackRouterDevtools position="bottom-right" />
        </div>
      </div>
    </>
  );
}
