import  { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'


  export const _signInWithGoogle=async()=>{
    try {
        GoogleSignin.configure({
            offlineAccess:true,
            webClientId: '273872912892-kc28plpb6267gv8bmgm8ot2acmda92jn.apps.googleusercontent.com',
            scopes:['profile','email']
        })

        
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn()
        const {idToken}=userInfo
        const googleCredentials=auth.GoogleAuthProvider.credential(idToken)
       auth().signInWithCredential(googleCredentials)
       return userInfo
    } catch (error) {
console.log('Google sign in',error)
return null
    }
}

export const _signOutGoogle = async () => {
    try {
        await GoogleSignin.configure({
            offlineAccess: false,
            webClientId: '273872912892-kc28plpb6267gv8bmgm8ot2acmda92jn.apps.googleusercontent.com',
            scopes: ['profile', 'email']
        });

        await GoogleSignin.hasPlayServices();

        await GoogleSignin.signOut();
        
        // Optionally revoke access to the user's Google account
        // await GoogleSignin.revokeAccess();

        console.log('User signed out from Google successfully');
    } catch (error) {
        console.error('Google sign out error:', error);
    }
}

export const isUserSignedIn = async () => {
    try {
        await GoogleSignin.configure({
            offlineAccess: false,
            webClientId: '273872912892-kc28plpb6267gv8bmgm8ot2acmda92jn.apps.googleusercontent.com',
            scopes: ['profile', 'email']
        });

        await GoogleSignin.hasPlayServices();

        const isSignedIn = await GoogleSignin.isSignedIn();
        return isSignedIn;
    } catch (error) {
        console.error('Error checking sign-in status:', error);
        return false;
    }
};