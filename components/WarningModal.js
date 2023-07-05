import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentOnPressLocationInfo,
  setIsCancelDeleteFavouriteLocationCard,
  setIsDeleteFavouriteLocationCard,
  setStarIconFillStyle,
  setWarningPopUpVisibleForDeleteFavourite,
  setWarningPopUpVisibleForNull,
} from "../feature/useStateSlice";
import sanityClient from "../sanity";

const WarningModal = ({ type, currentOnPressLocation }) => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (type == "null") {
      Alert.alert(
        "Warning",
        "Have not any origin, can't add to Favourite List"
      );
    } else if (type == "Incompleted") {
      Alert.alert("Warning", "Your origin is available place");
    } else if (type == "removeFavourite") {
      Alert.alert("Warning", "Sure to remove from favourite list?", [
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
            // removeFavouriteLocation();
            dispatch(setIsDeleteFavouriteLocationCard(true));
            dispatch(setStarIconFillStyle("transparent"));
            dispatch(setWarningPopUpVisibleForDeleteFavourite(false));

            // console.log("Already Remove From Favourite");
          },
        },
      ]);
    }
    dispatch(setWarningPopUpVisibleForNull(false));
  }, [currentOnPressLocation]);
  return null;
};

export default WarningModal;
