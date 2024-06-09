import { create } from 'zustand';
import { IProfile } from '../types/response';

type State = {
  isCloudUser: boolean;
  profile: IProfile | null;
};

type Action = {
  setIsCloudUser: (isCloudUser: boolean) => void;
  setProfile: (profile: IProfile) => void;
};

const initialState: State = {
  isCloudUser: false,
  profile: null,
};

export const useUserStore = create<State & Action>((set) => ({
  profile: initialState.profile,
  isCloudUser: initialState.isCloudUser,
  setIsCloudUser: (isCloudUser) => set({ isCloudUser }),
  setProfile: (profile) => set({ profile }),
}));
