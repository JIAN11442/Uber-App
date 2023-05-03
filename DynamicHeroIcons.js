import { StyleSheet } from "react-native";
import * as HIcons from "react-native-heroicons/solid";
import tw from "twrnc";

const { ...icons } = HIcons;

const DynamicHeroIcons = (props) => {
  const TheIcon = icons[props.icon];

  return (
    <TheIcon
      style={props.style}
      color={props.color}
      size={props.size ? props.size : undefined}
    />
  );
};

export default DynamicHeroIcons;
