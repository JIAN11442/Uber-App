import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import sanityClient from "../sanity";

const RideOptionsCard = () => {
  const navigation = useNavigation();

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == 'rideCars']{...,}`)
      .then((data) => console.log(data));
  }, []);

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
    </View>
  );
};

export default RideOptionsCard;
