/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useEffect} from 'react';
import Tabs from './src/components/Tabs';
import Result from './src/components/Result';
import RegisterScreen from './src/components/RegisterScreen';
import LinkHandler from './src/components/LinkHandler';
import Splash from './src/components/Splash';
import { AppState } from 'react-native';
import Forgot from './src/components/Forgot';
import RNRestart from 'react-native-restart'; 
import {navigationRef} from './src/components/navigationRef'
import messaging from '@react-native-firebase/messaging';
import Home from './src/components/Home';
import Verify from './src/components/Verify';
import Searchresult from './src/components/Searchresult';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { Platform,PermissionsAndroid } from 'react-native';


const config={
  screens:{
    LinkHandler:{
      path: 'buy/:id',
      parse: {
        id: (id) => `${id}`,
      }
    }
  }
}
messaging().setBackgroundMessageHandler(async remoteMessage=>{
  console.log('Message handled in the background!', remoteMessage);
 })
function App(): React.JSX.Element {

  const Stack = createNativeStackNavigator();
  useEffect(() => {
    const setup = async () => {
      try {
        // Request notification permission
    {/* await inAppMessaging().setMessagesDisplaySuppressed(false);
        const hasPermission = await messaging().requestPermission();
        if (!hasPermission) {
          console.log("Permission denied");
          return;
        }*/}
        const hasPermission = await messaging().requestPermission();
        if (!hasPermission) {
          console.log("Permission denied");
          return;
        }
        // Try to get the FCM token
        const token = await messaging().getToken();
        
        if (token) {
          console.log('FCM Token: ' + token);
          // Subscribe to topic if token is retrieved
          await messaging().subscribeToTopic('allUsersMbsauto');
          console.log('Subscribed to Topic: allUsers mbs');
        } else {
          console.error("FCM token not retrieved, relaunching app...");
          // Relaunch the app if token retrieval fails
          RNRestart.Restart();  // This will restart the app
        }

      } catch (error) {
        console.error('Error during setup:', error);
        // If any error occurs, restart the app
        RNRestart.Restart(); // Restart app on error
      }
    };
 
    setup();

    // Optional: Add a listener to detect if app comes from background to foreground
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        setup(); // Retry setup when the app becomes active again
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.remove();
    };

  }, []);


  const requestNotificationPermission = async () => {
    if(Platform.OS ==="android"){
      try {
        PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS').then(
          response => {
            if(!response){
              PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS',{
                  title: 'Notification',
                  message:
                    'App needs access to your notification ' +
                    'so you can get Updates',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
              })
            }
          }
        ).catch(
          err => {
            console.log("Notification Error=====>",err);
          }
        )
      } catch (err){
        console.log(err);
      }
    }
  };

  useEffect(() => {
    // Foreground notification handling
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived! Message handled');
    });
  
    // When a notification is opened by the user
    messaging().onNotificationOpenedApp(remoteMessage => {
      navigationRef.current?.navigate('Linkhandler');
    });
  
    // When the app is opened from a quit state via a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          navigationRef.current?.navigate('Linkhandler');
        }
      });
  
    return unsubscribe;
  }, []);
  //        android:pathPrefix="/buy"
  useEffect(() => {
    requestNotificationPermission(); // Call the permission request on app load
  }, [])
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
    <NavigationContainer 
     linking={{
      prefixes:["https://mangaautomobiles.com","mangaautomobiles://","https://abujacar.org"],
      config
    }}
    ref={navigationRef}>
       <Stack.Navigator initialRouteName="Splash" >
           <Stack.Screen name="Splash" options={{headerShown:false}} component={Splash} />
           <Stack.Screen name="Tabs" options={{headerShown:false}} component={Tabs} />
           <Stack.Screen name="Result"  component={Result} />
           <Stack.Screen name="Searchresult"  component={Searchresult} />
           <Stack.Screen name="LinkHandler"  component={LinkHandler} />
           <Stack.Screen name="Verify"  component={Verify} />
           <Stack.Screen name="Forgot"  component={Forgot} />
           <Stack.Screen name="Register"  component={RegisterScreen} />
    </Stack.Navigator>
    </NavigationContainer>
    </ApplicationProvider>
  );
}



export default App;
