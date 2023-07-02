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
  favouriteLocationList: [],
  currentLocationIsAddToSanity: null,
  starIconFillStyle: null,
  modalVisible: false,
  warningPopUpVisibleForNull: false,
  warningPopUpVisibleForDeleteFavourite: false,
  currentFavouriteCardOnPressId: null,
  isDeleteFavouriteLocationCard: false,
  isCancelDeleteFavouriteLocationCard: false,
  isCreateNewLocation: false,
  currentOnPressLocationInfo: [],
  createNewLocationInfo: [],
  allLocation: [],
  iconsModalVisible: false,
  isChosenIcon: false,
  isChosenIconName: "",
  iconInputTextIsFocus: false,
  currentOnPressFavouriteType: [],
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
      state.favouriteLocationList = [
        ...state.favouriteLocationList,
        action.payload,
      ];
      if (
        state.favouriteLocationList.length > state.favouritesTypeList.length
      ) {
        state.favouriteLocationList = [];
        state.favouriteLocationList = [
          ...state.favouriteLocationList,
          action.payload,
        ];
      }
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
    setCurrentFavouriteCardOnPressId: (state, action) => {
      state.currentFavouriteCardOnPressId = action.payload;
    },
    setIsDeleteFavouriteLocationCard: (state, action) => {
      state.isDeleteFavouriteLocationCard = action.payload;
    },
    setIsCancelDeleteFavouriteLocationCard: (state, action) => {
      state.isCancelDeleteFavouriteLocationCard = action.payload;
    },
    setIsCreateNewLocation: (state, action) => {
      state.isCreateNewLocation = action.payload;
    },
    setCurrentOnPressLocationInfo: (state, action) => {
      state.currentOnPressLocationInfo = action.payload;
    },
    setCreateNewLocationInfo: (state, action) => {
      state.createNewLocationInfo = action.payload;
    },
    setGetAllLocation: (state, action) => {
      state.allLocation = [...state.allLocation, action.payload];
    },
    deleteLocationFromList: (state, action) => {
      const favouriteCardOnPressLocationWithId =
        action.payload.favouriteCardOnPressLocationWithId;

      const currentOnPressLocationInfo =
        action.payload.currentOnPressLocationInfo;

      const currentFavouriteCardOnPressId =
        currentOnPressLocationInfo.favouriteTypeId;

      const removeIndex = favouriteCardOnPressLocationWithId[
        currentFavouriteCardOnPressId
      ].findIndex(
        (locationObj) => locationObj._id === currentOnPressLocationInfo.id
      );

      let newLocationList = [...state.allLocation];

      if (removeIndex !== -1) {
        const updatedLocationList = newLocationList.map((locationObj) => {
          if (locationObj[currentFavouriteCardOnPressId]) {
            const updatedLocationObj = { ...locationObj };
            updatedLocationObj[currentFavouriteCardOnPressId] =
              updatedLocationObj[currentFavouriteCardOnPressId].filter(
                (_, index) => index !== removeIndex
              );
            return updatedLocationObj;
          }
          return locationObj;
        });

        // console.log(`After Delete`);
        // console.log(updatedLocationList);
        // console.log(`------------------`);

        return {
          ...state,
          allLocation: updatedLocationList,
        };
      }
    },
    createNewLocationFromList: (state, action) => {
      const createNewLocationInfo = action.payload.createNewLocationInfo;
      const currentCreateInFavouriteTypeId =
        createNewLocationInfo.favouriteTypeId;

      let newLocationList = [...state.allLocation.splice(0, 3)];

      const updatedLocationList = newLocationList.map((locationObj) => {
        if (locationObj[currentCreateInFavouriteTypeId]) {
          const updatedLocationObj = { ...locationObj };
          updatedLocationObj[currentCreateInFavouriteTypeId] = [
            ...updatedLocationObj[currentCreateInFavouriteTypeId],
            createNewLocationInfo,
          ];
          return updatedLocationObj;
        }
        return locationObj;
      });

      state.allLocation = updatedLocationList;
    },
    setIconsModalVisible: (state, action) => {
      state.iconsModalVisible = action.payload;
    },
    setIsChosenIcon: (state, action) => {
      state.isChosenIcon = action.payload;
    },
    setIsChosenIconName: (state, action) => {
      state.isChosenIconName = action.payload;
    },
    setIconInputTextIsFocus: (state, action) => {
      state.iconInputTextIsFocus = action.payload;
    },
    setCurrentOnPressFavouriteType: (state, action) => {
      state.currentOnPressFavouriteType = action.payload;
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
  setCurrentFavouriteCardOnPressId,
  setIsDeleteFavouriteLocationCard,
  setIsCancelDeleteFavouriteLocationCard,
  setIsCreateNewLocation,
  setCurrentOnPressLocationInfo,
  setCreateNewLocationInfo,
  setGetAllLocation,
  deleteLocationFromList,
  createNewLocationFromList,
  setIconsModalVisible,
  setIsChosenIcon,
  setIsChosenIconName,
  setIconInputTextIsFocus,
  setCurrentOnPressFavouriteType,
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
export const selectCurrentFavouriteCardOnPressId = (state) =>
  state.useState.currentFavouriteCardOnPressId;
export const selectIsDeleteFavouriteLocationCard = (state) =>
  state.useState.isDeleteFavouriteLocationCard;
export const selectIsCancelDeleteFavouriteLocationCard = (state) =>
  state.useState.isCancelDeleteFavouriteLocationCard;
export const selectIsCreateNewLocation = (state) =>
  state.useState.isCreateNewLocation;
export const selectCurrentOnPressLocationInfo = (state) =>
  state.useState.currentOnPressLocationInfo;
export const selectCreateNewLocationInfo = (state) =>
  state.useState.createNewLocationInfo;
export const selectGetAllLocation = (state) => state.useState.allLocation;
export const selectIconsModalVisible = (state) =>
  state.useState.iconsModalVisible;
export const selectIsChosenIcon = (state) => state.useState.isChosenIcon;
export const selectIsChosenIconName = (state) =>
  state.useState.isChosenIconName;
export const selectIconInputTextIsFocus = (state) =>
  state.useState.iconInputTextIsFocus;
export const selectCurrentOnPressFavouriteType = (state) =>
  state.useState.currentOnPressFavouriteType;

export default useStateSlice.reducer;
