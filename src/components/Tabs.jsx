import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Login from './Login';
import Settings from './Settings';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: styles.headerShadow, // Apply the shadow style
        headerTitleAlign: 'center', // Optional: Center align the header title
      }}
    >
      <Tab.Screen name="Home"
     options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={25} />
        ),
      }}
      component={Home} />

<Tab.Screen name="Login"
     options={{
        tabBarIcon: ({ color, size }) => (
          <SimpleLineIcons name="user" color={color} size={25} />
        ),
      }}
      component={Login} />

<Tab.Screen name="Settings"
     options={{
        tabBarIcon: ({ color, size }) => (
          <EvilIcons name="gear" color={color} size={30} />
        ),
      }}
      component={Settings} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerShadow: {
    backgroundColor: '#fff', // Background color of the header
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 5 }, // Shadow offset (bottom shadow)
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 4, // Blur radius of the shadow
    elevation: 10, // Elevation for Android (shadow depth)
  },
});
