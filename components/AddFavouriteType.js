import {
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import IconsOptionalModal from "./IconsOptionalModal";
import { Icons } from "./IconsOptionalModal";
import DynamicHeroIcons from "../DynamicHeroIcons";
import React, { useEffect, useState } from "react";
import * as Animatable from "react-native-animatable";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentIconInputValue,
  selectCurrentOnPressOptionalFavouriteType,
  selectFavouriteTypeLists,
  selectFavouriteTypeNameInputValue,
  selectIconInputTextIsFocus,
  selectIconsModalVisible,
  selectIsChosenIcon,
  selectIsChosenIconName,
  selectIsEditFavouriteType,
  setCurrentIconInputValue,
  setFavouriteTypeLists,
  setFavouriteTypeNameInputValue,
  setIconInputTextIsFocus,
  setIconsModalVisible,
  setIsChosenIcon,
  setIsChosenIconName,
  setIsEditFavouriteType,
  setModalVisible,
} from "../feature/useStateSlice";
import uuid from "react-native-uuid";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SanityClient from "../sanity";

const AddFavouriteType = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const favouriteTypeLists = useSelector(selectFavouriteTypeLists);

  const favouriteTypeNameInputValue = useSelector(
    selectFavouriteTypeNameInputValue
  );
  const currentIconInputValue = useSelector(selectCurrentIconInputValue);
  const iconsModalVisible = useSelector(selectIconsModalVisible);
  const isChosenIcon = useSelector(selectIsChosenIcon);
  const isChosenIconName = useSelector(selectIsChosenIconName);
  const iconsInputTextIsFocus = useSelector(selectIconInputTextIsFocus);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const SubmitAndWarning = () => {
    const warningMessages = [];
    let result;

    if (!isEditFavouriteType) {
      favouriteTypeLists.map((favouriteType) => {
        // 儅檢測到Name與資料庫的重複時，給予警告
        if (
          !iconsModalVisible &&
          favouriteTypeNameInputValue === favouriteType.favouriteTypesName
        ) {
          warningMessages.push("The name already exists");
        }
        // 儅檢測到輸入框中的icon不存在于選單裏時，給與警告
        if (
          !iconsModalVisible &&
          currentIconInputValue !== "" &&
          Object.keys(Icons).filter((icon) => icon === currentIconInputValue)
            .length === 0
        ) {
          warningMessages.push("The icon does not exist");
        }
        // 儅Name與icon類型都與資料庫一樣時，給予警告
        if (
          !iconsModalVisible &&
          favouriteTypeNameInputValue === favouriteType.favouriteTypesName &&
          currentIconInputValue === favouriteType.heroiconsName
        ) {
          warningMessages.push("This favouriteType already exists");
        }
      });
      // 儅一切都沒問題時，跳出submit按鈕，否則跳出警告類型
      if (
        !iconsModalVisible &&
        favouriteTypeNameInputValue !== "" &&
        isChosenIcon &&
        warningMessages.length === 0 &&
        favouriteTypeLists.length > 0
      ) {
        result = (
          <View>
            <Button
              title="submit"
              onPress={() => {
                setIsSubmitted(true);
                navigation.navigate("favouriteTypeList");
              }}
            ></Button>
          </View>
        );
      } else {
        result = [...new Set(warningMessages)].map((warningMessage, index) => (
          <View key={index} style={tw`flex-row items-center gap-x-2`}>
            <View style={tw`h-1 w-1 bg-red-400 rounded-full`}></View>
            <Text style={tw`text-sm text-red-400`}>{warningMessage}</Text>
          </View>
        ));
      }
    } else {
      if (
        favouriteTypeNameInputValue ===
          currentOnPressOptionalFavouriteType.favouriteTypesName &&
        currentIconInputValue ===
          currentOnPressOptionalFavouriteType.heroiconsName
      ) {
        result = (
          <View style={tw`flex-row items-center gap-x-2`}>
            <View style={tw`h-1 w-1 bg-red-400 rounded-full`}></View>
            <Text style={tw`text-sm text-red-400`}>
              Please Change the favouriteType Info
            </Text>
          </View>
        );
      } else {
        if (isChosenIcon) {
          result = (
            <View>
              <Button
                title="submit changes"
                onPress={() => {
                  setIsSubmitted(true);
                  navigation.navigate("favouriteTypeList");
                }}
              ></Button>
            </View>
          );
        }
      }
    }

    return result;
  };
  const IconDisplayBox = () => {
    const displayIcon = Object.keys(Icons).filter(
      (icon) => icon === currentIconInputValue
    );
    let result;

    if (displayIcon.length > 0) {
      useEffect(() => {
        dispatch(setIsChosenIconName(currentIconInputValue));
        dispatch(setIsChosenIcon(true));
      }, [currentIconInputValue]);

      result = (
        <DynamicHeroIcons
          type="solid"
          icon={currentIconInputValue}
          size={25}
          color="black"
        />
      );
    } else {
      useEffect(() => {
        dispatch(setIsChosenIcon(false));
      }, [currentIconInputValue]);

      result = (
        <DynamicHeroIcons
          type="outlined"
          icon="QuestionMarkCircleIcon"
          size={25}
          color="rgb(229,231 235)"
        />
      );
    }
    return (
      <View
        style={tw`justify-center items-center p-2 rounded-md border border-gray-200`}
      >
        {result}
      </View>
    );
  };
  const IconsListModal = () => {
    let result;
    const capitalCurrentIconInputValue =
      currentIconInputValue.charAt(0).toUpperCase() +
      currentIconInputValue.slice(1, currentIconInputValue.length);
    const similarIconsList = Object.keys(Icons).filter((icon) =>
      icon.includes(capitalCurrentIconInputValue)
    );

    if (iconsModalVisible && similarIconsList.length > 0) {
      result = (
        <Animatable.View animation={"fadeIn"} duration={1000}>
          <ScrollView style={tw`px-1 mt-3 mb-28`}>
            <View style={tw`flex-row flex-wrap gap-x-2 gap-y-2`}>
              {similarIconsList.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    dispatch(setIconsModalVisible(false));
                    dispatch(setIsChosenIcon(true));
                    dispatch(setIconInputTextIsFocus(false));
                    dispatch(setIsChosenIconName(icon));
                  }}
                >
                  <DynamicHeroIcons
                    icon={icon}
                    type="solid"
                    size={30}
                    color="black"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animatable.View>
      );
    } else if (iconsModalVisible && similarIconsList.length === 0) {
      result = (
        <View style={tw`mt-12 items-center justify-center gap-y-2`}>
          <DynamicHeroIcons
            type="outlined"
            icon="ExclamationCircleIcon"
            size={60}
            color="rgb(209,213,219)"
          />
          <Text style={tw`text-gray-400`}>The icon cannot be found</Text>
        </View>
      );
    }
    return result;
  };
  const isEditFavouriteType = useSelector(selectIsEditFavouriteType);
  const currentOnPressOptionalFavouriteType = useSelector(
    selectCurrentOnPressOptionalFavouriteType
  );

  useFocusEffect(
    React.useCallback(() => {
      // console.log(`isEditFavouriteType : ${isEditFavouriteType}`);
      if (isEditFavouriteType) {
        return undefined;
      } else {
        dispatch(setIsChosenIcon(false));
        dispatch(setIconInputTextIsFocus(false));
        setIsSubmitted(false);

        dispatch(setFavouriteTypeNameInputValue(""));
        dispatch(setCurrentIconInputValue(""));
        dispatch(setIsChosenIconName(""));
      }
    }, [isEditFavouriteType])
  );

  // Dispatch New Object To [favouriteTypeList] when button is submitted
  useEffect(() => {
    if (isSubmitted) {
      // get capital favouriteTypesName
      const capitalFavouriteTypesName =
        favouriteTypeNameInputValue.charAt(0).toUpperCase() +
        favouriteTypeNameInputValue.slice(
          1,
          favouriteTypeNameInputValue.length
        );
      // get capital IconInputName
      const capitalCurrentIconInputValue =
        currentIconInputValue.charAt(0).toUpperCase() +
        currentIconInputValue.slice(1, currentIconInputValue.length);

      if (!isEditFavouriteType) {
        // Create New FavouriteType To Sanity and Redux After Submitted
        const uploadFavouriteTypeToSanity = {
          _id: uuid.v4(),
          _type: "favouriteTypes",
          favouriteTypesName: capitalFavouriteTypesName,
          heroiconsName: capitalCurrentIconInputValue,
          status: true,
        };
        const submitFavouriteType = [
          ...new Set(favouriteTypeLists),
          uploadFavouriteTypeToSanity,
        ];
        SanityClient.create(uploadFavouriteTypeToSanity);
        dispatch(setFavouriteTypeLists(submitFavouriteType));
      } else {
        // Change FavouriteType To Sanity and Redux After Submitted
        const targetIndex = favouriteTypeLists.findIndex(
          (favouriteType) =>
            favouriteType._id === currentOnPressOptionalFavouriteType._id
        );
        // Refresh In Sanity
        const updatedFavouriteTypeInfoToSanity = {
          favouriteTypesName: capitalFavouriteTypesName,
          heroiconsName: capitalCurrentIconInputValue,
        };

        SanityClient.patch(currentOnPressOptionalFavouriteType._id)
          .set(updatedFavouriteTypeInfoToSanity)
          .commit()
          .then((response) => {
            console.log("favouriteType updated successfully : ", response);
          })
          .catch((error) => {
            console.log(`Error updating data : `, error);
          });

        // Refresh In Redux
        const updatedFavouriteTypeInfo = [...favouriteTypeLists];
        updatedFavouriteTypeInfo[targetIndex].favouriteTypesName =
          capitalFavouriteTypesName;
        updatedFavouriteTypeInfo[targetIndex].heroiconsName =
          capitalCurrentIconInputValue;

        dispatch(setFavouriteTypeLists(updatedFavouriteTypeInfo));
      }
      setIsSubmitted(false);
    }
  }, [isSubmitted, isEditFavouriteType]);

  useEffect(() => {
    dispatch(setCurrentIconInputValue(isChosenIconName));
  }, [isChosenIconName]);

  useEffect(() => {
    const currentFavouriteTypesName =
      currentOnPressOptionalFavouriteType.favouriteTypesName;
    const currentHeroIconsName =
      currentOnPressOptionalFavouriteType.heroiconsName;

    if (isEditFavouriteType) {
      dispatch(setFavouriteTypeNameInputValue(currentFavouriteTypesName));
      dispatch(setCurrentIconInputValue(currentHeroIconsName));
    }
  }, [isEditFavouriteType]);

  return (
    <View>
      {/* Title */}
      <View style={tw`pt-1 pb-2 bg-white border-b border-gray-50`}>
        {!isEditFavouriteType ? (
          <Text style={tw`text-center text-base font-semibold`}>
            Create New Favourite Type
          </Text>
        ) : (
          <Text style={tw`text-center text-base font-semibold`}>
            Change your Favourite Type
          </Text>
        )}
      </View>

      {/* Create PlatForm */}
      <View
        style={tw`bg-white h-[250px] ${
          iconsModalVisible ? "gap-y-3" : "justify-center gap-y-5"
        } `}
      >
        {/* FavouriteType Name */}
        <View style={tw`mx-4 ${iconsModalVisible ? "flex-0" : ""}`}>
          <TextInput
            onFocus={() => {
              setIsSubmitted(false);
            }}
            onChangeText={(inputText) => {
              dispatch(setFavouriteTypeNameInputValue(inputText));
            }}
            value={favouriteTypeNameInputValue}
            placeholder="Name"
            style={tw`px-4 py-2 border border-gray-200 rounded-md text-base
            ${iconsModalVisible ? "py-0 border-0" : ""}`}
          />
        </View>

        {/* FavouriteType Icon List */}
        <View style={tw`mx-4 relative`}>
          <View style={tw`flex-row gap-x-2`}>
            {/* Icons Display After Chosen */}
            <IconDisplayBox />
            {/* Icon Text Input */}
            <View style={tw`flex-1`}>
              <TextInput
                placeholder="Choose An Icon"
                value={
                  isChosenIcon && !iconsInputTextIsFocus
                    ? `${isChosenIconName}`
                    : `${currentIconInputValue}`
                }
                onFocus={() => {
                  dispatch(setIconsModalVisible(true));
                  dispatch(setIconInputTextIsFocus(true));
                  // dispatch(setIsChosenIcon(""));
                }}
                onChangeText={(inputText) => {
                  dispatch(setCurrentIconInputValue(inputText));
                }}
                style={tw`${
                  isChosenIcon ? "pl-4 pr-12" : "pl-4"
                } py-2 border border-gray-200 rounded-md text-base`}
              />
            </View>
            {/* ChevronDownIcon || ChevronUpIcon */}
            <TouchableOpacity
              onPress={() => {
                dispatch(setIconsModalVisible(!iconsModalVisible));
                dispatch(setIsChosenIcon(false));
              }}
              style={tw`absolute right-2 p-1 h-full items-center justify-center`}
            >
              <DynamicHeroIcons
                icon={!iconsModalVisible ? "ChevronDownIcon" : "ChevronUpIcon"}
                type="solid"
                size={15}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {/* Icons Modal */}
          <IconsListModal />
        </View>

        {/* Submit Button And Warning Text */}
        {!isSubmitted && (
          <View style={tw`mx-4`}>
            <SubmitAndWarning />
          </View>
        )}
      </View>
    </View>
  );
};

export default AddFavouriteType;
