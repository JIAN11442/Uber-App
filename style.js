import { StyleSheet } from "react-native";
import { StatusBar } from "react-native";
import { Platform } from "react-native";

const styles = StyleSheet.create({
  AndroidSafeAreaStyle: {
    flex: 1,
    marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#fff",
  },
});

export default styles;
