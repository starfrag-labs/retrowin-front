import { Config } from "../types/config";

const api = import.meta.env.VITE_API as string;
const oauth = import.meta.env.VITE_OAUTH as string;
const redirectUrl = import.meta.env.VITE_REDIRECT as string;

export default {
  api,
  oauth,
  redirectUrl,
} as Config ;