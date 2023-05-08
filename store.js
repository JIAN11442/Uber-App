import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./feature/DataSlice";
import navReducer from "./feature/navSlice";
import useStateReducer from "./feature/useStateSlice";

export const store = configureStore({
  reducer: {
    data: dataReducer,
    nav: navReducer,
    useState: useStateReducer,
  },
});
