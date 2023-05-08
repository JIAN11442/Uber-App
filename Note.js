import { useEffect, useState } from "react";
import { Dimensions, Modal, StatusBar, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import tw from "twrnc";
import client from "../sanity";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import { MinusCircleIcon } from "react-native-heroicons/outline";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FavouriteTypeLists from "./FavouriteTypeLists";

const AddFavouritesModal = ({ addFavourites, setAddFavourites, visible }) => {
  const [favouriteTypes, setFavouriteTypes] = useState(null);
  const [isScrollViewVisible, setScrollViewVisible] = useState(false);
  const [devideWidth, setDevideWidth] = useState(0);
  const [devideHeight, setDevideHeight] = useState(0);
  const devideWidthCenterPoint = devideWidth / 2;
  const devideHeightCenterPoint = (devideHeight - StatusBar.currentHeight) / 2;
  const [popUpWidth, setPopUpWidth] = useState(0);
  const [popUpHeight, setPopUpHeight] = useState(0);
  const popUpWidthCenterPoint = popUpWidth / 2;
  const popUpHeightCenterPoint = popUpHeight / 2;
  const maxPopUpHeight = 400;

  const closeModal = () => {
    setAddFavourites(false);
  };

  useEffect(() => {
    client
      .fetch(
        `
    *[_type == 'favouriteTypes'] {
            ...,
          }`
      )
      .then((data) => {
        setFavouriteTypes(data);
      });

    const { width, height } = Dimensions.get("window");
    setDevideWidth(width);
    setDevideHeight(height);
  }, []);

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setPopUpWidth(width);
    setPopUpHeight(height);
    setScrollViewVisible(height >= maxPopUpHeight);

    console.log(`popUpHeight : ${popUpHeight}`);
    console.log(`maxPopUpHeigh : ${maxPopUpHeight}`);
    console.log(`isScrollViewVisible : ${isScrollViewVisible}`);
    console.log(`--------------------`);
  };

  const Stack = createStackNavigator();
  
  // -----------------------------------------------------------

<Modal visible={visible} transparent={true} onRequestClose={closeModal}>
  <View
    onLayout={onLayout}
    style={tw`${
      isScrollViewVisible ? `h-[${maxPopUpHeight}px]` : ``
    } rounded-lg pt-4 pb-2 px-8 shadow-lg bg-white absolute
            top-[${devideHeightCenterPoint - popUpHeightCenterPoint}px] left-[${
      devideWidthCenterPoint - popUpWidthCenterPoint
    }px]`}
  >
    <View style={tw`pb-2`}>
      <Text style={tw`text-base font-bold text-center`}>
        Choose your favourite lists
      </Text>
      <View>
        {favouriteTypes.map((type) => (
          <View key={type._id} style={tw`py-2 border-t border-gray-100`}>
            <TouchableOpacity onPress={closeModal}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`flex-0.6`}>
                  <DynamicHeroIcons
                    icon={type.heroiconsName}
                    color="gray"
                    size={22}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-base`}>{type.favouriteTypesName}</Text>
                </View>
                <TouchableOpacity>
                  <View style={tw`opacity-50`}>
                    <MinusCircleIcon size={22} color="gray" />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        <View style={tw`pt-4 pb-2 border-t border-gray-100`}>
          <TouchableOpacity>
            <View style={tw`flex-row items-center`}>
              <View style={tw`flex-0.6 pr-3`}>
                <PlusCircleIcon size={22} color="#00CCBB" />
              </View>
              <View>
                <Text style={tw`text-base text-gray-400`}>Add New List</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
</Modal>;
// -------------------------------------
<View style={tw`flex-1 absolute w-60 h-50 top-[60%] left-[30%]`}>
            <Stack.Navigator
                screenOptions={{
                  backgroundColor: "red",
                }}
              >
                <Stack.Screen
                  name="favouriteListModal"
                  component={FavouriteListModal}
                  options={{
                    headerShown: false,
                    cardStyle: {
                      borderRadius: 100,
                      backgroundColor: "red",
                      padding: 10,
                    },
                  }}
                  initialParams={{
                    addFavourites: selectAddFavouriteType,
                    visible: selectAddFavouriteType,
                  }}
                />
              </Stack.Navigator>
            </View>