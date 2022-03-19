import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View,Button, TextInput } from 'react-native';
import React from "react";
import { IP } from '../IP_Address';





export default function SignUp({ navigation }) {

    const [email, onEmailChange] = React.useState("");
    const [password, onPasswordChange] = React.useState("");
    const [passwordConfirm,onPasswordConfirmChange] = React.useState("");

    const onSingUpPress = function (){
        if(password==passwordConfirm){
            axios.post('http://'+IP+'/login/signup',{inputEmail:email,inputPassword:password}).then((res)=>{
                if(res.data){
                    alert('User Created'+'\n'+res.data);
                    navigation.replace('Home')
                }else {
                    alert('There Was a problem. Try Again');
                }
            });

        }else{
            alert("Password is not confirmed");
            return;
        }
    }
    

    return (
        <View style={styles.container}>
            <Text style={styles.headline}>Sign Up</Text>
        <TextInput  style={styles.text} onChangeText={onEmailChange}  placeholder='Email'></TextInput>
        <TextInput secureTextEntry={true} style={styles.text} onChangeText={onPasswordChange}  placeholder='Password'></TextInput>
        <TextInput secureTextEntry={true} style={styles.text} onChangeText={onPasswordConfirmChange}  placeholder='Confirm Password'></TextInput>
        <View>
        <Button onPress={onSingUpPress} style={styles.btn} title='Sign Up'/>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf:'center',
        flex: 1,
        height:'40%',
        width:'100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        //justifyContent: 'center',
      },
      text: {
        marginBottom:20,
        fontSize:20
      },
      headline: {
        marginVertical:100,
        marginBottom:30,
        fontSize:30
      },
      btn: {
        fontSize:30
      }
})
