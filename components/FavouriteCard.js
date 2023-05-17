import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import sanityClient from "../sanity";
import { useDispatch, useSelector } from "react-redux";
import {
  selectClearFavouriteTypeCardOnPressStatus,
  selectCurrentOnPressFavouriteTypeKey,
  selectCurrentOnPressStatus,
  selectFavouriteTypeCardOnPressStatus,
  selectFavouriteTypeLists,
  setClearFavouriteTypeCardOnPressStatus,
  setCurrentOnPressFavouriteTypeKey,
  setCurrentOnPressStatus,
  setFavouriteTypeCardOnPressStatus,
  setFavouriteTypeLists,
} from "../feature/useStateSlice";
import { TouchableOpacity } from "react-native";
import tw from "twrnc";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import { Touchable } from "react-native";

const FavouriteCard = () => {
  const dispatch = useDispatch();
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);
  const favouriteCardOnPress = (props) => {
    const id = props._id;
    const currentIdOnPressStatus = (prevState) => ({
      ...prevState,
      [id]: !prevState[id] || false,
    });
    console.log(currentIdOnPressStatus());
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

  // if (favouriteTypeLists) {
  //   console.log(favouriteTypeLists);
  // }

  return (
    <View style={tw`flex-1 mt-10`}>
      <ScrollView>
        {favouriteTypeLists &&
          favouriteTypeLists.map((type, index) => (
            <TouchableOpacity
              key={type._id}
              onPress={() => favouriteCardOnPress(type)}
              style={tw`flex-row items-center p-2 ${
                index != favouriteTypeLists.length - 1
                  ? `border-b border-gray-100`
                  : ``
              }`}>
              {/* FavouriteType Icons */}
              <View style={tw`p-2 bg-gray-300 rounded-full mr-10`}>
                <DynamicHeroIcons
                  type="solid"
                  icon={type.heroiconsName}
                  color="white"
                  size={20}
                />
              </View>
              {/* FavouriteType Names */}
              <View>
                <Text style={tw`text-gray-500 text-lg`}>
                  {type.favouriteTypesName}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default FavouriteCard;
