import React,{useState,useEffect,useCallback} from 'react';
import { _signOutGoogle } from '../authconfig/Googlesignin'
import {useNavigation} from '@react-navigation/native'
import tw from 'twrnc'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, StyleSheet,Alert,ScrollView,RefreshControl  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icons

const Settings = () => {
    const [name,setName]=useState('')
    const [count,setCount]=useState(0)
      const [refreshing, setRefreshing] = useState(false);
    const [loading,setLoading]=useState(false)
    const getdata = async () => {
        try {
       
          const storedUsername = await AsyncStorage.getItem('username');
          if (storedUsername) {
            setName(storedUsername)
          }
       
        } catch (error) {
          console.log(error)
          alert('Internal server error');
        } 
      };

      const googleSignOut=async()=>{
        _signOutGoogle().then(()=>{
          console.log('=> success signed out')
        })
        AsyncStorage.removeItem('username')
        AsyncStorage.removeItem('loggedIn')
        setName('')
        setCount(count+1)
      }
      useEffect(()=>{

        getdata()
    },[name,count])
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getdata().then(() => setRefreshing(false));
      }, []);
      const handleDeleteAccount = () => {
        // Show alert to confirm account deletion
        Alert.alert(
          'Confirm Deletion',
          'Are you sure you want to delete your account? This action is irreversible.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: async() => {
                // Add your delete account logic here
              try {
                setLoading(true)
                const data=await fetch(`https://mangaautomobiles.com/api/deleteaccount/${name}`,{method:'DELETE'})
                const response=await data.json()
                if(response.ok){
                    alert(response.ok)
                    AsyncStorage.removeItem('username')
                  googleSignOut()
                }
              } catch (error) {
                alert('Something went wrong')
              }
              finally{
                setLoading(false)
              }
              },
              style: 'destructive',
            },
          ],
          { cancelable: true }
        );
      };
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={styles.container}>
      {/* Header */}


      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
{!name && <Text style={[{fontFamily:'Netflix Sans Medium'},tw`text-[#000000]`]}> You might want to sign in</Text>}
        {/* Logout Button */}
        {name && (<TouchableOpacity style={styles.button}   onPress={async () => {
    try {
      await AsyncStorage.removeItem('username');
      await googleSignOut();
    } catch (error) {
      console.error('Logout error:', error);
      // Handle any logout errors here
    }
  }}>
          <Icon name="logout" size={20} color="#333" style={styles.icon} />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>)}

        {/* Delete Account Button */}
        {name && (<TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
          <Icon name="trash-can" size={20} color="red" style={styles.icon} />
          <Text style={[styles.buttonText, { color: 'red' }]}>Delete Account</Text>
        </TouchableOpacity>)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Light background color for the settings page
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android shadow property
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row', // Align icon and text side by side
    alignItems: 'center',
  },
  icon: {
    marginRight: 10, // Add space between icon and text
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Settings;
