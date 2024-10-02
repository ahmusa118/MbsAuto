import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import IonIcons from 'react-native-vector-icons/Ionicons'
const Contact = () => {

  return (
    <View>
 <TouchableOpacity style={[styles.contactButton,tw`bg-blue-500 rounded-full p-3`]} onPress={() => alert('Contact pressed')}>
       <IonIcons name='man-outline' color='white' size={30} />
    </TouchableOpacity>
    </View>
  )
  
}
export default Contact