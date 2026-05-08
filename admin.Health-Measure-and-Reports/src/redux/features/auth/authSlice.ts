import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
export interface IUser {
  email: string;
  name: string;
  role: string;
  profile_photo?: string;
  last_login: Date;
  is_active: boolean;
}
interface TAuthState {
  user?: IUser | null;
  token?: string | null;
}

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
      const { user, token } = action.payload;
      console.log("🔧 AuthSlice: setUser called with:", {
        user,
        token: token?.substring(0, 20) + "...",
      });
      state.user = user;
      state.token = token;
      console.log("🔧 AuthSlice: State updated to:", {
        user: state.user,
        token: state.token?.substring(0, 20) + "...",
      });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setProfile: (state, action) => {
      if (state.user) {
        state.user.profile_photo = action.payload;
      }
    },
    setRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
  },
});

export const { setUser, logout, setProfile, setRole } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
