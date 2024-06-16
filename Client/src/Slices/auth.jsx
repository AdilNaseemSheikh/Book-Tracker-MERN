import { createSlice } from "@reduxjs/toolkit";
import { authUser, logout as logoutUser } from "../services/authservice";

const initialState = {
  loading: false,
  authenticated: false,
  username: "",
  email: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    loading: (state, action) => {
      state.loading = action.payload;
    },
    authenticate: (state, action) => {
      const { payload } = action;
      state.email = payload.email;
      state.username = payload.username;
      state.authenticated = payload.authenticated;
      state.loading = false;
    },
    logout: (state, action) => {
      state.email = "";
      state.username = "";
      state.authenticated = false;
      state.loading = false;
    },
  },
});

// export const { authenticate } = authSlice.actions;

export const authenticate = () => {
  return async (dispatch, state) => {
    dispatch({ type: "auth/loading", payload: true });
    const { user, status } = await authUser();
    dispatch({
      type: "auth/authenticate",
      payload: {
        email: user?.email || "",
        username: user?.name || "",

        authenticated: status === "auth",
      },
    });
  };
};

export const logout = () => {
  return async (dispatch, state) => {
    dispatch({ type: "auth/loading", payload: true });
    const { status } = await logoutUser();
    dispatch({
      type: "auth/logout",
    });
  };
};

export default authSlice.reducer;
