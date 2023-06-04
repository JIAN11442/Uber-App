import { TouchableOpacity, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import { selectFavouriteTypeLists } from "../feature/useStateSlice";
import React, { useEffect, useRef } from "react";
import DynamicHeroIcons from "../DynamicHeroIcons";
import SwitchButton from "./SwitchButton";

const FavouriteTypeModal = () => {
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);

  return (
    <View>
      <View style={tw`pt-1 pb-2 bg-white relative`}>
        <Text style={tw`text-center text-base font-semibold `}>
          Active Your FavouriteType
        </Text>
      </View>

      <View style={tw`h-[250px]`}>
        <ScrollView>
          {favouriteTypeLists &&
            favouriteTypeLists.map((item, index) => (
              // FavouriteType
              <View key={item._id}>
                <View
                  style={tw`flex-row relative items-center justify-center bg-white ${
                    index == 0 ? `border-t border-b` : `border-b`
                  } border-gray-100`}
                >
                  {/* FavouriteType Icon & Text */}
                  <TouchableOpacity style={tw`flex-1`}>
                    <View style={tw`flex-row py-3 items-center`}>
                      {/* FavouriteType Icon */}
                      <View style={tw`mx-4`}>
                        <DynamicHeroIcons
                          type="solid"
                          icon={item.heroiconsName}
                          size={25}
                          color="gray"
                        />
                      </View>
                      {/* FavouriteType Text */}
                      <View>
                        <Text style={tw`text-base text-gray-500`}>
                          {item.favouriteTypesName}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={tw`px-4 h-[50px] justify-center items-center`}>
                    <SwitchButton width="11" height="6" item={item} />
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default FavouriteTypeModal;
