import { useEffect, useState } from "react";
import { Dimensions, Modal, StatusBar, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import tw from "twrnc";
import client from "../sanity";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { HomeIcon } from "react-native-heroicons/outline";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import { ScrollView } from "react-native";

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
  const maxPopUpHeight = 150;

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

  // console.log(favouriteTypes);

  return (
    <>
      {favouriteTypes && (
        <Modal visible={visible} transparent={true} onRequestClose={closeModal}>
          <View
            onLayout={onLayout}
            style={tw`${
              isScrollViewVisible ? `h-[${maxPopUpHeight}px]` : ``
            } rounded-lg py-5 px-8 shadow-lg bg-white absolute
            top-[${devideHeightCenterPoint - popUpHeightCenterPoint}px] left-[${
              devideWidthCenterPoint - popUpWidthCenterPoint
            }px]`}
          >
            <View style={tw`pb-2`}>
              <Text style={tw`text-base font-bold text-center`}>
                Choose your favourite lists
              </Text>
            </View>
            {isScrollViewVisible ? (
              <ScrollView>
                <View>
                  {favouriteTypes.map((type) => (
                    <View
                      key={type._id}
                      style={tw`py-2 border-t border-gray-100`}
                    >
                      <TouchableOpacity onPress={closeModal}>
                        <View style={tw`flex-row items-center`}>
                          <DynamicHeroIcons
                            icon={type.heroiconsName}
                            color="gray"
                            size={22}
                            style={tw`mr-10`}
                          />
                          <Text style={tw`text-center text-base `}>
                            {type.favouriteTypesName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <>
                <View>
                  {favouriteTypes.map((type) => (
                    <View
                      key={type._id}
                      style={tw`py-2 border-t border-gray-100`}
                    >
                      <TouchableOpacity onPress={closeModal}>
                        <View style={tw`flex-row items-center`}>
                          <DynamicHeroIcons
                            icon={type.heroiconsName}
                            color="gray"
                            size={22}
                            style={tw`mr-10`}
                          />
                          <Text style={tw`text-center text-base `}>
                            {type.favouriteTypesName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </Modal>
      )}
    </>
  );
};

export default AddFavouritesModal;
