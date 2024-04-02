import { Navigate, createFileRoute } from '@tanstack/react-router';
import { useRecoilState } from 'recoil';
import { userState } from '../features/user/userState';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  const [user, setUser] = useRecoilState(userState);

  const validate = async () => {
    setUser({
      ...user,
      loading: true,
    });
    await validate()
      .then((response) => {
        if (response.status === 200) {
          setUser({
            ...user,
            accessToken: response.headers['authorization'],
            loggedIn: true,
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setUser({
          ...user,
          accessToken: '',
          loggedIn: false,
          loading: false,
        });
      });
  };

  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user.loading) {
    return <div>loading...</div>;
  } else {
    if (user.loggedIn) {
      return <Navigate to="/cloud" />;
    } else {
      return <Navigate to="/login" />;
    }
  }
}
