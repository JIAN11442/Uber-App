import React, { useState } from "react";
import tw from "twrnc";
import { MapIcon } from "react-native-heroicons/solid";
import { TouchableOpacity } from "react-native";
import { Modal, View } from "react-native";

const MapTypeButton = ({ mapTypeIndex, setMapTypeIndex, mapTypes }) => {
  const switchMapTypes = () => {
    const nextIndex = (mapTypeIndex + 1) % mapTypes.length;
    setMapTypeIndex(nextIndex);
  };

  return (
    <View style={tw`relative`}>
      <TouchableOpacity
        onPress={switchMapTypes}
        style={tw`absolute p-2 bg-[#00CCBB] rounded-full shadow-lg z-50`}>
        <MapIcon color="white" size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default MapTypeButton;
