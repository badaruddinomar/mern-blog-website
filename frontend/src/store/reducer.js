import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  userData: undefined,
  sPosts: [],
};

export const customReducer = createReducer(initialState, {
  isLoggedIn: (state, action) => {
    state.loggedIn = true;
    state.userData = action.payload;
  },
  notLoggedIn: (state, action) => {
    state.loggedIn = false;
    state.userData = action.payload;
  },
  searchPosts: (state, action) => {
    state.sPosts = action.payload;
  },
});
