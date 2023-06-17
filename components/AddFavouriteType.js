import { Text, View } from "react-native";
import tw from "twrnc";
import IconsOptionalModal from "./IconsOptionalModal";

const AddFavouriteType = () => {
  return (
    <View>
      <View style={tw`pt-1 pb-2 bg-white`}>
        <Text style={tw`text-center text-base font-semibold`}>
          Create New Favourite Type
        </Text>
      </View>
      <IconsOptionalModal type="solid" color="black" size={20} />
    </View>
  );
};

export default AddFavouriteType;
