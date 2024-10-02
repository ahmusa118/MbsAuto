import { View, Text, Dimensions,FlatList,TouchableOpacity,Linking,ActivityIndicator, Button  } from 'react-native'
import React,{useEffect,useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-snap-carousel'
import tw from 'twrnc'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import Lightbox from 'react-native-lightbox-v2';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { Drawer, DrawerGroup, DrawerItem, Icon, IconElement,Divider } from '@ui-kitten/components';
const Saved = ({setFalse}) => {
    const { width: screenWidth ,height: screenHeight} = Dimensions.get('window');
    const [savedData, setSavedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [details,setDetails]=useState([])
  const [mapp,setMap]=useState([])
  const [totalPages,setTotalPages]=useState('');
  const [name,setName]=useState('')
  const [count,setCount]=useState(0)

  const makePhoneCall = async(item) => {
    const ftch=await AsyncStorage.getItem('username')
    if(ftch==null){
      setFalse()
     setCount(count+1)
    }
    else{
    const phoneNumber = item; // Assuming you pass the phone number as a prop
    const phoneCallLink = `tel:${phoneNumber}`;
    Linking.openURL(phoneCallLink);
  }
}

  const getdata = async () => {
    const ftch=await AsyncStorage.getItem('username')
    if(ftch==null){
      setFalse()
     setCount(count+1)
    }else{
    try {
      setLoading(true);
      const storedUsername = await AsyncStorage.getItem('username');

      if (storedUsername) {
        setName(storedUsername)
      }
      const response = await fetch(`https://mangaautomobiles.com/api/getsavedata/${name}?page=${currentPage}`, { method: 'POST' });
  
      if (response.ok) {
        const data = await response.json();
        setMap(data.data);
    
      }
    } catch (error) {
      console.log(error)
      alert('Internal server error');
    } finally {
      setLoading(false);
    }
}
  };
  
useEffect(()=>{

    getdata()
},[currentPage,details,name,count])




    const deleteBookmark = async (reqno) => {
      const ftch=await AsyncStorage.getItem('username')
      if(ftch==null){
        setFalse()
       setCount(count+1)
      }else {
        const response = await fetch(`https://mangaautomobiles.com/api/delete/${name}/${reqno}`, {
          method: 'DELETE'
        });
        const data = await response.json();
      
        if (response.ok) {
          // Handle success response
         alert(data.success); // You can log or handle the response data here
         getdata()
          return data; // You can return the data if needed
        } else {
          // Handle error response
          throw new Error(data.error || 'Failed to delete bookmark');
        }
      }
      };

      

  
  const handlePageChange = (page) => {
      setCurrentPage(page);
  
    };


        const renderItem2 = ({ item }) => (
 
              <FastImage source={{ uri: `https://mangaautomobiles.com/api/indcar/${item}` }} style={tw`w-full h-90`} />

          )
    
  const renderItem=({item})=>{

    return(
        <View>
        <Carousel
        data={item.images}
        renderItem={renderItem2}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        layout={'tinder'}
        layoutCardOffset={9}
        style={tw`relative w-full`}
      />
      <Drawer
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}
    >
      <DrawerGroup
        title='Check Information'
      
      >
        
         <DrawerItem
           key={1}
          title={`₦ ${item.newPrice.toLocaleString()}`}
       
        />
         <DrawerItem
          key={2}
          title={`${item.requestno}`}
        
        />
        <DrawerItem
          key={3}
          title={`${item.make}`}
        
        />
        <DrawerItem
          key={4}
          title={`${item.year}`}
        
        />
         <DrawerItem
           key={5}
          title={`${item.model}`}
        
        />
         <DrawerItem
           key={6}
          title={`${item.location}`}
        
        />
         <DrawerItem
           key={7}
          title={`${item.address}`}
        
        />
        <Button title='remove bookmark' onPress={()=>deleteBookmark(item.requestno)} />
      </DrawerGroup>
     
    </Drawer>

    <TouchableOpacity onPress={()=>makePhoneCall(item.phone)} style={[styles.button,tw`m-2 bg-blue-300`]}>
      <View style={styles.content}>
        <Ionicons name="call" size={24} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Call Now</Text>
      </View>
    </TouchableOpacity>
      <Text>

      </Text>
      </View>
    )
  }

if(loading){return <View style={tw`justify-center flex items-center`}>
   <ActivityIndicator size='large'/>
</View>}

  
 
  return (

     <FlatList 
     data={mapp}
     refreshing={loading} onRefresh={getdata}
     renderItem={renderItem}
     ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Icon2 name="tray-remove" size={80} color="#888" style={styles.emptyIcon} />
          <Text style={styles.emptyText}>Pull Down to refresh</Text>
        </View>
      }
     ListFooterComponent={
        <View style={styles.footerContainer}>
            {loading ? (
                <View style={[styles.spinnerTextStyle]}>
                    <ActivityIndicator size="large" color="#888" />
                </View>
            ) : null}
        </View>
    }
     />
  
  )
}

const styles = {
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      emptyIcon: {
        marginBottom: 10,
      },
      emptyText: {
        fontSize: 18,
        color: '#888',
      },
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
      paddingVertical: 10,
      paddingHorizontal: 20,
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
    spinnerTextStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
  };
export default Saved