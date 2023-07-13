import { View, Text, FlatList, Image } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import sanityClient, { urlFor } from "../sanity";
import { useDispatch, useSelector } from "react-redux";
import { selectRideCarTypes, setRideCarType } from "../feature/useStateSlice";
import {
  selectDestination,
  selectOrigin,
  selectTravelTimeInformation,
} from "../feature/navSlice";
import Currency from "react-currency-formatter";

const RideOptionsCard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const rideCarTypes = useSelector(selectRideCarTypes);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const [isSelected, setIsSelected] = useState("");
  const SURGE_PRICING_RATE = 1.5;
  const PRICES_PER_VALUE = 10;

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == 'rideCars']{
        ...,}[rideCarsType == 'Uber X'] + 
      *[_type == 'rideCars']{
        ...,}[rideCarsType == 'Uber XL'] + 
      *[_type == 'rideCars']{
        ...,}[rideCarsType == 'Uber LUX']
      `
      )
      .then((data) => dispatch(setRideCarType(data)));
  }, []);

  // useEffect(() => {
  //   console.log(travelTimeInformation);
  //   console.log(`-------------------------`);
  // }, [travelTimeInformation]);

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Welcome Box */}
      <View style={tw`p-3 bg-white border-b border-gray-200 shadow-sm`}>
        <Text style={tw`text-lg text-center font-semibold`}>Select a Ride</Text>
        <TouchableOpacity
          style={tw`absolute top-4 left-6`}
          onPress={() => navigation.goBack()}
        >
          <DynamicHeroIcons
            type="solid"
            icon="ChevronLeftIcon"
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </View>
      {/* Ride Type Options */}
      <FlatList
        data={rideCarTypes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setIsSelected(item);
            }}
            style={tw`${isSelected._id === item._id ? `bg-gray-200` : ``}`}
          >
            <View
              style={tw`flex-row items-center justify-between 
                  mr-3 ml-3 px-4 border-b border-gray-100`}
            >
              {/* Ride Image */}
              <Image
                style={{
                  bottom: 10,
                  width: 100,
                  height: 90,
                  resizeMode: "contain",
                }}
                source={{
                  uri: urlFor(item.rideImage).url(),
                }}
              />
              {/* Ride Name & Travel Time */}
              <View style={tw`w-35`}>
                <Text style={tw`text-lg font-semibold`}>
                  {item.rideCarsType}
                </Text>
                <Text>{travelTimeInformation?.duration?.text} Travel Time</Text>
              </View>
              {/* Prices */}
              <View>
                <Text style={tw`text-lg font-semibold`}>
                  <Currency
                    quantity={
                      (travelTimeInformation?.duration?.value *
                        item.multiplier *
                        SURGE_PRICING_RATE) /
                      PRICES_PER_VALUE
                    }
                    currency="TWD"
                  />
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <FlatList />
      {/* Choosed Ride Type Button */}
      <View
        style={tw` py-3 mx-8 my-4 rounded-md ${
          !isSelected ? `bg-gray-300` : `bg-black`
        }`}
      >
        <TouchableOpacity disabled={!isSelected}>
          <Text style={tw`text-lg text-white font-semibold text-center`}>
            Choose {isSelected?.rideCarsType}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RideOptionsCard;
