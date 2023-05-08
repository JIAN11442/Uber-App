import * as SolidIcons from "react-native-heroicons/solid";
import * as OutlinedIcons from "react-native-heroicons/outline";

const { ...solidIcons } = SolidIcons;
const { ...outlinedIcons } = OutlinedIcons;

const DynamicHeroIcons = (props) => {
  let TheIcon;
  if (props.type == "solid") {
    TheIcon = solidIcons[props.icon];
  } else if (props.type == "outlined") {
    TheIcon = outlinedIcons[props.icon];
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
