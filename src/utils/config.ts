import { Api } from "../types/env";

const auth = import.meta.env.VITE_AUTH_API as string;
const cloud = import.meta.env.VITE_CLOUD_API as string;
const oauth = import.meta.env.VITE_OAUTH as string;
const redirectUrl = import.meta.env.VITE_REDIRECT as string;

export const api: Api = {
  auth,
  cloud,
  oauth,
  redirectUrl
};