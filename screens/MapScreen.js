import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import { selectOrigin } from "../feature/navSlice";
import styles from "../style";
import tw from "twrnc";
import { useState } from "react";
import MapTypeButton from "../components/MapTypeButton";

const MapScreen = () => {
  const origin = useSelector(selectOrigin);
  const mapTypes = ["terrain", "satellite", "hybrid"];
  const [mapTypeIndex, setMapTypeIndex] = useState(0);

  return (
    <View style={styles.AndroidSafeAreaStyle}>
      <View style={tw`relative flex-1`}>
        <MapView
          style={tw`flex-1`}
          mapType={mapTypes[mapTypeIndex]}
          initialRegion={{
            // latitude: origin.location.lat,
            // longitude: origin.location.lng,
            latitude: 1.918339,
            longitude: 103.1799611,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}>
          <Marker
            coordinate={{
              // latitude: origin.location.lat,
              // longitude: origin.location.lng,
              latitude: 1.918339,
              longitude: 103.1799611,
            }}
            description={origin.description}
          />
        </MapView>
        <View style={tw`absolute right-[20%] top-5`}>
          <MapTypeButton
            mapTypeIndex={mapTypeIndex}
            setMapTypeIndex={setMapTypeIndex}
            mapTypes={mapTypes}
          />
        </View>
      </View>
      <View style={tw`flex-1`}></View>
    </View>
  );
};

export default MapScreen;
