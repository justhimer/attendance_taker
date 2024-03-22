import { Text, View, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function Login() {
  return (
    <View style={{alignItems:"center"}}>
      <Image 
        source={require('../../assets/logo.png')}
        style={styles.loginImage}
      />
      <Text style={styles.loginTitle}>Login Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loginImage: {
    width: 200,
    height: 200,
  },
  loginTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});