import { View } from "react-native";
import Map from "../components/Map";
import tw from "twrnc";
import styles from "../style";
import { createStackNavigator } from "@react-navigation/stack";
import NavigateCard from "../components/NavigateCard";
import RideOptionsCard from "../components/RideOptionsCard";

const MapScreen = () => {
  const Stack = createStackNavigator();
  return (
    <View style={styles.AndroidSafeAreaStyle}>
      <View style={tw`flex-1`}>
        <Map />
      </View>
      <View style={tw`flex-1`}>
        <Stack.Navigator>
          <Stack.Screen
            name="navigateCard"
            component={NavigateCard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RideOptions"
            component={RideOptionsCard}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </View>
    </View>
  );
};

export default MapScreen;
