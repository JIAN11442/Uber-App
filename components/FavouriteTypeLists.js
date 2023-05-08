import { Modal, Touchable, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import {
  selectComponentHeight,
  selectFavouriteTypeLists,
  selectTabBarHeight,
  setFavouriteTypeLists,
} from "../feature/useStateSlice";
import sanityClient from "../sanity";
import { useEffect } from "react";
import DynamicHeroIcons from "../DynamicHeroIcons";

const FavouriteTypeLists = () => {
  const dispatch = useDispatch();
  const maxModalHeight = useSelector(selectComponentHeight);
  const tabBarHeight = useSelector(selectTabBarHeight);
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == 'favouriteTypes']{
      ...,
    }`
      )
      .then((data) => {
        dispatch(setFavouriteTypeLists(data));
      });
  }, [favouriteTypeLists]);
  return (
    <View>
      <View style={tw`pt-1 pb-2 bg-white`}>
        <Text style={tw`text-center text-base font-semibold`}>
          Choose your favourite lists
        </Text>
      </View>
      <View style={tw`h-[${maxModalHeight - tabBarHeight}px]`}>
        <ScrollView>
          {favouriteTypeLists &&
            favouriteTypeLists.map((item, index) => (
              <TouchableOpacity key={item._id}>
                <View
                  style={tw`flex-row py-2 items-center bg-white 
                ${
                  index == 0 ? `border-t border-b` : `border-b`
                } border-gray-100`}
                >
                  <View style={tw`mx-4`}>
                    <DynamicHeroIcons
                      type="solid"
                      icon={item.heroiconsName}
                      size={25}
                      color="gray"
                    />
                  </View>
                  <View>
                    <Text style={tw`text-base text-gray-500`}>
                      {item.favouriteTypesName}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default FavouriteTypeLists;
