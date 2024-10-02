import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using Material Icons
import tw from 'twrnc'; // Tailwind styling

const Search = ({onChangeText,onPress}) => {
  return (
    <View style={tw`flex-row items-center p-4 bg-[#faf9f6]`}>
      {/* Search Bar */}
      <View style={tw`flex-row items-center bg-gray-200 rounded-lg border border-[#808080] flex-1 mr-2 p-2`}>
        <Icon
          name="search"
          size={30}
          color="#888"
          style={[tw`pl-2`, { marginTop: 4 }]} // Adjust marginTop or paddingTop
        />
        <TextInput
          placeholder="Search make, models..."
          onChangeText={onChangeText}
          style={tw`flex-1 pl-2 text-lg`}
        />
      </View>

      {/* Filter Button with shadow */}
      <TouchableOpacity
        style={[
          tw`bg-blue-500 p-2 rounded-full`,
          {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5, // For Android shadow
          },
        ]}
        onPress={onPress}
      >
        <Icon name="filter-list" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Search;
