import { View, StatusBar, TouchableWithoutFeedback } from "react-native";
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";
import * as Animatable from "react-native-animatable";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  selectComponentHeight,
  selectTabBarHeight,
  setComponentHeight,
  setIsAddFavourites,
  setIsEditFavouriteLocation,
  setIsEditFavouriteLocationInfo,
  setModalVisible,
  setStarIconFillStyle,
  setTabBarHeight,
} from "../feature/useStateSlice";
import { useEffect } from "react";
import FavouriteTypeLists from "./FavouriteTypeLists";
import AddFavouriteType from "./AddFavouriteType";
import { TouchableOpacity } from "react-native";
import DynamicHeroIcons from "../DynamicHeroIcons";
import FavouriteTypeModal from "./FavouriteTypeModal";

const FavouriteListModal = () => {
  const dispatch = useDispatch();
  const tabBarHeight = useSelector(selectTabBarHeight);
  const maxComponentHeight = useSelector(selectComponentHeight);

  const tabArr = [
    {
      name: "favouriteTypeList",
      label: "Lists",
      icon: "HeartIcon",
      component: FavouriteTypeLists,
    },
    {
      name: "addFavouriteType",
      label: "Create New List",
      icon: "PencilSquareIcon",
      component: AddFavouriteType,
    },
    {
      name: "allFavouriteTypeLIst",
      label: "FavouriteType List",
      icon: "ListBulletIcon",
      component: FavouriteTypeModal,
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
        ${index != tabArr.length - 1 ? `border-r border-gray-100` : ``}`}
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
    dispatch(setTabBarHeight(50));
    dispatch(setComponentHeight(344));
  }, []);

  const TabBarBottom = createBottomTabNavigator();
  return (
    <>
      <View
        onStartShouldSetResponder={() => {
          dispatch(setModalVisible(false));
          dispatch(setIsEditFavouriteLocation(false));
          dispatch(setIsEditFavouriteLocationInfo(""));
          dispatch(setIsAddFavourites(false));
          dispatch(setStarIconFillStyle("transparent"));
        }}
        style={tw`absolute w-full h-full top-[${StatusBar.currentHeight}px]
         bg-[#000000a1] items-center justify-center`}
      >
        <TouchableWithoutFeedback>
          <Animatable.View
            style={tw`absolute w-80 h-[${maxComponentHeight}px] bg-white rounded-lg shadow-lg shadow-black p-2 pb-0
      `}
            animation={"bounceInUp"}
            duration={1000}
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
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default FavouriteListModal;
