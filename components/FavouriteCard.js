import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import sanityClient from "../sanity";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentFavouriteCardOnPressId,
  selectFavouriteTypeLists,
  selectModalVisible,
  setCurrentFavouriteCardOnPressId,
  setFavouriteTypeLists,
} from "../feature/useStateSlice";
import { TouchableOpacity } from "react-native";
import tw from "twrnc";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { selectOrigin, setDestination, setOrigin } from "../feature/navSlice";

const FavouriteCard = (props) => {
  const favouriteCardType = props.type;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const modalVisible = useSelector(selectModalVisible);
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);
  const [
    favouriteCardOnPressStatusWithId,
    setFavouriteCardOnPressStatusWithId,
  ] = useState({});
  const [favouriteCardOnPressLocation, setFavouriteCardOnPressLocation] =
    useState([]);
  const fetchLocationWithId = (id) => {
    sanityClient
      .fetch(
        `*[_type == 'favouriteLocation' 
          && references('${id}')]{_id,address,lat,lng}`
      )
      .then((data) => {
        setFavouriteCardOnPressLocation((prevState) => ({
          ...prevState,
          [id]: data || {},
        }));
      });
  };
  const setFavouriteCardOnPressStatusWithIdFunction = (id) => {
    setFavouriteCardOnPressStatusWithId((prevState) => ({
      ...prevState,
      [id]: !prevState[id] || false,
    }));
  };
  const favouriteCardOnPress = (props) => {
    const id = props._id;
    dispatch(setCurrentFavouriteCardOnPressId(id));
    setFavouriteCardOnPressStatusWithIdFunction(id);
    fetchLocationWithId(id);
  };
  const refreshFavouriteCard = () => {
    for (const type of favouriteTypeLists) {
      setFavouriteCardOnPressStatusWithId((prevState) => ({
        ...prevState,
        [type._id]: false,
      }));
      fetchLocationWithId(type._id);
    }
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

  useEffect(() => {
    if (!favouriteTypeLists) {
      return;
    }
    refreshFavouriteCard();
  }, [modalVisible]);

  return (
    <View style={tw`flex-1 mt-5`}>
      <ScrollView>
        {favouriteTypeLists &&
          favouriteTypeLists.map((type, index) => (
            <View key={type._id} style={tw`mr-5`}>
              {/* Main FavouriteType  Menu*/}
              <TouchableOpacity
                onPress={() => favouriteCardOnPress(type)}
                style={tw`flex-row items-center py-2 px-3${
                  index != favouriteTypeLists.length - 1
                    ? `border-b border-gray-200`
                    : ``
                }`}>
                {/* FavouriteType Icons */}
                <View
                  style={tw`p-2 rounded-full mr-10 ${
                    favouriteCardOnPressStatusWithId[type._id]
                      ? `bg-gray-500`
                      : `bg-gray-300`
                  }`}>
                  <DynamicHeroIcons
                    type="solid"
                    icon={type.heroiconsName}
                    color="white"
                    size={20}
                  />
                </View>
                {/* FavouriteType Names */}
                <View style={tw`flex-1`}>
                  <Text
                    style={tw`text-lg
                  ${
                    favouriteCardOnPressStatusWithId[type._id]
                      ? `text-gray-600`
                      : `text-gray-500`
                  }`}>
                    {type.favouriteTypesName}
                  </Text>
                </View>
                {/* ChevronIcon */}
                <View>
                  <DynamicHeroIcons
                    type="outlined"
                    icon={
                      favouriteCardOnPressStatusWithId[type._id]
                        ? `ChevronUpIcon`
                        : `ChevronDownIcon`
                    }
                    size={22}
                    color="gray"
                  />
                </View>
              </TouchableOpacity>
              {/* Location of FavouriteType Menu */}
              <View>
                {favouriteCardOnPressStatusWithId[type._id] &&
                  favouriteCardOnPressLocation[type._id] && (
                    <View style={tw`bg-gray-50`}>
                      {favouriteCardOnPressLocation[type._id].map(
                        (location, index) => (
                          <TouchableOpacity
                            key={location._id}
                            onPress={() => {
                              if (favouriteCardType == "origin") {
                                dispatch(
                                  setOrigin({
                                    location: {
                                      lat: location.lat,
                                      lng: location.lng,
                                    },
                                    description: location.address,
                                  })
                                );
                              } else if (favouriteCardType == "destination") {
                                dispatch(
                                  setDestination({
                                    location: {
                                      lat: location.lat,
                                      lng: location.lng,
                                    },
                                    description: location.address,
                                  })
                                );
                              }
                              refreshFavouriteCard();
                              navigation.navigate("Map");
                            }}
                            style={tw`flex-row items-center mx-3 ${
                              index != 0 &&
                              index !=
                                favouriteCardOnPressLocation[type._id].length -
                                  1
                                ? `border-b border-gray-100`
                                : ``
                            }`}>
                            {/* location Icon */}
                            <View style={tw`mr-3`}>
                              <DynamicHeroIcons
                                type="outlined"
                                icon="MapPinIcon"
                                size={22}
                                color="#9ca3af"
                              />
                            </View>
                            {/* location Text */}
                            <View style={tw`flex-1 py-3`}>
                              <Text style={tw`text-gray-500 text-[15px]`}>
                                {location.address}
                              </Text>
                            </View>
                            {/* Minus Icons */}
                            <TouchableOpacity style={tw`ml-5`}>
                              <DynamicHeroIcons
                                type="outlined"
                                icon="EllipsisVerticalIcon"
                                size={22}
                                color="#9ca3af"
                              />
                            </TouchableOpacity>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  )}
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

export default FavouriteCard;
