

import { View, Text,Alert, FlatList,ActivityIndicator,RefreshControl,Refreshing, TouchableOpacity, Button, Share   } from 'react-native'
import React,{useState,useEffect,useRef} from 'react'
import tw from 'twrnc'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from './Search';
import Filter from './Filter';
import IonIcons from 'react-native-vector-icons/Ionicons'
import { Card } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
export default function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [orderData, setOrderData] = useState([]);
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const [triggeredOnce, setTriggeredOnce] = useState(false);
    const scrollViewRef = useRef();

    const onShare = async (key) => {
      try {
        const url = `https://mangaautomobiles.com/buy/${key.requestno}`;
        const message = `Check out this link: ${url}`;
        
        const result = await Share.share({
          message: message,
        });
  
        if (result.action === Share.sharedAction) {
          console.log('Shared successfully');
        } else if (result.action === Share.dismissedAction) {
          console.log('Share cancelled');
        }
      } catch (error) {
        console.error('Error sharing:', error.message);
      }
    }
    const onRefresh = () => {
      if (!triggeredOnce) {
        setRefreshing(true);
        setTriggeredOnce(true);
  
        handlePageChange(currentPage + 1); // Fetch next page data
       
  
        setTimeout(() => {
          setRefreshing(false);
          setTriggeredOnce(false); // Reset flag after refresh
        }, 2000); // Simulating network request
      }
    };
    const Navigation=useNavigation()
    const handlePageChange = (page) => {
        setCurrentPage(page);
      };
      const handleCancel = () => {
        setSearchModalVisible(false);
      };
      const handleFilter = async (filters) => {
        try {
          
          // Convert price and mileage arrays to string
          const filtersString = JSON.stringify(filters);
          setLoading1(true)
          const response = await fetch('https://mangaautomobiles.com/api/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: filtersString,
          });
          const data = await response.json();
          if (data) {
            // Handle the search results (e.g., update state with the search results)
            Navigation.navigate('Searchresult',{state:data,filter:filtersString})
          } else {
     
            console.log('Failed. Please try again')
          }
        } catch (error) {
          console.error('Error searching cars:', error);
        }
        finally{
          setLoading1(false)
        }
      };
  const handleSearch = async (text) => {
    setSearchQuery(text);
  
    try {
      // Reset the orderData to an empty array before fetching new data
      setOrderData([]);
      setCurrentPage(1); // Reset the page number to 1 for the new search
  
      const url = `https://mangaautomobiles.com/api/improvedcars?page=1&search=${text}`;
      const response = await fetch(url);
  
      if (response.ok) {
        const data = await response.json();
        setOrderData(data); // Set the fetched data into the state
      } else {
        console.error('Error fetching data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
    const fetchData = async () => {

        let apiUrl = `https://mangaautomobiles.com/api/improvedcars?page=${currentPage}&search=${searchQuery}`;
        setLoading(true)
        fetch(apiUrl,{
          method:'GET',
          headers:{
            Accept:'application/json',
            'Content-Type':'application/json'
          }
        }).then((res)=>res.json())
        .then((json)=>
        setOrderData([...orderData,...json]))
        .catch((error)=>console.error(error))
        .finally(()=>setLoading(false))
      };
      useEffect(() => {
       
    
        fetchData();
      }, [currentPage, searchQuery]);
const handleNav=(item)=>{
    Navigation.navigate('Result',{state:item})
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

const handleScroll = ({ nativeEvent }) => {
  // Check if loading is true and currentPage is 1, if so, return early
  if (loading && currentPage === 1) {
    return;
  }

  const paddingToBottom = 20;
  if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - paddingToBottom) {
    onRefresh();
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
const renderItem=({item})=>{
return (
    
    <Card containerStyle={[styles.cardShadow, { padding: 0 },tw``]}>
          <TouchableOpacity disabled={item.status === 'Sold'}  onPress={()=>handleNav(item)}>
  <Card.Image
    source={{ uri: `https://mangaautomobiles.com/api/indcar/${item.images[0]}` }}
    style={[{ width: '100%',  height: 400, resizeMode: 'cover' }, tw`rounded-md`]} // Ensure height is set as needed
    resizeMode="cover" // Image will cover the entire area, maintaining aspect ratio
  />
  </TouchableOpacity>
  <Text style={[tw`pt-4 pl-4 text-base text-[#808080]`, { marginBottom: 2, fontFamily: 'Netflix Sans Light' }]}>
    {item.requestno}
  </Text>
  <Text style={[{fontFamily:'Netflix Sans Medium'},tw`pl-4 text-2xl text-[#4a4b4d]`]}>
    {item.year} {item.make} {item.model}
  </Text>
  <Text style={[{fontFamily:'Netflix Sans Light'},tw`pl-4 text-base`]}>
<Text style={tw`text-[#4a4b4d]`}>Location: </Text><Text style={tw`text-[#4a4b4d]`}>{item.location}</Text>
  </Text>

  <Text style={[{fontFamily:'Netflix Sans Light'},tw`pl-4 text-base `]}>
  <Text style={tw`text-[#4a4b4d]`}>Vehicle Status: </Text> {item.state=='Pending'?<Text style={[tw`text-[#32CD32]`,{fontFamily:'Netflix Sans Bold'}]}>Available</Text>:item.state}
  </Text>

  <View style={tw`pl-4 pb-4`}>
  <View style={tw`flex-row  gap-32`}>
    {/* Table Headings */}
    <Text style={[{ fontFamily: 'Netflix Sans Medium' }, tw`text-base text-[#4a4b4d]`]}>Price:</Text>
    <Text style={[{ fontFamily: 'Netflix Sans Medium' }, tw`text-base text-[#4a4b4d]`]}>Transmission:</Text>
  </View>

  <View style={tw`flex-row gap-20`}>
    {/* Table Items */}
    <Text style={[{ fontFamily: 'Netflix Sans Light' }, tw`text-base text-[#4a4b4d]`]}>₦ {item.price.toLocaleString()}</Text>
    <Text style={[{ fontFamily: 'Netflix Sans Light' }, tw`text-base text-[#4a4b4d]`]}>{item.transmission}</Text>
  </View>
  <View style={tw`flex flex-row justify-between`}>
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


      <TouchableOpacity 
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: '#93c5fd', // Green background
          paddingVertical: 7, 
          paddingHorizontal: 10, 
          borderRadius: 5, 
          marginRight:10,
          alignSelf: 'flex-start' // Position to the left
        }} 
 onPress={()=>onShare(item)}
      >
        <Icon name="share" size={20} color="#fff" style={{ marginRight: 5 }} />
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Share</Text>
      </TouchableOpacity>
      </View>
</View>

</Card>

  
)
}
  return (
    <View style={{ flex: 1 }}>
    <Search 
    onChangeText={handleSearch}
    onPress={()=>setSearchModalVisible(true)}
     onSearch={handleFilter}

    />
    <FlatList
        data={orderData}
        onScroll={handleScroll}
        scrollEventThrottle={16}
    
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ref={ scrollViewRef} 
        renderItem={renderItem}
        ListFooterComponent={
            <View style={styles.footerContainer}>
                {loading ? (
                    <View style={styles.spinnerTextStyle}>
                        <ActivityIndicator size="large" color="#888" />
                    </View>
                ) : null}
            </View>
        }
    />
    
    {/* Contact Button */}
    <TouchableOpacity style={[styles.contactButton,tw`bg-blue-500 rounded-full p-3`]} onPress={() => alert('Contact pressed')}>
       <IonIcons name='man-outline' color='white' size={30} />
    </TouchableOpacity>

    <Filter
          
          visible={isSearchModalVisible}
          onSearch={handleFilter}
          onCancel={handleCancel}
        />
</View>
  )
}
const styles = {
    cardShadow: {
      shadowColor: '#000', // Shadow color
      shadowOffset: { width: 0, height: 5 }, // Offset for shadow
      shadowOpacity: 0.3, // Opacity of the shadow
      shadowRadius: 5, // Blur radius of the shadow
      elevation: 10, // Shadow for Android
 // Rounded corners for the card
    },
    footerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'left',
        padding: 10,
      marginBottom:100
      },
      spinnerTextStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
     
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    }
  }