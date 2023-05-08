import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  data: [],
};

export const DataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addData: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addData } = DataSlice.actions;

export const selectData = (state) => state.data.data;

export const selectDataWithName = (dataName) => {
  return useSelector(selectData).filter(
    (data) => data.data_name === dataName
  )[0];
};

export default DataSlice.reducer;
