import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user_id: null,
    is_authenticated: false,
    is_teacher: false,
    user_name: ''
  },
  reducers: {
    loginUser: (state, action) => {
      state.user_id = action.payload.user_id;
      state.user_name = action.payload.user_name
      state.is_authenticated = action.payload.is_authenticated;
      state.is_teacher = action.payload.is_teacher;
    },
    logoutUser: (state) => {
      state.user_id = null;
      state.is_authenticated = false;
      state.user_name = ''
      state.is_teacher = false;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;