import { StyleSheet } from "react-native";
import { StatusBar } from "react-native";
import { Platform } from "react-native";

const styles = StyleSheet.create({
  AndroidSafeAreaStyle: {
    flex: 1,
    marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#fff",
  },
  AutoCompletedStyleForForm: {
    container: {
      flex: 0,
    },
    textInput: {
      fontSize: 18,
      height: 45,
      // borderWidth: 1,
      // borderColor: "#DDDDDF",
    },
    textInputContainer: {
      paddingRight: 35,
    },
  },
  AutoCompletedStyleForTo: {
    container: {
      flex: 0,
      paddingTop: 15,
      backgroundColor: "white",
    },
    textInput: {
      fontSize: 18,
      height: 45,
      backgroundColor: "#DDDDDF",
    },
    textInputContainer: {
      paddingHorizontal: 20,
    },
  },
});

export default styles;
