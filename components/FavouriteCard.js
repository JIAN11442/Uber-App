import { View, Text } from "react-native";
import React from "react";
import { useEffect } from "react";
import sanityClient from "../sanity";
import { useSelector } from "react-redux";
import { selectIsAddFavourites } from "../feature/useStateSlice";

const FavouriteCard = () => {
  const isAddFavourite = useSelector(selectIsAddFavourites);
  useEffect(() => {
    sanityClient.fetch(`*[_type == 'favouriteLocation']{...,}`).then((data) => {
      console.log(data.length);
      data.map((dt) => console.log(dt.address));
      console.log(`------------`);
    });
  }, []);

  return (
    <View>
      <Text>FavouriteCard</Text>
    </View>
  );
};

export default FavouriteCard;
