import { configureStore } from "@reduxjs/toolkit";
import { customReducer } from "./reducer";

const store = configureStore({
  reducer: {
    custom: customReducer,
  },
});
export default store;
