import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./feature/DataSclice";
import navReducer from "./feature/navSlice";

export const store = configureStore({
  reducer: {
    data: dataReducer,
    nav: navReducer,
  },
});
