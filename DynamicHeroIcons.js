import * as SolidIcons from "react-native-heroicons/solid";
import * as OutlinedIcons from "react-native-heroicons/outline";

const DynamicHeroIcons = (props) => {
  let TheIcon;
  if (props.type == "solid") {
    TheIcon = SolidIcons[props.icon];
  } else if (props.type == "outlined") {
    TheIcon = OutlinedIcons[props.icon];
  }

  return (
    <TheIcon
      size={props.size ? props.size : undefined}
      color={props.color}
      style={props.style}
    />
  );
};

export default DynamicHeroIcons;
