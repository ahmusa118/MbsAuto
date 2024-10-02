import React, { useState } from 'react';

import {View,Text,Alert} from 'react-native'
import { Input, Button, message } from '@rneui/themed';

const Verify = ({route}) => {
const [loading,setLoading]=useState(false)
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = async () => {
    try {
      if (verificationCode ==route.params.verification) {
        setLoading(true)
        const response = await fetch(`https://mangaautomobiles.com/api/verify/${route.params.email}`,{method:'POST'});
 
     const data=await response.json()
     if(data.success==true){
        Alert.alert('Success! Please login')
     }
     else{
        Alert.alert('An error occured')
     }
      } else {
        Alert.alert('Wrong verification code.');
      }
    } catch (error) {
       
      alert('Error: Failed to verify.');
    }finally {
        setLoading(false)
    }
  };

 

  return (
    <View className='p-4'>
      <Text>Please enter verification code:{verificationCode}</Text>
      
      <Input value={verificationCode} onChangeText={setVerificationCode} />
      <Button loading={loading} className='mt-2' onPress={handleSubmit}>Submit</Button>
    </View>
  );
};

export default Verify;
