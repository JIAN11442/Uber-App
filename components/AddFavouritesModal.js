import { useEffect, useState } from "react";
import { Modal, TouchableOpacity } from "react-native";
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
  }, []);

  // console.log(favouriteTypes);

  return (
    <>
      {favouriteTypes && (
        <Modal visible={visible} transparent={true} onRequestClose={closeModal}>
          <View style={tw`rounded-lg py-5 px-8 shadow-lg bg-white absolute`}>
            <View style={tw`pb-2`}>
              <Text style={tw`text-base font-bold text-center`}>
                Choose your favourite lists
              </Text>
            </View>
            <ScrollView>
              <View>
                {favouriteTypes.map((type) => (
                  <View
                    key={type._id}
                    style={tw`py-2 border-t border-gray-100`}
                  >
                    <TouchableOpacity>
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
          </View>
        </Modal>
      )}
    </>
  );
};

export default AddFavouritesModal;
