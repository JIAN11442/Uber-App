import { StatusBar, Text, View } from "react-native";
import { GoogleMap, LoadScript, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_APIKEYS } from "@env";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { selectOrigin } from "../feature/navSlice";

const MapScreen = () => {
  // const { isLoaded } = useJsApiLoader({
  //   id: "google-map-script",
  //   googleMapsApiKey: { GOOGLE_MAPS_APIKEYS },
  //   libraries: ["places"],
  //   language: "en",
  // });

  // const origin = useSelector(selectOrigin);

  return (
    <View>
      <View>
        {/* <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_APIKEYS}
          libraries={["places"]}
          language="en"
        >
          <GoogleMap
            mapContainerStyle={{
              height: "400px",
              width: StatusBar.currentWidth,
            }}
            zoom={10}
            center={{
              lat: 1.918339,
              lng: 103.1799611,
            }}
            options={{}}
          />
        </LoadScript> */}

        {/* {Platform.OS === "web" && isLoaded && (
          <GoogleMap
            mapContainerStyle={{
              height: "400px",
              width: StatusBar.currentWidth,
            }}
            zoom={10}
            center={{
              // lat: origin.lat,
              // lng: origin.lng,
              lat: 1.918339,
              lng: 103.1799611,
            }}
          />
        )} */}
      </View>
    </View>
  );
};

export default MapScreen;
