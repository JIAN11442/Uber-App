import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAllLocation,
  selectCurrentOnPressOptionalFavouriteType,
  selectFavouriteTypeLists,
  selectGetAllLocation,
  setFavouriteTypeLists,
  setGetAllLocation,
  setIsCancelDeleteFavouriteLocationCard,
  setIsDeleteFavouriteLocationCard,
  setStarIconFillStyle,
  setWarningPopUpVisibleForDeleteFavourite,
  setWarningPopUpVisibleForDeleteFavouriteType,
  setWarningPopUpVisibleForNull,
} from "../feature/useStateSlice";
import sanityClient from "../sanity";

const WarningModal = ({ type, currentOnPressLocation }) => {
  console.log(currentOnPressLocation);
  console.log(`--------------------`);

  const dispatch = useDispatch();
  const favouriteTypeList = useSelector(selectFavouriteTypeLists);
  const allLocationList = useSelector(selectGetAllLocation);
  const currentOnPressFavouriteTypeInfo = useSelector(
    selectCurrentOnPressOptionalFavouriteType
  );
  const removeFavouriteLocation = () => {
    const currentLocation = currentOnPressLocation.description;

    sanityClient.fetch(`*[_type == 'favouriteLocation']{...,}`).then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].address == currentLocation) {
          sanityClient.delete(`${data[i]._id}`).then(() => {
            console.log(`already delete favourite location`);
            // console.log(`id : ${data[i]._id}`);
            // console.log(`location : ${data[i].address}`);
          });
        }
      }
    });
  };
  const removeFavouriteType = () => {
    const targetId = currentOnPressFavouriteTypeInfo._id;
    const targetFavouriteLocationIndex = allLocationList.findIndex(
      (location) => location[currentOnPressFavouriteTypeInfo._id]
    );

    // Remove Related Location In Sanity
    allLocationList[targetFavouriteLocationIndex][targetId].map((location) =>
      sanityClient.delete(location._id)
    );
    // Remove Target FavouriteType In Sanity
    sanityClient.delete(currentOnPressFavouriteTypeInfo._id);

    // Remove Related Location In Redux
    const updatedFavouriteTypeLocation = [...allLocationList];
    dispatch(clearAllLocation());
    updatedFavouriteTypeLocation[targetFavouriteLocationIndex][targetId] = [];
    // dispatch(setGetAllLocation(updatedFavouriteTypeLocation));
    // Remove Target FavouriteType In Redux
    targetFavouriteTypeIndex = favouriteTypeList.findIndex(
      (favouriteType) => favouriteType === currentOnPressFavouriteTypeInfo
    );
    const updatedFavouriteTypeList = [...favouriteTypeList];
    updatedFavouriteTypeList.splice(targetFavouriteTypeIndex, 1);
    dispatch(setFavouriteTypeLists(updatedFavouriteTypeList));
  };

  useEffect(() => {
    if (type == "null") {
      Alert.alert(
        "Warning",
        "Have not any origin, can't add to Favourite List"
      );
    } else if (type == "Incompleted") {
      Alert.alert("Warning", "Your origin is available place");
    } else if (type == "removeFavouriteLocation") {
      Alert.alert("Warning", "Sure to remove location from favourite list?", [
        {
          text: "Cancel",
          onPress: () => {
            dispatch(setIsCancelDeleteFavouriteLocationCard(true));
            // console.log("Cancel Remove From Favourite");
            dispatch(setWarningPopUpVisibleForDeleteFavourite(false));
          },
          style: "cancel",
        },
        {
          text: "Sure",
          onPress: () => {
            removeFavouriteLocation();
            dispatch(setIsDeleteFavouriteLocationCard(true));
            dispatch(setStarIconFillStyle("transparent"));
            dispatch(setWarningPopUpVisibleForDeleteFavourite(false));

            // console.log("Already Remove From Favourite");
          },
        },
      ]);
    } else if (type == "removeFavouriteType") {
      Alert.alert(
        "Warning",
        "Sure to remove that FavouriteType and related Location?",
        [
          {
            text: "Cancel",
            onPress: () => {
              dispatch(setIsCancelDeleteFavouriteLocationCard(true));
              // console.log("Cancel Remove From Favourite");
              dispatch(setWarningPopUpVisibleForDeleteFavouriteType(false));
            },
            style: "cancel",
          },
          {
            text: "Sure",
            onPress: () => {
              removeFavouriteType();
              dispatch(setWarningPopUpVisibleForDeleteFavouriteType(false));

              // console.log("Already Remove From Favourite");
            },
          },
        ]
      );
    }
    dispatch(setWarningPopUpVisibleForNull(false));
  }, [currentOnPressLocation]);
  return null;
};

export default WarningModal;
