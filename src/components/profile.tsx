export function Profile({
  logout,
  switchShowProfile
}: {
  logout: () => void
  switchShowProfile: () => void
}) {

  return (
    <div>
      <h1>Profile</h1>
      <button onClick={switchShowProfile}>close</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}