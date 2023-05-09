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
import FavouriteListModal from "../components/FavouriteListModal";
import {
  selectGetWhereFormInputText,
  selectIsAddFavourites,
  setGetWhereFormInputText,
  setIsAddFavourites,
} from "../feature/useStateSlice";
import { Alert } from "react-native";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const data = useSelector(selectData);
  const UberLogo = selectDataWithName("HomeScreen UberLogo")?.image[0]?.image;
  const NavOptionsData = selectDataWithName("NavOption")?.image;
  // const requestUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_APIKEYS}&libraries=places`;
  const isAddFavourites = useSelector(selectIsAddFavourites);
  const inputRef = useRef(null);
  const getInputText = () => {
    const InputText = inputRef.current.getAddressText();
    dispatch(setGetWhereFormInputText(InputText));
    // console.log(InputText);
  };
  const whereFormInputText = useSelector(selectGetWhereFormInputText);
  const switchAddFavourites = () => {
    dispatch(setIsAddFavourites(!isAddFavourites));
    getInputText();
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

  const WarningAddFavourite = ({ type }) => {
    useEffect(() => {
      if (type == "Null") {
        Alert.alert(
          "Warning",
          "Have not any origin, can't add to Favourite List"
        );
      } else if (type == "Incompleted") {
        Alert.alert("Warning", "Your origin is available place");
      }
      dispatch(setIsAddFavourites(false));
    }, []);
  };

  // if (origin) {
  //   console.log(origin);
  // }

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
                ref={inputRef}
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
              {/* Favourites Star Icon */}
              {origin && (
                <View style={tw`absolute right-0 top-3 z-50`}>
                  <TouchableOpacity onPress={switchAddFavourites}>
                    <StarIcon
                      size={28}
                      color="#ffc400"
                      fill={isAddFavourites ? "#ffc400" : "transparent"}
                      style={tw`bottom-0.5 right-1`}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* NavOptions */}
          <NavOptions data={NavOptionsData} />
        </View>
      </View>
      {isAddFavourites && !whereFormInputText && (
        <WarningAddFavourite type="Null" />
      )}
      {isAddFavourites &&
        whereFormInputText &&
        whereFormInputText != origin.description && (
          <WarningAddFavourite type="Incompleted" />
        )}
      {isAddFavourites &&
        whereFormInputText &&
        whereFormInputText == origin.description && <FavouriteListModal />}
    </>
  );
};

export default HomeScreen;
