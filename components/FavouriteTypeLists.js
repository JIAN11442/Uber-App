import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import {
  selectComponentHeight,
  selectCurrentOnPressFavouriteType,
  selectFavouriteTypeLists,
  selectIsAddFavourites,
  selectTabBarHeight,
  setCreateNewLocationInfo,
  setCurrentOnPressFavouriteType,
  setFavouriteTypeLists,
  setIsAddFavourites,
  setIsCreateNewLocation,
  setModalVisible,
  setStarIconFillStyle,
} from "../feature/useStateSlice";
import sanityClient from "../sanity";
import { useEffect, useRef } from "react";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { useNavigation } from "@react-navigation/native";
import client from "../sanity";
import { selectOrigin } from "../feature/navSlice";
import uuid from "react-native-uuid";
import { customAlphabet } from "nanoid/non-secure";
import { useState } from "react";
import * as Animatable from "react-native-animatable";

const FavouriteTypeLists = () => {
  const dispatch = useDispatch();
  const maxComponentHeight = useSelector(selectComponentHeight);
  const tabBarHeight = useSelector(selectTabBarHeight);
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);
  const navigation = useNavigation();
  const origin = useSelector(selectOrigin);

  // const currentOnPressFavouriteType = useSelector(
  //   selectCurrentOnPressFavouriteType
  // );
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

  useEffect(() => {
    console.log(optionalVisible);
    console.log(`---------------------`);
  }, [optionalVisible]);

  return (
    <View>
      <View style={tw`pt-1 pb-2 bg-white`}>
        <Text style={tw`text-center text-base font-semibold`}>
          Choose your favourite lists
        </Text>
      </View>
      <View style={tw`h-[250px]`}>
        <ScrollView>
          {favouriteTypeLists &&
            favouriteTypeLists.map((item, index) => (
              // FavouriteType
              <View key={item._id} style={tw`flex-row relative items-center`}>
                {/* FavouriteType Icon & Text */}
                <TouchableOpacity
                  onPress={() => UploadDataToSanity(item, origin)}
                  style={tw`flex-1`}
                >
                  <View
                    style={tw`flex-row py-3 items-center bg-white ${
                      index == 0 ? `border-t border-b` : `border-b`
                    } border-gray-100`}
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
                <View style={tw`absolute right-4`}>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteTypeListOptional({ id: item._id });
                    }}
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
                          onPress={() =>
                            favouriteTypeListOptional({ id: item._id })
                          }
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
