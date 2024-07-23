import { Config } from '../types/config';

const gate = import.meta.env.VITE_API_GATEWAY as string;
const auth = import.meta.env.VITE_AUTH as string;
const redirectUrl = import.meta.env.VITE_REDIRECT as string;
const authPrefix = import.meta.env.VITE_AUTH_PREFIX as string;
const cloudPrefix = import.meta.env.VITE_CLOUD_PREFIX as string;

const config: Config = {
  gate,
  auth,
  redirectUrl,
  authPrefix,
  cloudPrefix,
};

export default config;

export {
  gate,
  auth,
  redirectUrl,
  authPrefix,
  cloudPrefix,
}