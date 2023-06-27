import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import * as solidIcons from "react-native-heroicons/solid";
import * as outlinedIcons from "react-native-heroicons/outline";
import tw from "twrnc";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { useDispatch } from "react-redux";
import {
  setIconInputTextIsFocus,
  setIconsModalVisible,
  setIsChosenIcon,
  setIsChosenIconName,
} from "../feature/useStateSlice";

const IconsOptionalModal = (props) => {
  let Icons;
  if (props.type === "solid") {
    Icons = solidIcons;
  } else if (props.type === "outlined") {
    Icons = outlinedIcons;
  }

  const dispatch = useDispatch();

  return (
    <ScrollView style={tw`px-1 mt-3 mb-28`}>
      <View style={tw`flex-row flex-wrap`}>
        {props.target === undefined ? (
          Object.entries(Icons).map(([iconName, iconFunction], index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                dispatch(setIconsModalVisible(false));
                dispatch(setIsChosenIcon(true));
                dispatch(setIconInputTextIsFocus(false));
                dispatch(setIsChosenIconName(iconName));
              }}
              style={tw`p-1`}
            >
              <DynamicHeroIcons
                type={props.type}
                icon={iconName}
                size={props.size ? props.size : 10}
                color={props.color}
                style={props.style}
              />
            </TouchableOpacity>
          ))
        ) : (
          <TouchableOpacity
            onPress={() => {
              dispatch(setIconsModalVisible(false));
              dispatch(setIsChosenIcon(true));
              dispatch(setIconInputTextIsFocus(false));
              dispatch(setIsChosenIconName(iconName));
            }}
            style={tw`p-1`}
          >
            <DynamicHeroIcons
              type={props.type}
              icon={props.target}
              size={props.size ? props.size : 10}
              color={props.color}
              style={props.style}
            />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export const Icons = solidIcons;
export default IconsOptionalModal;
