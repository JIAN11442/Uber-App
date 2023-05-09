import { Modal, Touchable, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import {
  selectComponentHeight,
  selectFavouriteTypeLists,
  selectTabBarHeight,
  setFavouriteTypeLists,
} from "../feature/useStateSlice";
import sanityClient from "../sanity";
import { useEffect } from "react";
import DynamicHeroIcons from "../DynamicHeroIcons";
import { useNavigation } from "@react-navigation/native";
import client from "../sanity";
import { selectOrigin } from "../feature/navSlice";

const FavouriteTypeLists = () => {
  const dispatch = useDispatch();
  const maxModalHeight = useSelector(selectComponentHeight);
  const tabBarHeight = useSelector(selectTabBarHeight);
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);
  const navigation = useNavigation();
  const origin = useSelector(selectOrigin);
  let count = 0;

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == 'favouriteTypes']{
      ...,
    }`
      )
      .then((data) => {
        dispatch(setFavouriteTypeLists(data));
      });
  }, []);

  const UploadDataToSanity = (item, origin) => {
    // console.log(item);
    client.create({
      _type: "favouriteLocation",
      address: origin.description,
      lat: origin.location.lat,
      lng: origin.location.lng,
    });
    client
      .fetch(
        `*[_type == 'favouriteLocation']{
      ...,
    }`
      )
      .then((data) => {
        // console.log(data);
        const nData = data.filter(
          (dt) =>
            dt.address == origin.description &&
            dt.lat == origin.location.lat &&
            dt.lng == origin.location.lng
        );
        if (nData.length > 1) {
          console.log(`-----------------`);
          console.log(`${nData[0].address} : 有${nData.length}個`);
          console.log(`分別是：`);
          nData.map((ndt) => console.log(ndt._id));
          console.log(`-----------------`);
          nData.slice(1, nData.length + 1).map((nd) =>
            client
              .delete(nd._id)
              .then(() => {
                console.log(`deleted success _id : ${nd._id}`);
              })
              .catch((err) => {
                console.error(`deleted failed _id: ${nd._id}`, err.message);
              })
          );
        }
      });

    // client.patch(item._id).append('favouriteLocation',[]);
  };

  return (
    <View>
      <View style={tw`pt-1 pb-2 bg-white`}>
        <Text style={tw`text-center text-base font-semibold`}>
          Choose your favourite lists
        </Text>
      </View>
      <View style={tw`h-[${maxModalHeight - tabBarHeight}px]`}>
        <ScrollView>
          {favouriteTypeLists &&
            favouriteTypeLists.map((item, index) => (
              <TouchableOpacity
                key={item._id}
                onPress={() => UploadDataToSanity(item, origin)}>
                <View
                  style={tw`flex-row py-3 items-center bg-white 
                ${
                  index == 0 ? `border-t border-b` : `border-b`
                } border-gray-100`}>
                  <View style={tw`mx-4`}>
                    <DynamicHeroIcons
                      type="solid"
                      icon={item.heroiconsName}
                      size={25}
                      color="gray"
                    />
                  </View>
                  <View>
                    <Text style={tw`text-base text-gray-500`}>
                      {item.favouriteTypesName}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          {/* Add new lists */}
          <View style={tw`py-3 bg-white`}>
            <TouchableOpacity
              onPress={() => navigation.navigate("addFavouriteType")}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`mx-4`}>
                  <DynamicHeroIcons
                    type="outlined"
                    icon="PlusCircleIcon"
                    size={25}
                    color="rgb(209 213 219)"
                  />
                </View>
                <View>
                  <Text style={tw`text-gray-300 text-base`}>Add new list</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default FavouriteTypeLists;
