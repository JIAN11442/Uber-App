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

const RideOptionsCard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const rideCarTypes = useSelector(selectRideCarTypes);
  const [isSelected, setIsSelected] = useState("");

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

  useEffect(() => {
    if (isSelected !== "") {
      console.log(isSelected);
      console.log(`------------------`);
    }
  }, [isSelected]);

  return (
    <View>
      {/* Welcome Box */}
      <View style={tw`p-3 bg-white border-b border-gray-200 shadow-sm`}>
        <Text style={tw`text-lg text-center font-bold`}>Select a Ride</Text>
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
      <View style={tw`flex bg-white h-full`}>
        <FlatList
          data={rideCarTypes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setIsSelected(item);
              }}
              style={tw`${isSelected._id === item._id ? `bg-gray-100` : ``}`}
            >
              <View
                style={tw`flex-row items-center justify-between 
                  mx-5 px-5 border-b border-gray-100`}
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
                <View style={tw`-ml-6`}>
                  <Text style={tw`text-lg font-semibold`}>
                    {item.rideCarsType}
                  </Text>
                  <Text>Travel Time...</Text>
                </View>
                {/* Prices */}
                <View>
                  <Text style={tw`text-lg`}>$99</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <FlatList />
      </View>
    </View>
  );
};

export default RideOptionsCard;
