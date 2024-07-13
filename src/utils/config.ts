import { Config } from "../types/config";

const gate = import.meta.env.VITE_API_GATEWAY as string;
const auth = import.meta.env.VITE_AUTH as string;
const redirectUrl = import.meta.env.VITE_REDIRECT as string;

export default {
  api: gate,
  oauth: auth,
  redirectUrl,
} as Config ;