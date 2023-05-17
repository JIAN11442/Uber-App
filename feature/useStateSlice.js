import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAddFavourites: false,
  componentWidth: 0,
  componentHeight: 0,
  deviceWidth: 0,
  deviceHeight: 0,
  tabBarHeight: 0,
  favouritesTypeList: null,
  getWhereFromInputText: null,
  favouriteLocationList: null,
  currentLocationIsAddToSanity: null,
  starIconFillStyle: null,
  modalVisible: false,
  warningPopUpVisibleForNull: false,
  warningPopUpVisibleForDeleteFavourite: false,
};

export const useStateSlice = createSlice({
  name: "useState",
  initialState,
  reducers: {
    setIsAddFavourites: (state, action) => {
      state.isAddFavourites = action.payload;
    },

    setComponentWidth: (state, action) => {
      state.componentWidth = action.payload;
    },
    setComponentHeight: (state, action) => {
      state.componentHeight = action.payload;
    },
    setDeviceWidth: (state, action) => {
      state.deviceWidth = action.payload;
    },
    setDeviceHeight: (state, action) => {
      state.deviceHeight = action.payload;
    },
    setTabBarHeight: (state, action) => {
      state.tabBarHeight = action.payload;
    },
    setFavouriteTypeLists: (state, action) => {
      state.favouritesTypeList = action.payload;
    },
    setGetWhereFromInputText: (state, action) => {
      state.getWhereFromInputText = action.payload;
    },
    setFavouriteLocationList: (state, action) => {
      state.favouriteLocationList = action.payload;
    },
    setCurrentLocationIsAddToSanity: (state, action) => {
      state.currentLocationIsAddToSanity = action.payload;
    },
    setStarIconFillStyle: (state, action) => {
      state.starIconFillStyle = action.payload;
    },
    setModalVisible: (state, action) => {
      state.modalVisible = action.payload;
    },
    setWarningPopUpVisibleForNull: (state, action) => {
      state.warningPopUpVisibleForNull = action.payload;
    },
    setWarningPopUpVisibleForDeleteFavourite: (state, action) => {
      state.warningPopUpVisibleForDeleteFavourite = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsAddFavourites,
  setComponentWidth,
  setComponentHeight,
  setDeviceWidth,
  setDeviceHeight,
  setTabBarHeight,
  setFavouriteTypeLists,
  setGetWhereFromInputText,
  setFavouriteLocationList,
  setCurrentLocationIsAddToSanity,
  setStarIconFillStyle,
  setModalVisible,
  setWarningPopUpVisibleForNull,
  setWarningPopUpVisibleForDeleteFavourite,
} = useStateSlice.actions;

export const selectIsAddFavourites = (state) => state.useState.isAddFavourites;
export const selectComponentWidth = (state) => state.useState.componentWidth;
export const selectComponentHeight = (state) => state.useState.componentHeight;
export const selectDeviceWidth = (state) => state.useState.deviceWidth;
export const selectDeviceHeight = (state) => state.useState.deviceHeight;
export const selectTabBarHeight = (state) => state.useState.tabBarHeight;
export const selectFavouriteTypeLists = (state) =>
  state.useState.favouritesTypeList;
export const selectGetWhereFromInputText = (state) =>
  state.useState.getWhereFromInputText;
export const selectFavouriteLocationList = (state) =>
  state.useState.favouriteLocationList;
export const selectCurrentLoactionIsAddToSanity = (state) =>
  state.useState.currentLocationIsAddToSanity;
export const selectStarIconFillStyle = (state) =>
  state.useState.starIconFillStyle;
export const selectModalVisible = (state) => state.useState.modalVisible;
export const selectWarningPopUpVisibleForNull = (state) =>
  state.useState.warningPopUpVisibleForNull;
export const selectWarningPopUpVisibleForDeleteFavourite = (state) =>
  state.useState.warningPopUpVisibleForDeleteFavourite;

export default useStateSlice.reducer;
