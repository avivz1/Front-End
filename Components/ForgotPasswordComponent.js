import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, TextInput, Text, Button, Alert } from 'react-native';
import { IP } from '../IP_Address';
import SecurityQuestionDropDown from './SecurityQuestionPicker'
import textValidation from '../Services/TextValidation'
import CustomAlert from '../Utils/CustomAlert'


export default function ForgotPasswordComponent({ navigation }) {


    const { isInputOk } = textValidation;
    const [userCredentials, setUserCredentials] = useState({ securityA: '', securityQ: '', userEmail: '' })
    const [errorsArr, setErrorsArr] = useState([])
    const [isAlertHandle,setIsAlertHandle] = useState(false)
    const alertRef = useRef();

    const submit = () => {
        let input = isInputOk([{ email: userCredentials.userEmail }, { securityA: userCredentials.securityA }, { securityQ: userCredentials.securityQ }])
        if (!input.status) {
            setErrorsArr(input.data)
            return;
        } else {
            axios.post('http://' + IP + '/users/forgotpassword', { user: userCredentials }).then(res => {
                if (res.data) {
                    alertRef.current.setMsg('Your password is ' + res.data)
                    setIsAlertHandle(false)
                    alertRef.current.focus()
    
                } else {
                    alertRef.current.setMsg('There was a problem. try again')
                    setIsAlertHandle(true)
                    alertRef.current.focus()
                }
            })
        }
    }

    const navigateToLogin = () => {
        navigation.replace('Login')
    }

    const setSecurityQuestionCallBack = (question) => {
        setUserCredentials(prevState => ({ ...prevState, securityQ: question }))
    }

    return (
        <View style={[styles.container]}>
            <CustomAlert oneBtn={true} twoBtn={false} selfHandle={isAlertHandle} callback={navigateToLogin} ref={alertRef} />
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