import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  AndroidSafeAreaStyle: {
    flex: 1,
    marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
  },
});

export default styles;
