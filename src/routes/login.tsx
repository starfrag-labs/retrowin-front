import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Logo } from '../components/logo';
import { authContainer, authForm } from '../css/styles/auth.css';
import { centerContainer } from '../css/styles/container.css';
import { useRecoilState } from 'recoil';
import { userState } from '../features/user/userState';
import { useState } from 'react';
import axios from 'axios';
import { api } from '../main';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  const [user, setUser] = useRecoilState(userState);
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await login();
    if (result) {
      router.navigate({ to: '/' });
    } else {
      console.error('login failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async (): Promise<boolean> => {
    const response = await axios.post(api.auth + '/auth/local/login', {
      email: form.email,
      password: form.password,
    });
    if (response.status === 200) {
      console.log(response.headers['authorization'] ?? 'no authorization header');
      setUser({ ...user, accessToken: response.headers['authorization'] });
      return true;
    }
    return false;
  };

  return (
    <div className={centerContainer}>
      <div className={authContainer}>
        <Logo fontSize="4rem" />
        <form className={authForm} onSubmit={handleSubmit}>
          <input
            name="email"
            type="text"
            placeholder="example.ifelfi.com"
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
