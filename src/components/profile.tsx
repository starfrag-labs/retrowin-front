import { useQueryClient } from '@tanstack/react-query';
import { IProfile } from '../types/response';

export const Profile = ({
  switchShowProfile,
  profile,
}: {
  switchShowProfile: () => void;
  profile: IProfile;
}): React.ReactElement => {
  const queryClient = useQueryClient();

  const logout = () => {
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
};
