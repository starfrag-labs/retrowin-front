import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Logo } from '../components/logo';
import { authContainer, authForm } from '../css/styles/auth.css';
import { centerContainer } from '../css/styles/container.css';
import { useRecoilState } from 'recoil';
import { userState } from '../features/user/userState';
import { useState } from 'react';
import { login } from '../utils/api/auth';

export const Route = createFileRoute('/login')({
  component: LoginComponent,
});

function LoginComponent() {
  const [user, setUser] = useRecoilState(userState);
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser({
      ...user,
      loading: true,
    })
    const result = await login(form.email, form.password)
      .then((response) => {
        if (response.status === 200) {
          return response;
        }
        return null;
      })
      .catch(() => {
        return null;
      });
    if (result && result.headers['authorization']) {
      setUser({
        ...user,
        accessToken: result.headers['authorization'],
        loggedIn: true,
        loading: false,
      });
      router.navigate({ to: '/cloud' });
    } else {
      setUser({
        ...user,
        loggedIn: false,
        loading: false,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (user.loading) {
    return <div>Loading user...</div>;
  }

  return (
    <div className={centerContainer}>
      <div className={authContainer}>
        <Logo fontSize="4rem" />
        <form className={authForm} onSubmit={handleSubmit}>
          <input
            name="email"
            type="text"
            placeholder="example@ifelfi.com"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="text"
            placeholder="password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit">login</button>
        </form>
      </div>
    </div>
  );
}
