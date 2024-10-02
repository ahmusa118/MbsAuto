import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const Forgot = () => {
  const [step, setStep] = useState(1); // Tracks the current step (1: email input, 2: code input, 3: new password)
  const [email, setEmail] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle the email submission
  const handleEmailSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://mangaautomobiles.com/api/forgotindividualpassword/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.status === 200) {
        Alert.alert('Success', data.ok);
        setStep(2); // Move to the next step
      } else {
        Alert.alert('Error', data.error || 'Failed to send verification code');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  // Function to handle code verification via API
  const handleCodeVerification = async () => {
    if (!inputCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://mangaautomobiles.com/api/checkverificationcode/${email}/${inputCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.status === 200 && data.ok) {
        Alert.alert('Success', data.ok);
        setStep(3); // Move to the password reset step
      } else {
        Alert.alert('Error', data.failed || 'Verification code incorrect');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  // Function to handle the new password submission
  const handleChangePassword = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://mangaautomobiles.com/api/changeindividualpassword/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.status === 200) {
        Alert.alert('Success', 'Password has been changed successfully');
        setStep(1); // Reset the form to the email input step
        setEmail('');
        setInputCode('');
        setNewPassword('');
      } else {
        Alert.alert('Error', data.error || 'Failed to change password');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Button title={isLoading ? 'Sending...' : 'Send Verification Code'} onPress={handleEmailSubmit} disabled={isLoading} />
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>Enter Verification Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter verification code"
            value={inputCode}
            onChangeText={setInputCode}
            keyboardType="numeric"
          />
          <Button title="Verify Code" onPress={handleCodeVerification} />
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>Enter New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Button title={isLoading ? 'Changing...' : 'Change Password'} onPress={handleChangePassword} disabled={isLoading} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default Forgot
