import { useEffect, useState } from "react";
import { Modal } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import tw from "twrnc";
import client from "../sanity";

const AddFavouritesModal = ({ addFavourites, setAddFavourites, visible }) => {
  const [favouriteTypes, setFavouriteTypes] = useState(null);
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

  console.log(favouriteTypes);

  return (
    <>
      {favouriteTypes && (
        <Modal transparent={true} visible={visible} onRequestClose={closeModal}>
          <View
            onStartShouldSetResponder={closeModal}
            style={tw`flex-1 justify-center items-center bg-[#ffffff4a]`}
          >
            <View style={tw`w-30 h-50 p-3 rounded-lg`}>
              <Text>Favourites</Text>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default AddFavouritesModal;
