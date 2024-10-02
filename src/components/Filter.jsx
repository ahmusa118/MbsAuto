import React, { useState } from 'react';
import { Modal, View,Text,TextInput,Button,StyleSheet,TouchableOpacity,ScrollView} from 'react-native';
import tw from 'twrnc'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {Picker} from '@react-native-picker/picker';
const Filter = ({ visible, onSearch, onCancel }) => {

  const [make, setMake] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [categorage,setCategorage]=useState(false)
  const [mileage, setMileage] = useState(['', '']);
  const [price, setPrice] = useState(['', '']);
  const [used,setUsed]=useState('')
  const [usage,setUsage]=useState(false)
 const [model,setModel]=useState('')
const filters = {
  make,
  location,
  category,
  mileage,
  price,
  model,
  used
};
const isSearchDisabled = !(make || model || location || category || mileage[0] || mileage[1] || price[0] || price[1] || used);
// Remove empty or null fields from the filters object

const handlesearch=()=>{

  onSearch(filters)
setMake('')
setLocation('')
setCategory('')
setMileage('')
setPrice('')
setModel('')
setUsed('')
  onCancel()
  
}


return (
  <Modal
    animationType="slide"
    visible={visible}
    onOk={handlesearch}
    onRequestClose={onCancel}
    transparent={true}
    destroyOnClose
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ScrollView>
          <View style={tw`mt-10`}>
            <Text style={styles.label}>Make:</Text>
            <TextInput style={styles.input} type="text" value={make} onChangeText={setMake} />
          </View>

          <View>
            <Text style={styles.label}>Model:</Text>
            <TextInput style={styles.input} type="text" value={model} onChangeText={setModel} />
          </View>

          <View>
            <Text style={styles.label}>Location:</Text>
            <TextInput style={styles.input} type="text" value={location} onChangeText={setLocation} />
          </View>

          <View style={tw`mb-2`}>
            <Text style={styles.label}>Category:</Text>
            <View style={tw`flex flex-row items-center border p-1 rounded border-[#ccc]`}>
              <MaterialIcons
                name={categorage ? 'arrow-forward' : 'arrow-downward'}
                style={tw``}
                onPress={() => setCategorage(!categorage)}
                size={20}
              />
              <Text style={tw`ml-2 text-base`}>{category ? category : ''}</Text>
            </View>
            {categorage && (
              <Picker
                selectedValue={category}
                onValueChange={(itemValue, itemIndex) => {
                  setCategory(itemValue);
                  setCategorage(false);
                }}
              >
                <Picker.Item label="--" value="" />
                <Picker.Item label="Sedan" value="Sedan" />
                <Picker.Item label="SUV" value="SUV" />
                <Picker.Item label="Bus" value="Bus" />
                <Picker.Item label="Pick-up Truck" value="Pick-up Truck" />
                <Picker.Item label="Motorcycle" value="Motorcycle" />
                <Picker.Item label="Hatchback" value="Hatchback" />
                <Picker.Item label="Coupe" value="Coupe" />
                <Picker.Item label="Station Wagon" value="Station Wagon" />
                <Picker.Item label="Mini Van" value="Mini Van" />
                <Picker.Item label="Hybrid" value="Hybrid" />
              </Picker>
            )}
          </View>
           
       

          <View style={tw`mb-2`}>
            <Text style={styles.label}>Usage:</Text>
            <View style={tw`flex flex-row items-center border p-1 rounded border-[#ccc]`}>
              <MaterialIcons
                name={usage ? 'arrow-forward' : 'arrow-downward'}
                style={tw``}
                onPress={() => setUsage(!usage)}
                size={20}
              />
              <Text style={tw`ml-2 text-base`}>{used ? used : ''}</Text>
            </View>
            {usage && (
              <Picker
                selectedValue={used}
                onValueChange={(itemValue, itemIndex) => {
                  setUsed(itemValue);
                  setUsage(false);
                }}
              >
                <Picker.Item label="--" value="" />
                <Picker.Item label="Brand New" value="Brand New" />
                <Picker.Item label="Foreign Used" value="Foreign Used" />
                <Picker.Item label="Nigerian Used" value="Nigerian Used" />
              </Picker>
            )}
          </View>

          <View>
            <Text style={styles.label}>Mileage (from):</Text>
            <TextInput style={styles.input} type="number" value={mileage[0]} onChangeText={(e) => setMileage([e, mileage[1]])} />
          </View>

          <View>
            <Text style={styles.label}>Mileage (to):</Text>
            <TextInput style={styles.input} type="number" value={mileage[1]} onChangeText={(e) => setMileage([mileage[0], e])} />
          </View>

          <View>
            <Text style={styles.label}>Price (from):</Text>
            <TextInput style={styles.input} type="number" value={price[0]} onChangeText={(e) => setPrice([e, price[1]])} />
          </View>

          <View>
            <Text style={styles.label}>Price (to):</Text>
            <TextInput style={styles.input} type="number" value={price[1]} onChangeText={(e) => setPrice([price[0], e])} />
          </View>

          <View style={tw`flex flex-row justify-between`}>
            <TouchableOpacity style={tw`border p-2 rounded border-[#848484]`} onPress={onCancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            {!isSearchDisabled && (
              <TouchableOpacity style={tw`border p-2 rounded border-[#848484]`} onPress={handlesearch}>
                <Text>Search</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  </Modal>
)

}

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center', // Center vertically
      alignItems: 'center', // Center horizontally
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%', // Adjust width as needed
    },
    label: {
      marginBottom: 5,
      fontWeight: 'bold',
    },
    input: {
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
    },
  });
export default Filter;
