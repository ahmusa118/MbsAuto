import React, { useState, useEffect } from 'react';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, FlatList, Image,ScrollView,StyleSheet,Alert, TouchableOpacity,Dimensions,Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc'
import { Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons' 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons' 
import Carousel from 'react-native-snap-carousel';
const Searchresult = ({route}) => {

  const { width: screenWidth } = Dimensions.get('window');
    const [currentPage, setCurrentPage] = useState(1);
const [loading,setLoading]=useState(false)
const Navigation=useNavigation()
const [data,setData]=useState(route.params.state)
const hc=(key)=>{

    Navigation.navigate('Result',{state:key})
      }
      const deleteBookmark = async (email, reqno) => {

        const response = await fetch(`https://mangaautomobiles.com/api/delete/${email}/${reqno}`, {
          method: 'DELETE'
        });
        const data = await response.json();
      
        if (response.ok) {
          // Handle success response
          Alert.alert(data.success); // You can log or handle the response data here
          return data; // You can return the data if needed
        } else {
          // Handle error response
          throw new Error(data.error || 'Failed to delete bookmark');
        }
      };
      const hp=async(key)=>{

        try {
         const data=await AsyncStorage.getItem('username')
         if(data==null){
          Alert.alert('Please Login')
         }
         else{
        try {
        
        const data2=await fetch(`https://mangaautomobiles.com/api/save/${data}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(key),
        })
        const response=await  data2.json() 
        
        
        
        
        
        
        if(response.success){
        
          Alert.alert(response.success)
        }else if (response.alert) {
          // Show a custom alert with "Yes" and "No" options
          Alert.alert(
            'Remove from bookmarks?',
            response.alert,
            [
              {
                text: 'Yes',
                onPress: () => {
                  
                  deleteBookmark(data,key.requestno)
                },
              },
              {
                text: 'No',
                onPress: () => {
                  // Do nothing or handle the "No" option
                  console.log('User pressed No');
                },
                style: 'cancel',
              },
            ],
            { cancelable: false }
          )
        }
        
        else {
          console.log(response)
          Alert.alert(response.error)
        }
        } catch (error) {
          console.log(error)
         Alert. alert('Internal server errors')
        }
        
        }
        } catch (error) {
          console.log(error)
          Alert.alert('Internal server Errors')
        }
        }

      const fetchData = async (page) => {
        // Fetch data for the specified page
        // You need to implement the logic to fetch data based on the page number
 
            try {
              const response = await fetch(`https://mangaautomobiles.com/api/search?page=${page}`,{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: route.params.filter,
              });
              const data = await response.json();
      
              if (response.ok) {
                setData(data);
              } else {
                console.error(`Error fetching data`);
              }
            } catch (error) {
              console.error('Error fetching data', error);
            }
          
      }

      const handlePrevPage = () => {
        if (currentPage > 1) {
          const prevPage = currentPage - 1;
          setCurrentPage(prevPage);
          fetchData(prevPage);
        }
      };
    
      const handleNextPage = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchData(nextPage);
      }
       
     
      const renderItem = ({ item }) => {
 
        return(
        <TouchableOpacity disabled={item.status === 'Sold'}  onPress={()=>hc(item.details)} style={tw`relative flex items-center justify-center`}>
    
          <FastImage
            source={{ uri: `https://mangaautomobiles.com/api/indcar/${item.image}` }} 
            style={{ width: screenWidth, height: 400, resizeMode: 'cover' }} 
          />
       
    
       
        </TouchableOpacity >)
    }
       
  return (
    <View style={tw`  h-full`}>
                  

    {loading? <View><Text>loading</Text></View>: <FlatList
       data={data}
      
       renderItem={({ item }) => (
   
<View >

<Card containerStyle={[styles.cardShadow, { padding: 0 },tw``]}>
          <TouchableOpacity  >
          <Card.Image
    source={{ uri: `https://mangaautomobiles.com/api/indcar/${item.images[0]}` }}
    onPress={()=>hc(item)}
    style={[{ width: '100%',  height: 400, resizeMode: 'cover' }, tw`rounded-md`]} // Ensure height is set as needed
    resizeMode="cover" // Image will cover the entire area, maintaining aspect ratio
  />
  </TouchableOpacity>
  <Text style={[tw`pt-4 pl-4 text-base text-[#808080]`, { marginBottom: 2, fontFamily: 'Netflix Sans Light' }]}>
    {item.requestno}
  </Text>
  <Text style={[{fontFamily:'Netflix Sans Medium'},tw`pl-4 text-2xl`]}>
    {item.year} {item.make} {item.model}
  </Text>
  <Text style={[{fontFamily:'Netflix Sans Light'},tw`pl-4 text-base`]}>
<Text style={tw``}>Location: </Text>{item.location}
  </Text>

  <Text style={[{fontFamily:'Netflix Sans Light'},tw`pl-4 text-base `]}>
  <Text style={tw``}>Vehicle Status: </Text> {item.state=='Pending'?<Text style={[tw`text-[#32CD32]`,{fontFamily:'Netflix Sans Bold'}]}>Available</Text>:item.state}
  </Text>

  <View style={tw`pl-4 pb-4`}>
  <View style={tw`flex-row  gap-32`}>
    {/* Table Headings */}
    <Text style={[{ fontFamily: 'Netflix Sans Medium' }, tw`text-base`]}>Price:</Text>
    <Text style={[{ fontFamily: 'Netflix Sans Medium' }, tw`text-base`]}>Transmission:</Text>
  </View>

  <View style={tw`flex-row gap-20`}>
    {/* Table Items */}
    <Text style={[{ fontFamily: 'Netflix Sans Light' }, tw`text-base`]}>₦ {item.price.toLocaleString()}</Text>
    <Text style={[{ fontFamily: 'Netflix Sans Light' }, tw`text-base`]}>{item.transmission}</Text>
  </View>
  <TouchableOpacity 
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: '#93c5fd', // Green background
          paddingVertical: 7, 
          paddingHorizontal: 10, 
          borderRadius: 5, 
          alignSelf: 'flex-start' // Position to the left
        }} 
        onPress={() => hp(item)}
      >
        <Icon name="check" size={20} color="#fff" style={{ marginRight: 5 }} />
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
      </TouchableOpacity>
</View>

</Card>
     




</View>

       )}
       keyExtractor={(item, index) => index.toString()}
       ListFooterComponent={
         <View style={styles.footerContainer}>
         {currentPage<=1?'':
         <>
         <TouchableOpacity  onPress={()=>setCurrentPage(1)}>
           <Text style={[tw``,styles2.text]}>
             Back to first page
           </Text>
         </TouchableOpacity>
         <TouchableOpacity
       
       style={[styles.button, loading && styles.disabledButton]}
         onPress={() => handlePrevPage()}
         
       >
           <LinearGradient
             colors={['#2c3e50', '#34495e', '#2c3e50']} 
             style={styles.gradientButton}
           >
             <MaterialIcons name='arrow-back' color={`#fff`} size={20}/>
     
           </LinearGradient>
          </TouchableOpacity>
          
          </>
          }
          <Text style={[styles.pageNumber]}>{currentPage}</Text>
       {
         <>

        {data.length<3?null:<TouchableOpacity
         title="Front"
         style={[styles.button, loading && styles.disabledButton]}
         onPress={() => handleNextPage ()}
        
       >
         <LinearGradient
             colors={['#2c3e50', '#34495e', '#2c3e50']} 
             style={styles.gradientButton}
           >
                 <MaterialIcons name='arrow-forward' color={`#fff`} size={20}/>
           </LinearGradient>


       </TouchableOpacity>}
       </>
       }
       </View>
     }
       // Add pagination controls if needed
     />}

 </View>
  )
}



const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    padding: 10,
  marginBottom:100
  },
  button: {
    marginHorizontal: 10,
  },
  gradientButton: {
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    textAlign: 'center',
  },
  pageInput: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    width: 60,
    marginHorizontal: 10,
    fontSize: 16,
  },
  pageText: {
    color: '#fff',
    fontSize: 16,
  },
  container: {
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    zIndex: 1,  
  },
  textconatainer:{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    zIndex: 1,  
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff', // Background color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    marginLeft: 5,
    color: '#008000', // Text color
    fontSize: 15,
  },
  callButton: {
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#fff', // Background color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    ...tw`border border-[#808080] rounded px-10 py-1`, // Include tailwind styles
  },
  buttonText2: {
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    color: '#ff0000', // Text color
    fontSize: 15,
    ...tw`flex-row gap-2`, // Include tailwind styles
  },
  quicksandLight: {
    fontFamily: 'QuicksandLight',
    fontSize: 20,
  },
  quicksandRegular: {
    fontFamily: 'QuicksandRegular',
    color:"#848484"
  },
});

const styles2 = StyleSheet.create({
  text: {
    // Add the following lines to add fonts in your Text component
    fontFamily: 'Quicksand',
   
  
  },
  container: {
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    zIndex: 1,  
  },
  container2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    zIndex: 1,  
  }

})
export default Searchresult