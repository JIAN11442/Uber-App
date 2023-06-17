import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import * as solidIcons from "react-native-heroicons/solid";
import * as outlinedIcons from "react-native-heroicons/outline";
import tw from "twrnc";
import DynamicHeroIcons from "../DynamicHeroIcons";

const IconsOptionalModal = (props) => {
  let Icons;
  if (props.type === "solid") {
    Icons = solidIcons;
  } else if (props.type === "outlined") {
    Icons = outlinedIcons;
  }

  return (
    <ScrollView>
      {Object.entries(Icons).map(([iconName, iconFunction], index) => (
        <TouchableOpacity key={index} style={tw``}>
          <DynamicHeroIcons
            type={props.type}
            icon={iconName}
            size={props.size ? props.size : 10}
            color={props.color}
            style={props.style}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default IconsOptionalModal;
