import { Api } from "../types/env";

const auth = import.meta.env.VITE_AUTH_API as string;
const cloud = import.meta.env.VITE_CLOUD_API as string;

export const api: Api = {
  auth,
  cloud,
};