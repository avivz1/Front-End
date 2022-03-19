import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';



export default function ViewPracticesComponent() {



  useEffect(async () => {

  }, [])




  return (
    <View><Text>Practices 2</Text></View>
  )

  const styles = StyleSheet.create({
    container: {
      alignSelf: 'center',
      flex: 2,
      height: '40%',
      width: '80%',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 10,
    }
  })

}
