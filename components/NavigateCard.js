import { View, Text } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import styles from "../style";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEYS } from "@env";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { setDestination } from "../feature/navSlice";
import FavouriteCard from "./FavouriteCard";

const NavigateCard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
            navigation.navigate("RideOptions");
          }}
        />
      </View>
      {/* FavouritesCard */}
      <View style={tw`flex-1 mx-3`}>
        <FavouriteCard type="destination" />
      </View>
    </View>
  );
};

export default NavigateCard;
