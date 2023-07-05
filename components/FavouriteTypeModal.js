import { TouchableOpacity, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import {
  selectComponentHeight,
  selectCurrentOnPressOptionalFavouriteType,
  selectFavouriteTypeLists,
  selectTabBarHeight,
  setCreateNewLocationInfo,
  setCurrentOnPressOptionalFavouriteType,
  setIsCreateNewLocation,
  setIsEditFavouriteType,
  setModalVisible,
  setStarIconFillStyle,
} from "../feature/useStateSlice";
import sanityClient from "../sanity";
import React, { useEffect, useRef } from "react";
import DynamicHeroIcons from "../DynamicHeroIcons";
import SwitchButton from "./SwitchButton";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import client from "../sanity";
import { selectOrigin } from "../feature/navSlice";
import uuid from "react-native-uuid";
import { customAlphabet } from "nanoid/non-secure";
import { useState } from "react";
import * as Animatable from "react-native-animatable";
import { SanityClient } from "@sanity/client";
import { TouchableHighlightBase } from "react-native";

const FavouriteTypeModal = () => {
  const dispatch = useDispatch();
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
  const UploadDataToSanity = async (item, origin) => {
    const allowNanoChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const nanoId = customAlphabet(allowNanoChars, 22);
    const favouriteType = {
      _type: "reference",
      _ref: item._id,
      _key: uuid.v4(),
    };
    await client.create({
      _id: nanoId(),
      _type: "favouriteLocation",
      address: origin.description,
      lat: origin.location.lat,
      lng: origin.location.lng,
      favourite_type: [favouriteType],
    });
    dispatch(
      setCreateNewLocationInfo({
        _id: nanoId(),
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
          Active Your FavouriteType
        </Text>
      </View>

      <View style={tw`h-[250px]`}>
        <ScrollView>
          {favouriteTypeLists &&
            favouriteTypeLists.map((item, index) => (
              // FavouriteType
              <View key={item._id}>
                <View
                  style={tw`flex-row relative items-center justify-center bg-white ${
                    index == 0 ? `border-t border-b` : `border-b`
                  } border-gray-100`}
                >
                  {/* FavouriteType Icon & Text */}
                  <TouchableOpacity
                    onPress={() => UploadDataToSanity(item, origin)}
                    style={tw`flex-1`}
                  >
                    <View style={tw`flex-row py-3 items-center`}>
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
                  <View style={tw`px-4 h-[50px] justify-center items-center`}>
                    <SwitchButton width="12" height="6" item={item} />
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default FavouriteTypeModal;
