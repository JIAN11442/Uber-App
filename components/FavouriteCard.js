import { View, Text } from "react-native";
import React from "react";
import { useEffect } from "react";
import sanityClient from "../sanity";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentOnPressFavouriteTypeKey,
  selectFavouriteTypeCardOnPress,
  selectFavouriteTypeLists,
  selectIsAddFavourites,
  setCurrentOnPressFavouriteTypeKey,
  setFavouriteTypeCardOnPress,
  setFavouriteTypeLists,
} from "../feature/useStateSlice";
import { TouchableOpacity } from "react-native";
import tw from "twrnc";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { ScrollView } from "react-native";

const FavouriteCard = () => {
  const dispatch = useDispatch();
  const isAddFavourite = useSelector(selectIsAddFavourites);
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);
  const onPressStatus = useSelector(selectFavouriteTypeCardOnPress);
  // const onPressFavouriteCardKey = useSelector(
  //   selectCurrentOnPressFavouriteTypeKey
  // );
  const favouriteTypeCardOnPress = (key) => {
    // dispatch(setCurrentOnPressFavouriteTypeKey(key));
    dispatch(setFavouriteTypeCardOnPress(!onPressStatus));
    // console.log(onPressStatus);
  };

  // console.log(onPressFavouriteCardKey);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == 'favouriteTypes']{
      ...,}[favouriteTypesName == 'Home'] + 
      *[_type == 'favouriteTypes']{
      ...,}[favouriteTypesName == 'Work'] +
      *[_type == 'favouriteTypes']{
      ...,}[favouriteTypesName != 'Home' && favouriteTypesName != 'Work']
    `
      )
      .then((data) => {
        dispatch(setFavouriteTypeLists(data));
      });
  }, []);

  return (
    <View style={tw`flex-1 mt-10`}>
      <ScrollView>
        {favouriteTypeLists &&
          favouriteTypeLists.map((type, index) => (
            <View
              style={tw`py-2 ${
                index != favouriteTypeLists.length - 1
                  ? `border-b border-gray-100`
                  : ``
              } `}
            >
              <TouchableOpacity
                key={type._id}
                style={tw`flex-row items-center`}
                onPress={favouriteTypeCardOnPress(type._id)}
              >
                {/* FavouriteType Icon */}
                <View style={tw`p-2 bg-gray-300 rounded-full mr-10 ml-3`}>
                  <DynamicHeroIcons
                    type="solid"
                    icon={type.heroiconsName}
                    color="white"
                    size={20}
                  />
                </View>
                {/* FavouriteType Name */}
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg text-gray-600`}>
                    {type.favouriteTypesName}
                  </Text>
                </View>
                <View style={tw`mr-8`}>
                  <DynamicHeroIcons
                    type="outlined"
                    icon={onPressStatus ? "ChevronDownIcon" : "ChevronUpIcon"}
                    size={20}
                    color="gray"
                  />
                </View>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

export default FavouriteCard;
