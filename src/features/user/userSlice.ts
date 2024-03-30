const getThemeFromLocalStorage = () => {
  const theme = localStorage.getItem('theme');
  return theme ? theme : 'light';
}

const initialState = {
  theme: getThemeFromLocalStorage(),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
})

export default userSlice.reducer