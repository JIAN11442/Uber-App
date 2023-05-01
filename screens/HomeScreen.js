import { View, Text, Image, ScrollView } from "react-native";
import styles from "../style";
import sanityClient, { urlFor } from "../sanity";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addData, selectData, selectDataWithName } from "../feature/DataSclice";
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

const HomeScreen = () => {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const data = useSelector(selectData);
  const UberLogo = selectDataWithName("HomeScreen UberLogo")?.image[0]?.image;
  const NavOptionsData = selectDataWithName("NavOption")?.image;
  // const requestUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_APIKEYS}&libraries=places`;
  const [addFavourites, setAddFavourites] = useState(false);
  const switchAddFavourites = () => {
    setAddFavourites(!addFavourites);
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
            {Platform.OS == "web" ? (
              <LoadScript
                googleMapsApiKey={GOOGLE_MAPS_APIKEYS}
                libraries={["places"]}
                language="en"
                // minLength="2"
              >
                <StandaloneSearchBox
                  onLoad={(ref) => {
                    inputRef.current = ref;
                  }}
                  onPlacesChanged={handlePlaceChanged}>
                  <TextInput
                    style={tw`flex-1 p-2  w-full text-base text-gray-500`}
                    placeholder="Where From?"
                  />
                </StandaloneSearchBox>
              </LoadScript>
            ) : (
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
            )}
          </View>
          {/* Favourites Star Icon */}
          {origin?.location && (
            <TouchableOpacity onPress={switchAddFavourites}>
              <StarIcon
                size={25}
                color="#ffc400"
                fill={addFavourites ? "#ffc400" : "transparent"}
                style={tw`bottom-0.5 right-1`}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* NavOptions */}
        <NavOptions data={NavOptionsData} />
        {/* <ScrollView>
          <View>
            <Text>{pt_data}</Text>
          </View>
        </ScrollView> */}
      </View>
    </View>
  );
};

export default HomeScreen;
