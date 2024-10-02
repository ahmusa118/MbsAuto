import { View, Text, TouchableOpacity, FlatList, Dimensions, ScrollView, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import FastImage from 'react-native-fast-image';
import tw from 'twrnc';
import { Drawer, DrawerGroup, DrawerItem, Icon, IconElement } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@rneui/themed';
import Lightbox from 'react-native-lightbox-v2';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { DataTable } from 'react-native-paper';
const Result = ({ route }) => {
  const [data, setData] = useState(route.params.state);
  const [relatedCars, setRelatedCars] = useState([]);
  const [error, setError] = useState(null);
  const [loading,setLoading]=useState(false)
  const [activeSlide, setActiveSlide] = useState(0);
  const { width: screenWidth } = Dimensions.get('window');
const navigation=useNavigation()
  const renderItem = ({ item }) => (
    <Lightbox>
      <FastImage source={{ uri: `https://mangaautomobiles.com/api/indcar/${item}` }} style={tw`w-full h-90`} />
    </Lightbox>
  );



  const makePhoneCall = () => {
    const phoneNumber = route.params.state.phone; // Assuming you pass the phone number as a prop
    const phoneCallLink = `tel:${phoneNumber}`;
    Linking.openURL(phoneCallLink);
  }

  const handleNav=(item)=>{
    navigation.replace('Result', { state: item });
}


  const renderItem2=({item})=>{
    return (
        
        <Card containerStyle={[styles.cardShadow, { padding: 0 },tw`mb-10`]}>
              <TouchableOpacity  onPress={()=>handleNav(item)}>
      <Card.Image
        source={{ uri: `https://mangaautomobiles.com/api/indcar/${item.images[0]}` }}
        style={[{ width: '100%',  height: 400, resizeMode: 'cover' }, tw`rounded-md`]} // Ensure height is set as needed
        resizeMode="cover" // Image will cover the entire area, maintaining aspect ratio
      />
      </TouchableOpacity>
     
      <Text style={[{fontFamily:'Netflix Sans Medium'},tw`pl-4 text-2xl pb-5 pt-2`]}>
        {item.year} {item.make} {item.model}
      </Text>
  
    
     
    
  
    
    </Card>
    
      
    )
    }

  useEffect(() => {
    const fetchRelatedCars = async () => {
      //console.log('Fetching related cars with:', data.category, data.used); // Debugging line
  
      try {
        const response = await fetch(`https://mangaautomobiles.com/api/related-vehicles?category=${encodeURIComponent(route.params.state.category)}&used=${encodeURIComponent(route.params.state.used)}&requestno=${route.params.state.requestno}`, { method: 'GET' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
       
        setRelatedCars(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRelatedCars();
  }, [data.category, data.used]);

  



  const pagination = () => {
    return (
      <Pagination
        dotsLength={data.images.length}
        activeDotIndex={activeSlide}
        containerStyle={tw`bg-black opacity-50 rounded-full absolute bottom-1 p-2`}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };
//console.log(data)
  return (
    <View style={tw`flex-1`}>
      <ScrollView>
        <Carousel
          data={data.images}
          renderItem={renderItem}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          layout={'tinder'}
          layoutCardOffset={9}
          style={tw`relative w-full`}
          onSnapToItem={(index) => setActiveSlide(index)}
        />
        <View style={tw`flex-row justify-center mt-2`}>
          {pagination()}
        </View>
        
      
       <Text style={[{fontFamily:'Netflix Sans Bold'},tw`text-2xl text-center text-gray-700`]}>
        {data.year} {data.make} {data.model}</Text> 
        <Text style={[{fontFamily:'Netflix Sans Light'},tw`pl-6 text-base text-[#808080] `]}>{data.requestno}</Text>
        <Text style={[{fontFamily:'Netflix Sans Bold'},tw`text-2xl pl-6 text-blue-500`]}>₦{data.price.toLocaleString()}</Text>
        <Text style={tw`text-[#808080] mb-3 mt-3 pl-6`}>Posted {new Date(data.timestamp).toUTCString()}</Text>
        <View style={[{ borderBottomWidth: 1, borderBottomColor: '#d3d3d3' },tw`mx-4`]} />
        <Text style={[{fontFamily:'Netflix Sans Bold'},tw`text-2xl pl-6 text-gray-700 mt-4`]}>
       Additional Information</Text> 

       <View style={tw`p-4 px-6 bg-gray-100 flex-1 mb-10`}>
      <DataTable style={tw`bg-white rounded-lg shadow-lg`}>
        {/* Table Header */}
        <DataTable.Header style={tw`bg-blue-300 rounded-t-lg shadow-md`}>
          <DataTable.Title>
            <Text style={tw`text-white font-bold text-base`}>Item</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={tw`text-white font-bold text-base`}>Value</Text>
          </DataTable.Title>
       
        </DataTable.Header>

        {/* Data Rows */}
        <DataTable.Row style={tw`bg-gray-50`}>
          <DataTable.Cell>Year</DataTable.Cell>
          <DataTable.Cell numeric>{data.year}</DataTable.Cell>
       
        </DataTable.Row>

        <DataTable.Row style={tw`bg-gray-100`}>
          <DataTable.Cell>Make</DataTable.Cell>
          <DataTable.Cell numeric>{data.make}</DataTable.Cell>
         
        </DataTable.Row>

        <DataTable.Row style={tw`bg-gray-50`}>
          <DataTable.Cell>Model</DataTable.Cell>
          <DataTable.Cell numeric>{data.model}</DataTable.Cell>
 
        </DataTable.Row>

        <DataTable.Row style={tw`bg-gray-100`}>
          <DataTable.Cell>Transmission</DataTable.Cell>
          <DataTable.Cell numeric>{data.transmission}</DataTable.Cell>

 
        </DataTable.Row>
        <DataTable.Row style={tw`bg-gray-50`}>
          <DataTable.Cell>Category</DataTable.Cell>
          <DataTable.Cell numeric>{data.category}</DataTable.Cell>
        </DataTable.Row>


        <DataTable.Row style={tw`bg-gray-100`}>
          <DataTable.Cell>Mileage</DataTable.Cell>
          <DataTable.Cell numeric>{data.mileage.toLocaleString()} mi</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row style={tw`bg-gray-50`}>
          <DataTable.Cell>Status</DataTable.Cell>
          <DataTable.Cell numeric>{data.state=='Pending'?'Available':'Sold'}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row style={tw`bg-gray-100`}>
          <DataTable.Cell>Location</DataTable.Cell>
          <DataTable.Cell numeric>{data.address},{data.location}</DataTable.Cell>
        </DataTable.Row>
        {/* Pagination */}
        {/*<DataTable.Pagination
          page={1}
          numberOfPages={3}
          onPageChange={(page) => console.log(page)}
          label="1 of 3"
          style={tw`bg-gray-200 rounded-b-lg`}
  />*/}



<DataTable.Row style={tw`bg-gray-50`}>
          <DataTable.Cell>Usage</DataTable.Cell>
          <DataTable.Cell numeric>{data.used}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>


    </View>



    <TouchableOpacity onPress={makePhoneCall} style={[styles.button,tw`m-2 bg-blue-300`]}>
      <View style={styles.content}>
        <Ionicons name="call" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Call Now</Text>
      </View>
    </TouchableOpacity>

    <Text style={[{fontFamily:'Netflix Sans Bold'},tw`text-2xl pl-6 text-gray-700 mt-4 `]}>
       Related Vehicles</Text> 
  {/* Add more items here */}
  <FlatList
        data={relatedCars}
        renderItem={renderItem2}
        scrollEnabled={false}
        />
      </ScrollView>

      {/* Fixed Contact Button */}
      <TouchableOpacity
        style={[styles.contactButton, tw`bg-blue-500 rounded-full p-3`]}
        onPress={() => alert('Contact pressed')}
      >
        <IonIcons name='man-outline' color='white' size={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  contactButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8, // Shadow for Android
  },
  button: {
  // Solid green color for the button
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10, // Rounded corners
    shadowColor: '#000', // Shadow settings for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Elevation to enhance the shadow effect on Android
    marginVertical: 10,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600', // Slightly bolder text
  },
};

export default Result;
