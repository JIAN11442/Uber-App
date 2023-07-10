import { TouchableOpacity, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import {
  clearAllLocation,
  selectComponentHeight,
  selectCurrentOnPressOptionalFavouriteType,
  selectFavouriteTypeLists,
  selectGetAllLocation,
  selectIsEditFavouriteLocation,
  selectIsEditFavouriteLocationInfo,
  selectTabBarHeight,
  selectWarningPopUpVisibleForDeleteFavourite,
  setCreateNewLocationInfo,
  setCurrentOnPressOptionalFavouriteType,
  setGetAllLocation,
  setIsCreateNewLocation,
  setIsEditFavouriteLocation,
  setIsEditFavouriteLocationInfo,
  setIsEditFavouriteType,
  setModalVisible,
  setStarIconFillStyle,
  setWarningPopUpVisibleForDeleteFavourite,
  setWarningPopUpVisibleForDeleteFavouriteType,
} from "../feature/useStateSlice";
import sanityClient from "../sanity";
import React, { useEffect, useRef } from "react";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import client from "../sanity";
import { selectOrigin } from "../feature/navSlice";
import uuid from "react-native-uuid";
import { customAlphabet } from "nanoid/non-secure";
import { useState } from "react";
import * as Animatable from "react-native-animatable";
import SanityClient from "../sanity";

const FavouriteTypeLists = () => {
  const dispatch = useDispatch();
  const maxComponentHeight = useSelector(selectComponentHeight);
  const tabBarHeight = useSelector(selectTabBarHeight);
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);
  const navigation = useNavigation();
  const origin = useSelector(selectOrigin);
  const [optionalVisible, setOptionalVisible] = useState("");
  const favouriteTypeListOptional = (props) => {
    const id = props.id;
    setOptionalVisible((prevState) => ({
      ...prevState,
      [id]: !prevState[id] || false,
    }));
  };
  const uploadDataToSanity = async (item, origin) => {
    const allowNanoChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const nanoId = customAlphabet(allowNanoChars, 22);
    const customId = nanoId();
    const favouriteType = {
      _type: "reference",
      _ref: item._id,
      _key: uuid.v4(),
    };
    await client.create({
      _id: customId,
      _type: "favouriteLocation",
      address: origin.description,
      lat: origin.location.lat,
      lng: origin.location.lng,
      favourite_type: [favouriteType],
    });

    dispatch(
      setCreateNewLocationInfo({
        _id: customId,
        favouriteTypeId: item._id,
        address: origin.description,
        lat: origin.location.lat,
        lng: origin.location.lng,
      })
    );
    dispatch(setStarIconFillStyle("#ffc400"));
    dispatch(setModalVisible(false));
    dispatch(setIsCreateNewLocation(true));
    console.log(`already create in sanity`);
  };
  const currentOnPressOptionalFavouriteTypeInfo = useSelector(
    selectCurrentOnPressOptionalFavouriteType
  );

  const isEditFavouriteLocation = useSelector(selectIsEditFavouriteLocation);
  const isEditFavouriteLocationInfo = useSelector(
    selectIsEditFavouriteLocationInfo
  );
  const allLocation = useSelector(selectGetAllLocation);
  const changeToSaveLocationIn = async (item) => {
    const ChangeToSaveFavouriteTypeId = item._id;
    const changeToSaveFavouriteTypeIndex = allLocation.findIndex(
      (location) => location[ChangeToSaveFavouriteTypeId]
    );
    const targetFavouriteTypeId = isEditFavouriteLocationInfo.favouriteTypeId;
    const targetLocationId = isEditFavouriteLocationInfo._id;
    const targetFavouriteTypeIndex = allLocation.findIndex(
      (location) => location[targetFavouriteTypeId]
    );
    const targetFavouriteLocationIndex = allLocation[targetFavouriteTypeIndex][
      targetFavouriteTypeId
    ].findIndex((locationObj) => locationObj._id === targetLocationId);

    // Refresh In Sanity
    SanityClient.patch(targetLocationId)
      .set({
        "favourite_type[0]._ref": ChangeToSaveFavouriteTypeId,
      })
      .commit()
      .then((response) => {
        console.log("location updated successfully : ", response);
      })
      .catch((error) => {
        console.log(`Error updating data : `, error);
      });

    // Refresh In Redux
    const updatedAllLocation = JSON.parse(JSON.stringify(allLocation));
    updatedAllLocation[targetFavouriteTypeIndex][targetFavouriteTypeId].splice(
      targetFavouriteLocationIndex,
      1
    );
    updatedAllLocation[changeToSaveFavouriteTypeIndex][
      ChangeToSaveFavouriteTypeId
    ].push({
      _id: isEditFavouriteLocationInfo._id,
      address: isEditFavouriteLocationInfo.address,
      lat: isEditFavouriteLocationInfo.lat,
      lng: isEditFavouriteLocationInfo.lng,
    });
    // Updated New AllLocation To Redux
    dispatch(clearAllLocation());
    updatedAllLocation.map((locationObj) =>
      dispatch(setGetAllLocation(locationObj))
    );

    dispatch(setIsEditFavouriteLocation(false));
    dispatch(setIsEditFavouriteLocationInfo(""));
    dispatch(setModalVisible(false));
  };

  // useEffect(() => {
  //   console.log(allLocation);
  //   console.log(`----------------------`);
  // }, [allLocation]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setIsEditFavouriteType(false));
      setOptionalVisible("");
    }, [])
  );

  return (
    <View>
      <View style={tw`pt-1 pb-2 bg-white relative`}>
        <Text style={tw`text-center text-base font-semibold `}>
          {isEditFavouriteLocation ? (
            <Text>Change To Save Location In...</Text>
          ) : (
            <Text>Save Location In...</Text>
          )}
        </Text>
      </View>

      <View style={tw`h-[250px]`}>
        <ScrollView>
          {favouriteTypeLists &&
            favouriteTypeLists.map((item, index) => (
              // FavouriteType
              <View key={item._id}>
                {item.status && (
                  <View
                    style={tw`flex-row relative items-center justify-center`}
                  >
                    {/* FavouriteType Icon & Text */}
                    <TouchableOpacity
                      onPress={() => {
                        isEditFavouriteLocation
                          ? changeToSaveLocationIn(item)
                          : uploadDataToSanity(item, origin);
                      }}
                      style={tw`flex-1`}
                      disabled={
                        item._id === isEditFavouriteLocationInfo.favouriteTypeId
                          ? true
                          : false
                      }
                    >
                      <View
                        style={tw`flex-row py-3 items-center border-gray-100
                         ${index == 0 ? `border-t border-b` : `border-b`} 
                         ${
                           item._id ===
                           isEditFavouriteLocationInfo.favouriteTypeId
                             ? `opacity-50 bg-white`
                             : `bg-white`
                         }`}
                      >
                        {/* FavouriteType Icon */}
                        <View style={tw`mx-4`}>
                          <DynamicHeroIcons
                            type="solid"
                            icon={item.heroiconsName}
                            size={25}
                            color="gray"
                          />
                        </View>
                        {/* FavouriteType Text */}
                        <View>
                          <Text style={tw`text-base text-gray-500`}>
                            {item.favouriteTypesName}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    {/* Optional */}
                    <View style={tw`absolute right-0 h-[50px] justify-center`}>
                      <TouchableOpacity
                        style={tw`px-4 ${
                          item._id ===
                          isEditFavouriteLocationInfo.favouriteTypeId
                            ? `opacity-50`
                            : ``
                        }`}
                        onPress={() => {
                          favouriteTypeListOptional({ id: item._id });
                          dispatch(
                            setCurrentOnPressOptionalFavouriteType(item)
                          );
                        }}
                        disabled={
                          item._id ===
                          isEditFavouriteLocationInfo.favouriteTypeId
                            ? true
                            : false
                        }
                      >
                        {!optionalVisible[item._id] ? (
                          <DynamicHeroIcons
                            type="outlined"
                            icon="EllipsisVerticalIcon"
                            size={22}
                            color="#9ca3af"
                          />
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
                                  setCurrentOnPressOptionalFavouriteType(item)
                                );
                                dispatch(setIsEditFavouriteType(true));
                                navigation.navigate("addFavouriteType");
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
                              // Delete FavouriteType
                              onPress={() => {
                                dispatch(
                                  setWarningPopUpVisibleForDeleteFavouriteType(
                                    true
                                  )
                                );
                              }}
                              style={tw`py-4 items-center justify-center`}
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
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          {/* Add new lists */}
          <View style={tw`py-3 bg-white`}>
            <TouchableOpacity
              onPress={() => navigation.navigate("addFavouriteType")}
            >
              <View style={tw`flex-row items-center`}>
                <View style={tw`mx-4`}>
                  <DynamicHeroIcons
                    type="outlined"
                    icon="PlusCircleIcon"
                    size={25}
                    color="rgb(209 213 219)"
                  />
                </View>
                <View>
                  <Text style={tw`text-gray-300 text-base`}>Add new list</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default FavouriteTypeLists;
