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

const FavouriteCard = () => {
  const dispatch = useDispatch();
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);
  const onPressStatusWithKey = useSelector(
    selectFavouriteTypeCardOnPressStatus
  );
  const currentOnPressFavouriteTypeKey = useSelector(
    selectCurrentOnPressFavouriteTypeKey
  );
  const currentOnPressStatus = useSelector(selectCurrentOnPressStatus);

  // const FavouritesCardOnPress = async (props) => {
  //   dispatch(setCurrentOnPressFavouriteTypeKey(props._id));
  //   const target_index = await onPressStatusWithKey.findIndex(
  //     (type) => type.id == props._id
  //   );
  //   const currentTargetOnPressStatus =
  //     onPressStatusWithKey[target_index].onPressStatus;
  //   const updatedOnPressStatusWidthKey = [...onPressStatusWithKey];
  //   updatedOnPressStatusWidthKey[target_index] = {
  //     id: props._id,
  //     onPressStatus: !currentTargetOnPressStatus,
  //   };
  //   dispatch(setFavouriteTypeCardOnPressStatus(updatedOnPressStatusWidthKey));
  //   dispatch(
  //     setCurrentOnPressStatus(
  //       updatedOnPressStatusWidthKey[target_index].onPressStatus
  //     )
  //   );
  //   console.log(updatedOnPressStatusWidthKey[target_index].id);
  //   console.log(updatedOnPressStatusWidthKey[target_index].onPressStatus);
  //   console.log(`---------------------------`);
  //   // console.log(onPressStatusWithKey[target_index]);
  //   // console.log(`--------------------`);
  // };

  const [favouriteTypeStatus, setFavouriteTypeStatus] = useState({});
  const favouritesCardOnPress = (props) => {
    const _id = props._id;
    setFavouriteTypeStatus((prevState) => ({
      ...prevState,
      [_id]: !prevState[_id] || false,
    }));
    console.log(favouriteTypeStatus);
  };

  useEffect(() => {
    const favouriteTypeCardOnPressStatusWithKey = [];
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
        data.map((dt) =>
          favouriteTypeCardOnPressStatusWithKey.push({
            id: dt._id,
            onPressStatus: false,
          })
        );
        dispatch(
          setFavouriteTypeCardOnPressStatus(
            favouriteTypeCardOnPressStatusWithKey
          )
        );
        dispatch(setFavouriteTypeLists(data));
      });
  }, []);

  // if (favouriteTypeLists) {
  //   console.log(favouriteTypeLists);
  // }

  return (
    <View style={tw`flex-1 mt-10`}>
      {favouriteTypeLists && (
        <FlatList
          data={favouriteTypeLists}
          keyExtractor={(item) => item._id}
          renderItem={({
            item: { _id, favouriteTypesName, heroiconsName },
          }) => (
            <View>
              <TouchableOpacity
                style={tw`flex-row items-center py-3`}
                onPress={() => favouritesCardOnPress({ _id })}
              >
                {/* FavouriteType Icon */}
                <View
                  style={tw`p-2 ${
                    favouriteTypeStatus[_id] ? `bg-gray-600` : `bg-gray-300`
                  } rounded-full mr-10 ml-3`}
                >
                  <DynamicHeroIcons
                    type="solid"
                    icon={heroiconsName}
                    color="white"
                    size={18}
                  />
                </View>
                {/* FavouriteType Name */}
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg text-gray-600`}>
                    {favouriteTypesName}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FavouriteCard;
