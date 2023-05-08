import { View, Text, Image, ScrollView } from "react-native";
import styles from "../style";
import sanityClient, { urlFor } from "../sanity";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addData, selectData, selectDataWithName } from "../feature/DataSlice";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEYS } from "@env";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { TextInput } from "react-native";
import { Platform } from "react-native";
import { selectOrigin, setOrigin } from "../feature/navSlice";
import tw from "twrnc";
import { StarIcon } from "react-native-heroicons/outline";
import { TouchableOpacity } from "react-native";
import client from "../sanity";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FavouriteListModal from "../components/FavouriteListModal";
import {
  selectIsAddFavourites,
  setIsAddFavourites,
} from "../feature/useStateSlice";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const data = useSelector(selectData);
  const UberLogo = selectDataWithName("HomeScreen UberLogo")?.image[0]?.image;
  const NavOptionsData = selectDataWithName("NavOption")?.image;
  // const requestUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_APIKEYS}&libraries=places`;
  const isAddFavourites = useSelector(selectIsAddFavourites);
  const switchAddFavourites = () => {
    dispatch(setIsAddFavourites(!isAddFavourites));
  };

  useEffect(() => {
    sanityClient
      .fetch(
        `
        *[_type == 'data'] {
          ...,image[]->{
            ...,screen[]->{
              ...,
            }
          }
        }
    `
      )
      .then((data) => {
        dispatch(addData(data));
      });
  }, []);

  // useEffect(() => {
  //   if (selectAddFavouriteType) {
  //     client.create({
  //       _type: "favouriteTypes",
  //       favouriteTypesName: "WORK",
  //       heroiconsName: "briefcase",
  //     });
  //   }
  // }, [selectAddFavouriteType]);

  const inputRef = useRef();
  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      dispatch(
        setOrigin({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        })
      );
    }
  };

  if (origin) {
    console.log(origin);
  }

  return (
    <>
      <View style={styles.AndroidSafeAreaStyle}>
        <View style={tw`flex-1 bg-white px-5 pt-2 pb-5`}>
          {/* Uber Logo */}
          {UberLogo && (
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
              }}
              source={{
                uri: urlFor(UberLogo).url(),
              }}
            />
          )}

          {/* GooglePlacesAutoComplete */}
          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-1`}>
              <GooglePlacesAutocomplete
                styles={styles.AutoCompletedStyleForForm}
                placeholder="Where From?"
                minLength={2}
                debounce={400}
                nearbyPlacesAPI="GooglePlacesSearch"
                query={{
                  key: GOOGLE_MAPS_APIKEYS,
                  language: "en",
                }}
                enablePoweredByContainer={false}
                fetchDetails={true}
                onPress={(data, details = null) => {
                  dispatch(
                    setOrigin({
                      location: details.geometry.location,
                      description: data.description,
                    })
                  );
                }}
                GooglePlacesSearchQuery={{
                  rankby: "distance",
                }}
              />
            </View>

            {/* Favourites Star Icon */}
            <View style={tw`z-50`}>
              <TouchableOpacity onPress={switchAddFavourites}>
                <StarIcon
                  size={25}
                  color="#ffc400"
                  fill={isAddFavourites ? "#ffc400" : "transparent"}
                  style={tw`bottom-0.5 right-1`}
                />
              </TouchableOpacity>
            </View>

            {/* {origin?.location && (
            <TouchableOpacity onPress={switchAddFavourites}>
              <StarIcon
                size={25}
                color="#ffc400"
                fill={selectAddFavouriteType ? "#ffc400" : "transparent"}
                style={tw`bottom-0.5 right-1`}
              />
            </TouchableOpacity>
          )} */}
          </View>

          {/* NavOptions */}
          <NavOptions data={NavOptionsData} />
        </View>
      </View>
      {isAddFavourites && <FavouriteListModal />}
    </>
  );
};

export default HomeScreen;
