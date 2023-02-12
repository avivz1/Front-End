import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, TextInput, Text, Button, Alert } from 'react-native';
import { IP } from '../IP_Address';




export default function ForgotPasswordComponent({ navigation }) {


    const [userCredentials, setUserCredentials] = useState({ securityA: '', securityQ: '', userEmail: ''})

    const submit = () => {
        axios.post('http://' + IP + '/users/forgotpassword', { user: userCredentials }).then(res => {
            if (res.data) {
                Alert.alert('Your password is - ' +res.data)
                navigation.replace('Login')
            } else {
                Alert.alert('There was a problem')
            }
        })
    }

    return (
        <View style={[styles.container]}>
            <Text style={[styles.mainHeadLines]}>Forget Password </Text>

            <Text style={[styles.smallHeadLines]} >Please enter your email:</Text>
            <TextInput placeholder='Your Mail' onChangeText={(mail) => setUserCredentials((prevState) => ({...prevState, userEmail: mail}))} />

            <Text style={[styles.smallHeadLines]} >Please choose your security question:</Text>
            <TextInput placeholder='Your Question' onChangeText={(question) => setUserCredentials((prevState) => ({...prevState, securityQ: question}))} />

            <Text style={[styles.smallHeadLines]} >Please enter your security answer:</Text>
            <TextInput placeholder='Your Answer' onChangeText={(answer) => setUserCredentials((prevState) => ({...prevState, securityA: answer}))} />

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