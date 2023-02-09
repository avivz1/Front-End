import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, TextInput, Text, Button, Alert } from 'react-native';
import { IP } from '../IP_Address';




export default function ForgotPasswordComponent() {

    const [userCredentials, setUserCredentials] = useState({ securityA: '', securityQ: '', userEmail: '' })

    const submit = () => {
        axios.post('http://' + IP + '/users/forgotpassword', { user: userCredentials }).then(res => {
            if (res.data) {
                Alert.alert('Your password is - ')
            }else{
                
            }
        })
    }

    return (
        <View style={[styles.container]}>
            <Text style={[styles.mainHeadLines]}>Forget Password </Text>

            <Text style={[styles.smallHeadLines]} >Please enter your email:</Text>
            <TextInput placeholder='Your Mail' onChangeText={(mail) => setUserCredentials({ userEmail: { mail } })} />

            <Text style={[styles.smallHeadLines]} >Please choose your security question:</Text>
            <TextInput placeholder='Your Question' onChangeText={(question) => setUserCredentials({ securityQ: { question } })} />

            <Text style={[styles.smallHeadLines]} >Please enter your security answer:</Text>
            <TextInput placeholder='Your Answer' onChangeText={(answer) => setUserCredentials({ securityA: { answer } })} />

            <Button title='Generate New Password' onPress={submit} />
            {/* <Button title={'Generate Password'} onPress={()=>submit}/> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 50,
        fontSize: 50,
    },
    smallHeadLines: {
        fontWeight: 'bold'
    },
    mainHeadLines: {
        fontWeight: 'bold',
        margin: 10
    }

});