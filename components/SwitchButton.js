import { TouchableWithoutFeedback, View, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import {
  selectFavouriteTypeLists,
  setFavouriteTypeLists,
} from "../feature/useStateSlice";
import { useState } from "react";
// import * as Animatable from "react-native-animatable";

const SwitchButton = (props) => {
  const dispatch = useDispatch();
  // const positionX = parseInt(props.width) + 8;
  const favouriteTypeList = useSelector(selectFavouriteTypeLists);

  const positionX = parseInt(props.width) + 8;

  const RemoveFavouriteType = () => {
    const targetRemoveId = props.item._id;
    const targetIndex = favouriteTypeList.findIndex(
      (favouriteType) => favouriteType._id === targetRemoveId
    );
    const updatedFavouriteTypeList = [...favouriteTypeList];
    updatedFavouriteTypeList[targetIndex].status =
      !updatedFavouriteTypeList[targetIndex].status;

    dispatch(setFavouriteTypeLists(updatedFavouriteTypeList));
  };

  return (
    <TouchableWithoutFeedback onPress={RemoveFavouriteType}>
      <Animated.View
        style={tw`rounded-full border justify-center px-1 border-0
        w-[${props.width ? props.width : 8}]
        h-[${props.height ? props.height : 5}]
        ${props.styles}
        ${props.item.status ? `bg-green-500` : `bg-red-500`}`}
      >
        {/* Border */}
        <View>
          <View
            style={[
              tw`bg-white rounded-full 
            w-[${props.height - 1}] 
            h-[${props.height - 1}]`,
              {
                transform: [{ translateX: props.item.status ? positionX : 0 }],
              },
            ]}
          ></View>
        </View>
        {/* Animation Status Cirle*/}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default SwitchButton;
