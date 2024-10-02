import React,{useState,useEffect} from 'react';
import tw from 'twrnc'
import Saved from './Saved'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { _signInWithGoogle , _signOutGoogle, isUserSignedIn } from '../authconfig/Googlesignin'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

const LoginScreen = () => {
  const Navigation = useNavigation();
  const [em, setEmail] = useState('');
  const [pass, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [fedemail,setfedemail]=useState('')
  const [fedusername,setfedusername]=useState('')
  const [username,setUsername]=useState('')
  const [photo,setPhoto]=useState('')
const [data,setData]=useState([])
const [isSignedIn, setIsSignedIn] = useState(false);
const [count,setCount]=useState(0)

const signIn = async () => {
  try {
    setLoading(true);
    const response = await fetch('https://mangaautomobiles.com/api/individualogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        em,
        pass,
      }),
    });
    const data = await response.json();

    if (data.status === 'None') {
Navigation.navigate('Verify',{email:data.email,verification:data.code})
    } else if (data.token) {
    fetchData(data.token)
    } else if (data.error) {
      setError(data.error);
    }
  } catch (error) {
    console.error('Error logging in:', error);
    setError('An error occurred while logging in');
  } finally {
    setLoading(false);
  }
};

const fetchData = async (key) => {
  try {
    // Fetch fresh data
    const response = await fetch('https://mangaautomobiles.com/api/individualdashboard', {
      method: 'GET',
      headers: { Authorization: `Bearer ${key}` },
    });

    if (response.ok) {
      const responseData = await response.json();
      setUsername(responseData.email)
      AsyncStorage.setItem('username', responseData.email);
      AsyncStorage.setItem('loggedIn', 'true');
      AsyncStorage.setItem('data', JSON.stringify(responseData));
      setData(responseData)

    
      setLoggedIn(true);

    } else {
      
      Alert.alert('error')
      throw new Error('Error fetching data from the server');
      return null;
    }
  } catch (error) {
    Alert.alert('Error fetching data')
    console.error('Error fetching data:', error);
   throw new Error('An error occurred while fetching data');
    return null;
  }
};
const handleGoogle = async () => {
  try {
    const data = await _signInWithGoogle();

    if (!data) {
      console.log('No data');
      return;
    }

    const { email, name } = data.user;

    // Set states and increment count
    setfedemail(email);
    setfedusername(name);
    setCount(count + 1);

    // Make API call
    setLoading(true);
    const response = await fetch(`https://mangaautomobiles.com/api/googlesignin/${email}/${name}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    const responseData = await response.json();

    // Handle response
    if (responseData.email) {
      setUsername(responseData.email);
      AsyncStorage.setItem('username', responseData.email);
      AsyncStorage.setItem('loggedIn', 'true');
      AsyncStorage.setItem('data', JSON.stringify(responseData));
      setData(responseData);
      setLoggedIn(true);
    }
  } catch (error) {
    console.error('Error during Google Sign In:', error);
    Alert.alert('Error during fetch');
    _signOutGoogle().then(() => {
      console.log('Successfully signed out');
      AsyncStorage.removeItem('photo');
      setCount(count + 1);
    });
  } finally {
    setLoading(false);
  }
};
const checkSignInStatus = async () => {
  const signedInStatus = await isUserSignedIn();
  setIsSignedIn(signedInStatus);
}
useEffect(() => {
  checkSignInStatus();
}, [count]);
useEffect(() => {
  const fetchUsername = async () => {
    try {
     
      const logIn = await AsyncStorage.getItem('loggedIn');
      if (logIn=='true') {
        setLoggedIn(true);
     
      }
    } catch (error) {
      console.error('Error fetching username from AsyncStorage:', error);
    }
  };

  fetchUsername();
}, [])
const setFalse=()=>{
  setLoggedIn(false)
}
if (loggedIn) {
  // If logged in, display a message indicating success
  return (
  

    <View style={tw`flex`}>


    
    <View style={tw``} > 
     <Saved username={username} photo={photo} setFalse={setFalse}/></View>

      {/* You can optionally redirect or perform any other action here */}
    </View>
 
  );
}
if(loading){
  return <View><Text>Loading..</Text></View>
}
else{
  return (
    <View style={styles.container}>
      
      <View style={styles.card}>
        <TextInput style={styles.input}
             onChangeText={setEmail} 
        placeholder="Email" />
        <TextInput style={styles.input}
         onChangeText={setPassword} 
        placeholder="Password" secureTextEntry={true} />

        <TouchableOpacity onPress={()=>Navigation.navigate('Forgot')} style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordButtonText}>Forgot?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={signIn} style={styles.button}>
          <Text style={styles.buttonText}  >Login</Text>
        </TouchableOpacity>

<Text style={tw`mt-2 mb-1`}>Or</Text>
<GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
 onPress={handleGoogle}
      />
        <TouchableOpacity style={styles.createAccountButton} onPress={()=>Navigation.navigate('Register')}>
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    width: '100%',
    height: 200,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  forgotPasswordButton: {
    width:'100%',
    textAlign:'flex-end',
  },
  forgotPasswordButtonText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign:'right'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    padding: 20,
    marginTop: 40,
    width: '90%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  button2: {
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonText2: {
    color: '#808080',
    fontWeight: 'bold',
  },
  googleButton: {
   borderRadius:15
  },
  createAccountButton: {
    marginTop: 20,
  },
  createAccountButtonText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LoginScreen;