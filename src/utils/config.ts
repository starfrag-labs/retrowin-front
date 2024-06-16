import { Config } from "../types/config";

const auth = import.meta.env.VITE_AUTH_API as string;
const cloud = import.meta.env.VITE_CLOUD_API as string;
const oauth = import.meta.env.VITE_OAUTH as string;
const redirectUrl = import.meta.env.VITE_REDIRECT as string;

export default {
  auth,
  cloud,
  oauth,
  redirectUrl,
} as Config ;