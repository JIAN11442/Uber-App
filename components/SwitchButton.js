import { TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import tw from "twrnc";
const SwitchButton = (props) => {
  // tw.style(`relative rounded-full border justify-center px-1 cursor-pointer
  // w-[${props.width ? props.width : 8}]
  // h-[${props.height ? props.height : 5}]
  // ${props.styles}
  // ${props.borderColor ? props.borderColor : `border-gray-300`}`)

  return (
    <View>
      {/* Border */}
      <View style={{ cursor: "pointer" }}>
        <View
          style={tw`w-[${props.height - 1}] 
          h-[${props.height - 1}] 
          rounded-full bg-red-300`}
        ></View>
      </View>
      {/* Animation Status Cirle*/}
    </View>
  );
};

export default SwitchButton;
