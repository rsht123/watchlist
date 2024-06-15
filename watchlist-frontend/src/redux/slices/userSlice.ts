import { createSlice } from '@reduxjs/toolkit';
import { appConfig } from '../../appConfig';

export interface User {
  _id: string;
  email: string;
  username: string;
  token?: string;
  tokenV4?: string;
}

export interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser: (state, action) => {
      const user = action.payload;
      state.user = user;
      localStorage.setItem(appConfig.localStorageKey, user.token);
      return state;
    },
    signout: (state, _) => {
      state.user = null;
      localStorage.removeItem(appConfig.localStorageKey);
      return state;
    },
  },
});

export const { saveUser, signout } = userSlice.actions;

export default userSlice.reducer;
