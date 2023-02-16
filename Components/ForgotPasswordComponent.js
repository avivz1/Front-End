import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, TextInput, Text, Button, Alert } from 'react-native';
import { IP } from '../IP_Address';
import SecurityQuestionDropDown from './SecurityQuestionPicker'
import textValidation from '../Services/TextValidation'



export default function ForgotPasswordComponent({ navigation }) {


    const { isInputOk } = textValidation;
    const [userCredentials, setUserCredentials] = useState({ securityA: '', securityQ: '', userEmail: '' })
    const [errorsArr, setErrorsArr] = useState([])


    const submit = () => {
        let input = isInputOk([{ email: userCredentials.userEmail }, { securityA: userCredentials.securityA }, { securityQ: userCredentials.securityQ }])
        if (!input.status) {
            setErrorsArr(input.data)
            return;
        } else {
            axios.post('http://' + IP + '/users/forgotpassword', { user: userCredentials }).then(res => {
                if (res.data) {
                    console.log(res.data)
                    Alert.alert('Your password is - ' + res.data)
                    navigation.replace('Login')
                } else {
                    Alert.alert('There was a problem')
                }
            })
        }
    }


    const setSecurityQuestionCallBack = (question) => {
        setUserCredentials(prevState => ({ ...prevState, securityQ: question }))
    }

    return (
        <View style={[styles.container]}>
            <Text style={[styles.mainHeadLines]}>Forget Password </Text>

            <Text style={[styles.smallHeadLines]} >Please enter your email:</Text>
            <TextInput placeholder='Your Mail' onChangeText={(mail) => setUserCredentials((prevState) => ({ ...prevState, userEmail: mail }))} />
            {(errorsArr.includes('email')) && <Text>This is required.</Text>}

            <SecurityQuestionDropDown callback={setSecurityQuestionCallBack} />
            {(errorsArr.includes('securityQ')) && <Text>This is required.</Text>}

            <Text style={[styles.smallHeadLines]} >Please enter your security answer:</Text>
            <TextInput placeholder='Your Answer' onChangeText={(answer) => setUserCredentials((prevState) => ({ ...prevState, securityA: answer }))} />
            {(errorsArr.includes('securityA')) && <Text>This is required.</Text>}

            <Button title='Give me my Password!' onPress={submit} />
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