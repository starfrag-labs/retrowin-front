import { create } from "zustand";
import { Profile } from "../types/response";

type State = {
  isCloudUser: boolean;
  profile: Profile | null
};

type Action = {
  setIsCloudUser: (isCloudUser: boolean) => void;
  setProfile: (profile: Profile) => void;
};

const initialState: State = {
  isCloudUser: false,
  profile: null
};

export const useUserStore = create<State & Action>((set) => ({
  profile: initialState.profile,
  isCloudUser: initialState.isCloudUser,
  setIsCloudUser: (isCloudUser) => set({ isCloudUser }),
  setProfile: (profile) => set({ profile }),
}));