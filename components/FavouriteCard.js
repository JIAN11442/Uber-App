import { View, Text } from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import sanityClient from "../sanity";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewLocationFromList,
  deleteLocationFromList,
  selectCreateNewLocationInfo,
  selectCurrentOnPressLocationInfo,
  selectFavouriteTypeLists,
  selectGetAllLocation,
  selectIsCancelDeleteFavouriteLocationCard,
  selectIsCreateNewLocation,
  selectIsDeleteFavouriteLocationCard,
  selectWarningPopUpVisibleForDirectionError,
  setCurrentOnPressLocationInfo,
  setFavouriteTypeLists,
  setGetAllLocation,
  setIsCreateNewLocation,
  setIsDeleteFavouriteLocationCard,
  setIsEditFavouriteLocation,
  setIsEditFavouriteLocationInfo,
  setModalVisible,
  setWarningPopUpVisibleForDeleteFavourite,
} from "../feature/useStateSlice";
import { TouchableOpacity } from "react-native";
import tw from "twrnc";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  selectDestination,
  selectOrigin,
  selectTravelTimeInformation,
  setDestination,
  setOrigin,
  setTravelTimeInformation,
} from "../feature/navSlice";
import { GOOGLE_MAPS_APIKEYS } from "@env";
import { async } from "rxjs";

const FavouriteCard = (props) => {
  const favouriteCardType = props.type;
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const navigation = useNavigation();
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);
  const [currentFavouriteCardOnPressId, setCurrentFavouriteCardOnPressId] =
    useState([]);
  const isCreateNewLocation = useSelector(selectIsCreateNewLocation);
  const createNewLocationInfo = useSelector(selectCreateNewLocationInfo);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);

  // current OnPress FavouriteCard Type Status Settings
  const [
    favouriteCardOnPressStatusWithId,
    setFavouriteCardOnPressStatusWithId,
  ] = useState([]);

  const favouriteCardOnPressStatus = (props) => {
    const favouriteTypeId = props.id;
    CloseAllLocationOptional();
    setFavouriteCardOnPressStatusWithId((prevState) => ({
      ...prevState,
      [favouriteTypeId]: !prevState[favouriteTypeId] || false,
    }));
  };

  // Get Each Location After OnPress the FavouriteCard
  const [
    favouriteCardOnPressLocationWithId,
    setFavouriteCardOnPressLocationWithId,
  ] = useState([]);

  const getAllLocation = useSelector(selectGetAllLocation);

  const getFavouriteCardLocationWidthId = (props) => {
    const currentFavouriteCardId = props.id;

    const currentLocation = () => {
      const result = getAllLocation.filter(
        (favouriteTypeObj) => favouriteTypeObj[currentFavouriteCardId]
      )[0];
      if (result === undefined) {
        return [];
      } else {
        return result[currentFavouriteCardId];
      }
    };

    setFavouriteCardOnPressLocationWithId((prevState) => ({
      ...prevState,
      [currentFavouriteCardId]: currentLocation(),
    }));
  };

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
  const removeFavouriteLocationFromFavouriteCard = (props) => {
    const type = props.type;
    const location = props.location;
    dispatch(
      setCurrentOnPressLocationInfo({
        id: location._id,
        favouriteTypeId: type._id,
        description: location.address,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
      })
    );
    console.log(currentOnPressLocationInfo);
    console.log(`------------------------`);
    dispatch(setWarningPopUpVisibleForDeleteFavourite(true));
  };
  const CloseAllFavouriteCard = () => {
    for (const type of favouriteTypeLists) {
      setFavouriteCardOnPressStatusWithId((prevState) => ({
        ...prevState,
        [type._id]: false,
      }));
    }
  };
  const CloseAllLocationOptional = () => {
    sanityClient
      .fetch(`*[_type == 'favouriteLocation']{_id,address,lat,lng}`)
      .then((location) => {
        const location_id = location._id;
        setOptionModalVisible((prevState) => ({
          prevState,
          [location_id]: false,
        }));
      });
  };
  const refreshFavouriteCard = (props) => {
    const refreshType = props.type;
    // console.log(refreshType);
    if (refreshType == "CloseFavouriteCard") {
      // close favouriteCard
      CloseAllFavouriteCard();
      // close favouriteCard Location Optional
      CloseAllLocationOptional();
    } else if (refreshType == "WithoutCloseFavouriteCard") {
      for (const favouriteType of favouriteTypeLists) {
        getFavouriteCardLocationWidthId({ id: favouriteType._id });
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (favouriteTypeLists) {
        CloseAllFavouriteCard();
        CloseAllLocationOptional();
      }
    }, [])
  );

  // Get All FavouriteType From Sanity.io
  useEffect(() => {
    // `*[_type == 'favouriteTypes']{
    //   ...,}[favouriteTypesName == 'Home'] +
    //   *[_type == 'favouriteTypes']{
    //   ...,}[favouriteTypesName == 'Work'] +
    //   *[_type == 'favouriteTypes']{
    //   ...,}[favouriteTypesName != 'Home' && favouriteTypesName != 'Work']
    // `
    sanityClient.fetch(`*[_type == 'favouriteTypes']{...,}`).then((data) => {
      dispatch(setFavouriteTypeLists(data));
    });
  }, []);

  // When favouriteTypeList has value, get all favouriteLocation Info
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
          const AllLocation = (prevState) => ({
            ...prevState,
            [favouriteType._id]: data,
          });

          dispatch(setGetAllLocation(AllLocation()));
        });
    }
  }, [favouriteTypeLists]);

  // When isDeleteFavouriteLocationCard is true, delete location from allFavouriteLocation Object
  useEffect(() => {
    if (isDeleteFavouriteLocationCard) {
      dispatch(
        deleteLocationFromList({
          favouriteCardOnPressLocationWithId:
            favouriteCardOnPressLocationWithId,
          currentFavouriteCardOnPressId: currentFavouriteCardOnPressId,
          currentOnPressLocationInfo: currentOnPressLocationInfo,
        })
      );

      dispatch(setIsDeleteFavouriteLocationCard(false));
    }
  }, [isDeleteFavouriteLocationCard]);

  // When isCreateNewLocation is true, push the new location into allFavouriteLocation Object
  useEffect(() => {
    if (isCreateNewLocation) {
      dispatch(
        createNewLocationFromList({
          createNewLocationInfo: createNewLocationInfo,
        })
      );
      dispatch(setIsCreateNewLocation(false));
    }
  }, [isCreateNewLocation]);

  // when getAllLocation change, refresh and getFavouriteCardLocationWidthId
  useEffect(() => {
    if (favouriteTypeLists === null) {
      return;
    }
    if (
      getAllLocation.length !== 0 &&
      getAllLocation.length === favouriteTypeLists.length
    ) {
      refreshFavouriteCard({ type: "WithoutCloseFavouriteCard" });
      if (Object.entries(currentOnPressLocationInfo).length > 0) {
        const currentFavouriteTypeLocationList = () => {
          const locationList = getAllLocation
            .slice(0, 3)
            .filter(
              (locationObj) =>
                Object.keys(locationObj)[0] ===
                currentOnPressLocationInfo.favouriteTypeId
            );
          return locationList;
        };
        if (
          currentFavouriteTypeLocationList()[0][
            currentOnPressLocationInfo.favouriteTypeId
          ].length === 0
        ) {
          setFavouriteCardOnPressStatusWithId((prevState) => ({
            ...prevState,
            [currentOnPressLocationInfo.favouriteTypeId]: false,
          }));
        }
      }
    }
  }, [favouriteTypeLists, getAllLocation]);

  // Get Travel Distance and Times When Origin and Destination is Exist
  useEffect(() => {
    if (!origin || !destination) return;

    const getTravelTime = async () => {
      // https://developers.google.com/maps/documentation/distance-matrix/start#json
      try {
        fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?
          units=metric&origins=${origin.description}&destinations=
          ${destination.description}&key=${GOOGLE_MAPS_APIKEYS}`
        )
          .then((res) => res.json())
          .then((data) => {
            dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
          });
      } catch (error) {
        console.log(error);
      }
    };

    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_APIKEYS]);

  return (
    <View
      style={tw`flex-1 ${
        favouriteCardType === "destination" ? `mt-2` : `mt-5`
      }`}
    >
      {/* TEST TouchableOpacity */}
      <ScrollView>
        {favouriteTypeLists &&
          favouriteTypeLists.map((type, index) => (
            <View key={index} style={tw`mr-2`}>
              {type.status && (
                <View>
                  {/* Main FavouriteType Menu*/}
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
                      }`}
                    >
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
                        style={tw`text-lg ${
                          favouriteCardOnPressStatusWithId[type._id]
                            ? `text-gray-600`
                            : `text-gray-500`
                        }`}
                      >
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
                                }`}
                              >
                                <TouchableOpacity
                                  disabled={
                                    optionModalVisible[location._id]
                                      ? true
                                      : false
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
                                      CloseAllFavouriteCard();
                                      navigation.navigate("Map");
                                    } else if (
                                      favouriteCardType == "destination"
                                    ) {
                                      dispatch(
                                        setDestination({
                                          location: {
                                            lat: location.lat,
                                            lng: location.lng,
                                          },
                                          description: location.address,
                                        })
                                      );
                                      CloseAllFavouriteCard();
                                    }
                                  }}
                                  style={tw`flex-row items-center flex-1 ${
                                    optionModalVisible[location._id]
                                      ? `ml-3 mr-8`
                                      : `mx-3`
                                  }`}
                                >
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
                                    style={tw`px-4 py-4 items-center justify-center`}
                                  >
                                    <TouchableOpacity
                                      onPress={() =>
                                        favouriteCardLocationOptionalOnPressStatus(
                                          location
                                        )
                                      }
                                    >
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
                                    style={tw`flex-row items-center justify-center gap-2 mr-2`}
                                  >
                                    {/* PencilSquareIcon */}
                                    <TouchableOpacity
                                      style={tw`items-center justify-center`}
                                      onPress={() => {
                                        dispatch(
                                          setIsEditFavouriteLocation(true)
                                        );
                                        dispatch(
                                          setIsEditFavouriteLocationInfo({
                                            ...location,
                                            favouriteTypeId: type._id,
                                          })
                                        );
                                        dispatch(setModalVisible(true));
                                      }}
                                    >
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
                                      onPress={() => {
                                        removeFavouriteLocationFromFavouriteCard(
                                          {
                                            type: type,
                                            location: location,
                                          }
                                        );
                                      }}
                                    >
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
              )}
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

export default FavouriteCard;
