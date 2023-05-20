import { View, Image } from "react-native";
import styles from "../style";
import sanityClient, { urlFor } from "../sanity";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addData, selectData, selectDataWithName } from "../feature/DataSlice";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEYS } from "@env";
import { selectOrigin, setOrigin } from "../feature/navSlice";
import tw from "twrnc";
import { StarIcon } from "react-native-heroicons/outline";
import { TouchableOpacity } from "react-native";
import FavouriteListModal from "../components/FavouriteListModal";
import {
  selectCurrentLoactionIsAddToSanity,
  selectFavouriteLocationList,
  selectIsAddFavourites,
  selectModalVisible,
  selectStarIconFillStyle,
  selectWarningPopUpVisibleForDeleteFavourite,
  selectWarningPopUpVisibleForNull,
  setCurrentLocationIsAddToSanity,
  setModalVisible,
  setStarIconFillStyle,
  setWarningPopUpVisibleForDeleteFavourite,
  setWarningPopUpVisibleForNull,
} from "../feature/useStateSlice";
import { Alert } from "react-native";
import FavouriteCard from "../components/FavouriteCard";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const data = useSelector(selectData);
  const UberLogo = selectDataWithName("HomeScreen UberLogo")?.image[0]?.image;
  const NavOptionsData = selectDataWithName("NavOption")?.image;
  // const requestUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_APIKEYS}&libraries=places`;

  /* starIcon situation useState reducer */
  const isAddFavourites = useSelector(selectIsAddFavourites);

  // Get AutoComplete Text When OnPress the StarIcon
  const inputRef = useRef(null);
  const getInputText = () => {
    return inputRef.current.getAddressText();
  };
  const WarningAddFavourite = ({ type }) => {
    useEffect(() => {
      if (type == "null") {
        Alert.alert(
          "Warning",
          "Have not any origin, can't add to Favourite List"
        );
      } else if (type == "Incompleted") {
        Alert.alert("Warning", "Your origin is available place");
      } else if (type == "removeFavourite") {
        Alert.alert("Warning", "Sure to remove from favourite list?", [
          {
            text: "Cancel",
            onPress: () => {
              console.log("Cancel Remove From Favourite");
            },
            style: "cancel",
          },
          {
            text: "Sure",
            onPress: () => {
              removeFavouriteLocation();
              dispatch(setStarIconFillStyle("transparent"));
            },
          },
        ]);
      }
      dispatch(setWarningPopUpVisibleForNull(false));
      dispatch(setWarningPopUpVisibleForDeleteFavourite(false));
    }, []);
  };
  const warningPopUpVisibleForNull = useSelector(
    selectWarningPopUpVisibleForNull
  );
  const warningPopUpVisibleForDeleteFavourite = useSelector(
    selectWarningPopUpVisibleForDeleteFavourite
  );
  const originIsDuplicated = async () => {
    if (!origin) {
      return;
    }
    const inputText = await getInputText();
    await sanityClient
      .fetch(`*[_type == 'favouriteLocation']{...,}`)
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          if (
            inputText === origin.description &&
            inputText === data[i].address
          ) {
            // console.log(`true`);
            dispatch(setStarIconFillStyle("#ffc400"));
            return dispatch(setCurrentLocationIsAddToSanity(true));
          }
        }
        // console.log(`originIsDuplicated: false`);
        dispatch(setStarIconFillStyle("transparent"));
        return dispatch(setCurrentLocationIsAddToSanity(false));
      });
  };
  const currentLocationIsAddToSanity = useSelector(
    selectCurrentLoactionIsAddToSanity
  );
  const starIconFillStyle = useSelector(selectStarIconFillStyle);
  const modalVisible = useSelector(selectModalVisible);
  const removeFavouriteLocation = () => {
    const originLocation = origin.description;
    sanityClient.fetch(`*[_type == 'favouriteLocation']{...,}`).then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].address == originLocation) {
          sanityClient.delete(`${data[i]._id}`).then(() => {
            console.log(`already delete favourite location`);
            console.log(`id : ${data[i]._id}`);
            console.log(`location : ${data[i].address}`);
          });
        }
      }
    });
  };
  const switchAddFavourites = async () => {
    const inputText = getInputText()._j;
    if (starIconFillStyle == "transparent") {
      if (inputText != origin.description) {
        dispatch(setWarningPopUpVisibleForNull(true));
      } else {
        dispatch(setModalVisible(true));
      }
      if (currentLocationIsAddToSanity) {
        dispatch(setStarIconFillStyle("#ffc400"));
      }
    } else {
      dispatch(setWarningPopUpVisibleForDeleteFavourite(true));
    }
  };
  const [
    isPressOnGooglePlacesAutoComplete,
    setIsPressOnGooglePlacesAutoComplete,
  ] = useState(false);

  // const favouriteLocationList = useSelector(selectFavouriteLocationList);

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

  useEffect(() => {
    if (origin) {
      getInputText();
      originIsDuplicated();
    }
  }, [origin, modalVisible]);

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
                textInputProps={{
                  onFocus: () => dispatch(setStarIconFillStyle("transparent")),
                  onBlur: () => originIsDuplicated(),
                }}
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
                  setIsPressOnGooglePlacesAutoComplete(true);
                }}
                GooglePlacesSearchQuery={{
                  rankby: "distance",
                }}
              />
              {/* {origin && originIsDuplicated()} */}
              {/* Favourites Star Icon */}
              {origin && isPressOnGooglePlacesAutoComplete && (
                <View style={tw`absolute right-0 top-3 z-50`}>
                  <TouchableOpacity onPress={switchAddFavourites}>
                    <StarIcon
                      size={28}
                      color="#ffc400"
                      fill={starIconFillStyle}
                      style={tw`bottom-0.5 right-1`}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* NavOptions */}
          <NavOptions data={NavOptionsData} />

          {/* FavouritesCard */}
          <FavouriteCard type="origin" />
        </View>
      </View>
      {modalVisible && <FavouriteListModal />}
      {warningPopUpVisibleForNull && <WarningAddFavourite type="Incompleted" />}
      {warningPopUpVisibleForDeleteFavourite && (
        <WarningAddFavourite type="removeFavourite" />
      )}
    </>
  );
};

export default HomeScreen;
