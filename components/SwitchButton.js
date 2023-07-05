import { TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import {
  selectFavouriteTypeLists,
  setFavouriteTypeLists,
} from "../feature/useStateSlice";

const SwitchButton = (props) => {
  const dispatch = useDispatch();
  const favouriteTypeList = useSelector(selectFavouriteTypeLists);
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
      <View
        style={tw`relative rounded-full border justify-center px-1 border-0
        w-[${props.width ? props.width : 8}]
        h-[${props.height ? props.height : 5}]
        ${props.styles}
        ${props.item.status ? `bg-green-500` : `bg-red-500`}`}
      >
        {/* Border */}
        <View>
          <View
            style={tw`w-[${props.height - 1}] 
          h-[${props.height - 1}] 
          rounded-full bg-white`}
          ></View>
        </View>
        {/* Animation Status Cirle*/}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SwitchButton;
