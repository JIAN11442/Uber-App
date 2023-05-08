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
  selectTabBarHeight,
  setComponentHeight,
  setComponentWidth,
  setDeviceHeight,
  setDeviceWidth,
  setTabBarHeight,
} from "../feature/useStateSlice";
import { useEffect } from "react";
import { Dimensions } from "react-native";
import FavouriteTypeLists from "./FavouriteTypeLists";
import AddFavouriteType from "./AddFavouriteType";
import { TouchableOpacity } from "react-native";
import DynamicHeroIcons from "../DynamicHeroIcons";

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
  const tabBarHeight = useSelector(selectTabBarHeight);
  const tabArr = [
    {
      name: "favouriteTypeList",
      label: "Lists",
      icon: "ListBulletIcon",
      component: FavouriteTypeLists,
    },
    {
      name: "addFavouriteType",
      label: "Create New List",
      icon: "PencilSquareIcon",
      component: AddFavouriteType,
    },
  ];
  const TabBarButton = (props) => {
    const { item, accessibilityState, onPress, index } = props;
    const focused = accessibilityState.selected;
    const iconType = focused ? "solid" : "outlined";
    const iconColor = focused ? "#00a2ed" : "rgba(128,128,128,0.5)";

    return (
      <View
        style={tw`flex-1 my-2
        ${index != tabArr.length - 1 ? `border-r border-gray-300` : ``}`}
      >
        <TouchableOpacity
          style={tw`items-center justify-center flex-1`}
          onPress={onPress}
        >
          <DynamicHeroIcons
            type={iconType}
            icon={item.icon}
            color={iconColor}
            size={25}
          />
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    const { width, height } = Dimensions.get("window");
    dispatch(setDeviceWidth(width));
    dispatch(setDeviceHeight(height));
    dispatch(setTabBarHeight(50));
  }, []);

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    dispatch(setComponentWidth(width));
    dispatch(setComponentHeight(height));
  };

  const TabBarBottom = createBottomTabNavigator();

  return (
    <Animatable.View
      onLayout={onLayout}
      style={tw`absolute w-70 h-80 bg-white rounded-lg shadow-lg p-2 pb-0
      top-[${deviceHeightCenterPoint - componentHeightCenterPoint}px]
      left-[${deviceWidthCenterPoint - componentWidthCenterPoint}px]
      `}
      animation={"bounceInUp"}
      duration={800}
    >
      <TabBarBottom.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: tabBarHeight,
            shadowColor: "transparent",
          },
          tabBarShowLabel: false,
        }}
      >
        {tabArr.map((item, index) => (
          <TabBarBottom.Screen
            key={index}
            name={item.name}
            component={item.component}
            options={{
              tabBarButton: (props) => (
                <TabBarButton {...props} item={item} index={index} />
              ),
            }}
          />
        ))}
      </TabBarBottom.Navigator>
    </Animatable.View>
  );
};

export default FavouriteListModal;
