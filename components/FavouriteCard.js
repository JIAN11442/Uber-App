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
import * as Animatable from "react-native-animatable";

const FavouriteCard = () => {
  const dispatch = useDispatch();
  const isAddFavourite = useSelector(selectIsAddFavourites);
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);
  const onPressStatus = useSelector(selectFavouriteTypeCardOnPress);
  const currentOnPressFavouriteTypeKey = useSelector(
    selectCurrentOnPressFavouriteTypeKey
  );

  const FavouritesCardOnPress = (props) => {
    dispatch(setCurrentOnPressFavouriteTypeKey(props._id));
    dispatch(setFavouriteTypeCardOnPress(!onPressStatus));
  };

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

  {
  }
  return (
    <View style={tw`flex-1 mt-10`}>
      <ScrollView>
        {favouriteTypeLists &&
          favouriteTypeLists.map((type, index) => (
            <View key={type._id}>
              <View
                style={tw`py-2 ${
                  index != favouriteTypeLists.length - 1
                    ? `border-b border-gray-100`
                    : ``
                }`}>
                <TouchableOpacity
                  key={type._id}
                  style={tw`flex-row items-center`}
                  onPress={() => FavouritesCardOnPress(type)}>
                  {/* FavouriteType Icon */}
                  <View
                    style={tw`p-2 ${
                      onPressStatus &&
                      currentOnPressFavouriteTypeKey == type._id
                        ? `bg-gray-500`
                        : `bg-gray-300`
                    } rounded-full mr-10 ml-3`}>
                    <DynamicHeroIcons
                      type="solid"
                      icon={type.heroiconsName}
                      color="white"
                      size={18}
                    />
                  </View>
                  {/* FavouriteType Name */}
                  <View style={tw`flex-1`}>
                    <Text
                      style={tw`text-lg ${
                        onPressStatus &&
                        currentOnPressFavouriteTypeKey == type._id
                          ? `font-semibold text-gray-600`
                          : `text-gray-600`
                      }`}>
                      {type.favouriteTypesName}
                    </Text>
                  </View>
                  {/* ChevronDownIcon & ChevronUpIcon */}
                  <View style={tw`mr-8`}>
                    <DynamicHeroIcons
                      type="outlined"
                      icon={
                        onPressStatus &&
                        currentOnPressFavouriteTypeKey == type._id
                          ? "ChevronUpIcon"
                          : "ChevronDownIcon"
                      }
                      size={20}
                      color="gray"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {onPressStatus && currentOnPressFavouriteTypeKey == type._id && (
                <Animatable.View
                  key={type._id}
                  style={tw`py-3 bg-gray-100 mr-5 h-50`}
                  animation={"fadeIn"}
                  duration={500}>
                  <ScrollView></ScrollView>
                </Animatable.View>
              )}
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

export default FavouriteCard;
