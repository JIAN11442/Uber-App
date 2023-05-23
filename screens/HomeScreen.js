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
import FavouriteCard from "../components/FavouriteCard";
import WarningModal from "../components/WarningModal";

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

  const switchAddFavourites = async () => {
    const inputText = await getInputText();
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

  // if (origin) {
  //   console.log(origin.description);
  //   console.log(`---------------`);
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
      {warningPopUpVisibleForNull && (
        <WarningModal type="Incompleted" origin={origin} />
      )}
      {warningPopUpVisibleForDeleteFavourite && (
        <WarningModal type="removeFavourite" origin={origin} />
      )}
    </>
  );
};

export default HomeScreen;
