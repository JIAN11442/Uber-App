import { View, Text, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import sanityClient from "../sanity";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCreateNewLocationInfo,
  selectCurrentFavouriteCardOnPressId,
  selectCurrentOnPressLocationInfo,
  selectFavouriteLocationList,
  selectFavouriteTypeLists,
  selectIsCancelDeleteFavouriteLocationCard,
  selectIsCreateNewLocation,
  selectIsDeleteFavouriteLocationCard,
  selectModalVisible,
  selectWarningPopUpVisibleForDeleteFavourite,
  selectWarningPopUpVisibleForNull,
  setCurrentFavouriteCardOnPressId,
  setCurrentOnPressLocationInfo,
  setFavouriteLocationList,
  setFavouriteTypeLists,
  setIsCancelDeleteFavouriteLocationCard,
  setIsCreateNewLocation,
  setIsDeleteFavouriteLocationCard,
  setWarningPopUpVisibleForDeleteFavourite,
} from "../feature/useStateSlice";
import { TouchableOpacity } from "react-native";
import tw from "twrnc";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { selectOrigin, setDestination, setOrigin } from "../feature/navSlice";
import { customAlphabet } from "nanoid/non-secure";

const FavouriteCard = (props) => {
  const favouriteCardType = props.type;
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const navigation = useNavigation();
  const modalVisible = useSelector(selectModalVisible);
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);
  const [currentFavouriteCardOnPressId, setCurrentFavouriteCardOnPressId] =
    useState([]);
  const isCreateNewLocation = useSelector(selectIsCreateNewLocation);
  const createNewLocationInfo = useSelector(selectCreateNewLocationInfo);
  // current OnPress FavouriteCard Type Status Settings
  const [
    favouriteCardOnPressStatusWithId,
    setFavouriteCardOnPressStatusWithId,
  ] = useState([]);
  const favouriteCardOnPressStatus = (props) => {
    const favouriteTypeId = props.id;
    setFavouriteCardOnPressStatusWithId((prevState) => ({
      ...prevState,
      [favouriteTypeId]: !prevState[favouriteTypeId] || false,
    }));
  };

  // Get Each Location After OnPress the FavouriteCard
  const [allFavouriteCardOnPressLocation, setAllFavouriteCardOnPressLocation] =
    useState({});
  const [
    favouriteCardOnPressLocationWithId,
    setFavouriteCardOnPressLocationWithId,
  ] = useState([]);
  const getFavouriteCardLocationWidthId = (props) => {
    const currentFavouriteCardId = props.id;
    setFavouriteCardOnPressLocationWithId((prevState) => ({
      ...prevState,
      [currentFavouriteCardId]:
        allFavouriteCardOnPressLocation[currentFavouriteCardId],
    }));
  };

  // Get current OnPress FavouriteCard Id

  // FavouriteCard Location Optional Modal Settings
  const currentOnPressLocationInfo = useSelector(
    selectCurrentOnPressLocationInfo
  );
  const [optionModalVisible, setOptionModalVisible] = useState([]);
  const favouriteCardLocationOptionalOnPressStatus = (props) => {
    const id = props._id;
    setOptionModalVisible((prevState) => ({
      ...prevState,
      [id]: !prevState[id] || false,
    }));
  };
  const isDeleteFavouriteLocationCard = useSelector(
    selectIsDeleteFavouriteLocationCard
  );
  const isCancelDeleteFavouriteLocationCard = useSelector(
    selectIsCancelDeleteFavouriteLocationCard
  );
  const removeFavouriteLocationFromFavouriteCard = (location) => {
    dispatch(
      setCurrentOnPressLocationInfo({
        id: location._id,
        description: location.address,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
      })
    );
    dispatch(setWarningPopUpVisibleForDeleteFavourite(true));
  };

  // const refreshFavouriteCard = (props) => {
  //   const refreshType = props.type;
  //   const targetLocation = origin.description;
  //   const currentOnPressIdLocation =
  //     favouriteCardOnPressLocation[currentFavouriteCardOnPressId];
  //   // close favouriteCard
  //   for (const type of favouriteTypeLists) {
  //     setFavouriteCardOnPressStatusWithId((prevState) => ({
  //       ...prevState,
  //       [type._id]: false,
  //     }));
  //   }
  //   // close favouriteCard Location Optional
  //   sanityClient
  //     .fetch(`*[_type == 'favouriteLocation']{_id,address,lat,lng}`)
  //     .then((location) => {
  //       const location_id = location._id;
  //       setOptionModalVisible((prevState) => ({
  //         prevState,
  //         [location_id]: false,
  //       }));
  //     });
  //   //
  //   const filteredLocationResult = (data) => {
  //     const filterLocation = data.filter(
  //       (location) => location.address === targetLocation
  //     );
  //     if (refreshType === "AfterDeleteLocation") {
  //       if (filterLocation.length > 0) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     } else if (refreshType === "AfterCreateNewLocation") {
  //       if (filterLocation.length > 0) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }
  //   };

  //   setIsLoading(true);
  //   let num = 0;
  //   const timer = setInterval(async () => {
  //     num += 1;
  //     await sanityClient
  //       .fetch(`*[_type == 'favouriteLocation']{address}`)
  //       .then((data) => {
  //         if (filteredLocationResult(data) === false) {
  //           console.log(`the ${num} seconds, not refreshed yet`);
  //         } else {
  //           clearInterval(timer);
  //           setIsLoading(false);
  //           console.log(`the ${num} seconds, refresh successfully`);
  //           console.log(`--------------------------`);
  //         }
  //       });
  //   }, 1000);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // };

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
    if (favouriteTypeLists === null) {
      return;
    }
    for (const favouriteType of favouriteTypeLists) {
      sanityClient
        .fetch(
          `*[_type == 'favouriteLocation' 
      && references('${favouriteType._id}')]{_id,address,lat,lng}`
        )
        .then((data) => {
          setAllFavouriteCardOnPressLocation((prevState) => ({
            ...prevState,
            [favouriteType._id]: data,
          }));
        });
    }
  }, [favouriteTypeLists]);

  useEffect(() => {
    const locationList =
      allFavouriteCardOnPressLocation[currentFavouriteCardOnPressId];
    const allowNanoChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const nanoId = customAlphabet(allowNanoChars, 22);
    console.log(allFavouriteCardOnPressLocation);
    console.log(`-------------------------`);

    if (isDeleteFavouriteLocationCard) {
      const removeLocationIndex = locationList.findIndex(
        (locationObj) => locationObj._id === currentOnPressLocationInfo.id
      );
      dispatch(setIsDeleteFavouriteLocationCard(false));
      if (removeLocationIndex !== -1) {
        locationList.splice(removeLocationIndex, 1);
      }
    } else if (isCancelDeleteFavouriteLocationCard) {
      const newLocation = {
        _id: nanoId(),
        address: "testes",
        lat: 123,
        lng: 321,
      };
      dispatch(setIsCancelDeleteFavouriteLocationCard(false));

      // console.log(newLocation);
      locationList.push(newLocation);
    }
  }, [isDeleteFavouriteLocationCard, isCancelDeleteFavouriteLocationCard]);

  useEffect(() => {
    if (isCreateNewLocation) {
      console.log(createNewLocationInfo);
    }
  }, [isCreateNewLocation]);
  return (
    <View style={tw`flex-1 mt-5`}>
      <ScrollView>
        {favouriteTypeLists &&
          favouriteTypeLists.map((type, index) => (
            <View key={type._id} style={tw`mr-2`}>
              {/* Main FavouriteType  Menu*/}
              <TouchableOpacity
                onPress={() => {
                  setCurrentFavouriteCardOnPressId(type._id);
                  favouriteCardOnPressStatus({ id: type._id });
                  getFavouriteCardLocationWidthId({ id: type._id });
                }}
                style={tw`flex-row items-center py-2 px-3 ${
                  index != favouriteTypeLists.length - 1
                    ? `border-b border-gray-200`
                    : ``
                }`}
                // disabled={isLoading}
              >
                {/* FavouriteType Icons */}
                <View
                  style={tw`p-2 rounded-full mr-10 ${
                    favouriteCardOnPressStatusWithId[type._id]
                      ? `bg-gray-400`
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
                  {/* {isLoading ? (
                    <ActivityIndicator />
                  ) : ( */}
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
                  {/* )} */}
                </View>
              </TouchableOpacity>
              {/* Location of FavouriteType Menu */}
              <View>
                {favouriteCardOnPressStatusWithId[type._id] &&
                  favouriteCardOnPressLocationWithId[type._id] && (
                    <View style={tw`bg-gray-100`}>
                      {favouriteCardOnPressLocationWithId[type._id].map(
                        (location, index) => (
                          <View
                            key={location._id}
                            style={tw`flex-row ${
                              index !=
                              favouriteCardOnPressLocationWithId[type._id]
                                .length -
                                1
                                ? `border-b border-gray-50`
                                : ``
                            }`}>
                            <TouchableOpacity
                              disabled={
                                optionModalVisible[location._id] ? true : false
                              }
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
                                // refreshFavouriteCard();
                                navigation.navigate("Map");
                              }}
                              style={tw`flex-row items-center flex-1 ${
                                optionModalVisible[location._id]
                                  ? `ml-3 mr-8`
                                  : `mx-3`
                              }`}>
                              {/* location Icon */}
                              <View style={tw`ml-1 mr-3`}>
                                <DynamicHeroIcons
                                  type="solid"
                                  icon="MapPinIcon"
                                  size={22}
                                  color={
                                    favouriteCardType == "origin"
                                      ? "#EA3535"
                                      : "#3949AB"
                                  }
                                />
                              </View>
                              {/* location Text */}
                              <View style={tw`flex-1 py-3`}>
                                <Text style={tw`text-gray-500 text-[15px]`}>
                                  {location.address}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            {/* EllipsisVerticalIcon Icons */}
                            {!optionModalVisible[location._id] ? (
                              <View
                                style={tw`px-4 py-4 items-center justify-center`}>
                                <TouchableOpacity
                                  onPress={() =>
                                    favouriteCardLocationOptionalOnPressStatus(
                                      location
                                    )
                                  }>
                                  <View>
                                    <DynamicHeroIcons
                                      type="outlined"
                                      icon="EllipsisVerticalIcon"
                                      size={22}
                                      color="#9ca3af"
                                    />
                                  </View>
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <Animatable.View
                                animation={`fadeIn`}
                                duration={200}
                                style={tw`flex-row items-center justify-center gap-2 mr-2`}>
                                {/* PencilSquareIcon */}
                                <TouchableOpacity
                                  style={tw`items-center justify-center`}
                                  onPress={() =>
                                    favouriteCardLocationOptionalOnPressStatus(
                                      location
                                    )
                                  }>
                                  <DynamicHeroIcons
                                    type="solid"
                                    icon="PencilSquareIcon"
                                    size={22}
                                    color="gray"
                                  />
                                </TouchableOpacity>
                                {/* TrashIcon */}
                                <TouchableOpacity
                                  style={tw`py-4 items-center justify-center`}
                                  onPress={() =>
                                    removeFavouriteLocationFromFavouriteCard(
                                      location
                                    )
                                  }>
                                  <DynamicHeroIcons
                                    type="solid"
                                    icon="TrashIcon"
                                    size={22}
                                    color="gray"
                                  />
                                </TouchableOpacity>
                              </Animatable.View>
                            )}
                          </View>
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
