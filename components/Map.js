import { View } from "react-native";
import React, { useCallback } from "react";
import MapTypeButton from "../components/MapTypeButton";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { selectDestination, selectOrigin } from "../feature/navSlice";
import tw from "twrnc";
import { useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEYS } from "@env";
import { useRef } from "react";
import { useEffect } from "react";
import {
  selectNavigateToRideOptionsCard,
  setWarningPopUpVisibleForDirectionError,
  setWarningPopUpVisibleForNull,
} from "../feature/useStateSlice";
import { useFocusEffect } from "@react-navigation/core";

const Map = () => {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const isNavigateToRideOptionsCard = useSelector(
    selectNavigateToRideOptionsCard
  );
  const mapTypes = ["standard", "terrain", "satellite", "hybrid"];
  const [mapTypeIndex, setMapTypeIndex] = useState(0);
  const ref = useRef(null);

  useFocusEffect(
    useCallback(() => {
      dispatch(setWarningPopUpVisibleForDirectionError(false));
    }, [destination])
  );

  // fitToCoordinates
  useEffect(() => {
    if (!origin || !destination) return;
    ref.current.fitToCoordinates(
      [
        { latitude: origin.location.lat, longitude: origin.location.lng },
        {
          latitude: destination.location.lat,
          longitude: destination.location.lng,
        },
      ],

      {
        edgePadding: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
        },
      }
    );
  }, [origin, destination, isNavigateToRideOptionsCard]);

  return (
    <View style={tw`relative flex-1`}>
      <MapView
        ref={ref}
        style={tw`flex-1`}
        mapType={mapTypes[mapTypeIndex]}
        initialRegion={{
          latitude: origin?.location?.lat,
          longitude: origin?.location?.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {origin?.location && (
          <Marker
            coordinate={{
              latitude: origin?.location?.lat,
              longitude: origin?.location?.lng,
            }}
            description={origin?.description}
            pinColor="#EA3535"
          />
        )}
        {destination?.location && (
          <Marker
            coordinate={{
              latitude: destination?.location?.lat,
              longitude: destination?.location?.lng,
            }}
            description={destination?.description}
            pinColor="#3949AB"
          />
        )}

        {origin?.location && destination?.location && (
          <MapViewDirections
            origin={{
              latitude: origin?.location?.lat,
              longitude: origin?.location?.lng,
            }}
            destination={{
              latitude: destination?.location?.lat,
              longitude: destination?.location?.lng,
            }}
            onError={() => {
              dispatch(setWarningPopUpVisibleForDirectionError(true));
            }}
            apikey={GOOGLE_MAPS_APIKEYS}
            strokeWidth={5}
            strokeColor="hotpink"
          />
        )}
      </MapView>
      <View style={tw`absolute right-[15%] top-5`}>
        <MapTypeButton
          mapTypeIndex={mapTypeIndex}
          setMapTypeIndex={setMapTypeIndex}
          mapTypes={mapTypes}
        />
      </View>
    </View>
  );
};

export default Map;
