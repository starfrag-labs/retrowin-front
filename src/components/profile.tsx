import { useQueryClient } from '@tanstack/react-query';
import { useTokenStore } from '../store/tokenStore';
import { IProfile as IProfile } from '../types/response';

export function Profile({
  switchShowProfile,
  profile,
}: {
  switchShowProfile: () => void;
  profile: IProfile;
}) {
  const setAccessToken = useTokenStore.getState().setAccessToken;
  const queryClient = useQueryClient();

  const logout = () => {
    setAccessToken('');
    queryClient.clear();
    location.href = '/';
  };

  return (
    <div>
      <p>{profile.email}</p>
      <p>{profile.nickname}</p>
      <button onClick={switchShowProfile}>close</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}
