import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TAuthResponse} from '../../definitions/types/TAuthResponse';
import {TAuthState} from '../../definitions/types/TAuthState';

const initialState: TAuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<TAuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;