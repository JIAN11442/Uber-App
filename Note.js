<Modal transparent={true} visible={visible} onRequestClose={closeModal}>
  <View
    onStartShouldSetResponder={closeModal}
    style={tw`flex-1 justify-center items-center bg-[#ffffff4a]`}
  >
    <View style={tw`px-8 pb-5 rounded-lg bg-white shadow-lg`}>
      <Text style={tw`text-center text-base font-bold pt-4 pb-2`}>
        Choose your favourite lists
      </Text>
      <View
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          // console.log(height);
          setScrollViewVisible(height > 85);
        }}
        style={(event) => {
          const { height } = event.nativeEvent.layout;
          tw`h-[${height}px]`;
        }}
      >
        {!isScrollViewVisible && (
          <>
            {favouriteTypes.map((type) => (
              <TouchableOpacity
                key={type._id}
                style={tw`border-t border-gray-200 flex-row items-center py-1`}
              >
                <DynamicHeroIcons
                  icon={type.heroiconsName}
                  color="gray"
                  size={22}
                  style={tw`mr-10`}
                />
                <Text style={tw`text-center py-2`}>
                  {type.favouriteTypesName}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {isScrollViewVisible && (
          <ScrollView>
            {favouriteTypes.map((type) => (
              <TouchableOpacity
                key={type._id}
                style={tw`border-t border-gray-200 flex-row items-center py-1`}
              >
                <DynamicHeroIcons
                  icon={type.heroiconsName}
                  color="gray"
                  size={22}
                  style={tw`mr-10`}
                />
                <Text style={tw`text-center py-2`}>
                  {type.favouriteTypesName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  </View>
</Modal>;
