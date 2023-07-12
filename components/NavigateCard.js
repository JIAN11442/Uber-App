import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import styles from "../style";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEYS } from "@env";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDestination,
  selectOrigin,
  setDestination,
} from "../feature/navSlice";
import FavouriteCard from "./FavouriteCard";
import { Icon } from "react-native-elements/";
import {
  selectNavigateToRideOptionsCard,
  setNavigateToRideOptionsCard,
} from "../feature/useStateSlice";

const NavigateCard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const isNavigateToRideOptionsCard = useSelector(
    selectNavigateToRideOptionsCard
  );
  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Welcome Box */}
      <View style={tw`p-3 bg-white border-b border-gray-200 shadow-sm`}>
        <Text style={tw`text-lg text-center font-bold`}>Welcome, JIAN</Text>
      </View>
      {/* Search AutoCompleted */}
      <View>
        <GooglePlacesAutocomplete
          styles={styles.AutoCompletedStyleForTo}
          placeholder="Where to?"
          minLength={2}
          debounce={400}
          nearbyPlacesAPI="GooglePlacesSearch"
          query={{
            key: GOOGLE_MAPS_APIKEYS,
            language: "en",
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
          onPress={(data, details = null) => {
            dispatch(
              setDestination({
                location: details.geometry.location,
                description: data.description,
              })
            );
          }}
        />
      </View>
      {/* FavouritesCard */}
      <View style={tw`flex-1 mx-3`}>
        <FavouriteCard type="destination" />
      </View>
      {/* Navigation Button */}
      {origin && destination && (
        <View style={tw`flex-row bg-white justify-evenly py-3 items-center`}>
          {/* Rides */}
          <TouchableOpacity
            style={tw`bg-black flex flex-row w-26 px-4 py-3 
            rounded-full items-center gap-3`}
            onPress={() => {
              navigation.navigate("RideOptions");
              dispatch(
                setNavigateToRideOptionsCard(!isNavigateToRideOptionsCard)
              );
            }}
          >
            <Icon type="font-awesome" name="car" color="white" size={16} />
            <Text style={tw`text-white text-center`}>Rides</Text>
          </TouchableOpacity>
          {/* Eats */}
          <TouchableOpacity
            style={tw`flex flex-row w-26 px-4 py-2 rounded-full 
          items-center gap-3`}
            disabled={true}
          >
            <Icon
              type="ionicon"
              name="fast-food-outline"
              color="black"
              size={16}
            />
            <Text style={tw`text-center`}>Eats</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default NavigateCard;
