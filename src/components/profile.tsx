import { Profile as IProfile } from "../types/response"

export function Profile({
  logout,
  switchShowProfile,
  profile
}: {
  logout: () => void
  switchShowProfile: () => void
  profile: IProfile 
}) {

  return (
    <div>
      <p>{profile.email}</p>
      <p>{profile.nickname}</p>
      <button onClick={switchShowProfile}>close</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}