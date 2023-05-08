import { View, Text } from "react-native";
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";
import * as Animatable from "react-native-animatable";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import styles from "../style";
import {
  selectComponentHeight,
  selectComponentWidth,
  selectDeviceHeight,
  selectDeviceWidth,
  setComponentHeight,
  setComponentWidth,
  setDeviceHeight,
  setDeviceWidth,
} from "../feature/useStateSlice";
import { useEffect } from "react";
import { Dimensions } from "react-native";

const FavouriteListModal = () => {
  const dispatch = useDispatch();
  const deviceWidth = useSelector(selectDeviceWidth);
  const deviceHeight = useSelector(selectDeviceHeight);
  const componentWidth = useSelector(selectComponentWidth);
  const componentHeight = useSelector(selectComponentHeight);
  const deviceWidthCenterPoint = deviceWidth / 2;
  const deviceHeightCenterPoint = deviceHeight / 2;
  const componentWidthCenterPoint = componentWidth / 2;
  const componentHeightCenterPoint = componentHeight / 2;

  useEffect(() => {
    const { width, height } = Dimensions.get("window");
    dispatch(setDeviceWidth(width));
    dispatch(setDeviceHeight(height));
  }, []);

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    dispatch(setComponentWidth(width));
    dispatch(setComponentHeight(height));
  };

  return (
    <Animatable.View
      onLayout={onLayout}
      style={tw`absolute w-80 h-80 bg-white rounded-lg shadow-lg 
      top-[${deviceHeightCenterPoint - componentHeightCenterPoint}px]
      left-[${deviceWidthCenterPoint - componentWidthCenterPoint}px]
      `}
    >
      <View>
        <Text>FavouriteListModal</Text>
      </View>
    </Animatable.View>
  );
};

export default FavouriteListModal;
