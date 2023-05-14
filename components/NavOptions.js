import { Image } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { urlFor } from "../sanity";
import { ArrowRightCircleIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectOrigin } from "../feature/navSlice";
import { selectGetWhereFromInputText } from "../feature/useStateSlice";

const NavOptions = ({ data }) => {
  const navigation = useNavigation();
  const origin = useSelector(selectOrigin);

  return (
    <View style={tw`flex-row`}>
      {data?.map((dt) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(`${dt.screen[0].name}`)}
          key={dt._id}
          style={tw`p-2 pl-6 pb-4 pt-4 bg-gray-200 m-2 w-40 rounded-lg`}
          disabled={!origin}>
          <View style={tw`${origin == null ? `opacity-50` : ``}`}>
            <Image
              style={{ width: 120, height: 120, resizeMode: "contain" }}
              source={{
                uri: urlFor(dt.image).url(),
              }}
            />
            <Text style={tw`mt-2 text-lg font-semibold`}>{dt.name}</Text>
            <ArrowRightCircleIcon size={45} color="black" style={tw`mt-4`} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NavOptions;
