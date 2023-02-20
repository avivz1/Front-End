import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { IP } from '../IP_Address';
import { Context } from '../ContextAPI/Context';
import textValidation from '../Services/TextValidation.js'
// import DropDownPicker from 'react-native-dropdown-picker';
import SecurityQuestionDropDown from './SecurityQuestionPicker'
import { TextInput } from 'react-native-paper'
import CustomAlert from '../Utils/CustomAlert'




export default function SignUp({ navigation }) {

    const { userId } = useContext(Context);
    const [userIdValue, setUserId] = userId;
    const [email, onEmailChange] = useState("");
    const [password, onPasswordChange] = useState("");
    const [passwordConfirm, onPasswordConfirmChange] = useState("");
    const [securityQ, setSecurityQ] = useState('')
    const [securityA, setSecurityA] = useState('')
    const [errorsArr, setErrorsArr] = useState([])
    const [isPaasswordVisible, setIsPasswordVisible] = useState(true)
    const { isInputOk } = textValidation;
    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();



    const onSingUpPress = function () {
        let input = isInputOk([{ email: email }, { password: password }, { passwordConfirm: passwordConfirm }, { securityA: securityA }, { securityQ: securityQ }]);
        if (!input.status) {
            setErrorsArr(input.data)
            return;
        }
        if (password == passwordConfirm) {
            let userData = { inputEmail: email, inputPassword: password, securityA: securityA, securityQ: securityQ }
            axios.post('http://' + IP + '/login/signup', userData).then((res) => {
                if (res.data) {
                    setUserId(res.data)
                    alertRef.current.setMsg('User Created')
                    setIsAlertHandle(false)
                    alertRef.current.focus()
                } else {
                    alertRef.current.setMsg('There Was a problem. Try Again')
                    setIsAlertHandle(true)
                    alertRef.current.focus()
                }
            });
        } else {
            alertRef.current.setMsg('Passwords dont match. Try Again')
            setIsAlertHandle(true)
            alertRef.current.focus()
        }
    }
    
    const navigateToLogin = ()=>{
        navigation.replace('Login')
    }


    return (
        <View style={styles.container}>
            <CustomAlert oneBtn={alertOneBtn} selfHandle={isAlertHandle} callback={()=>navigateToLogin()} ref={alertRef} />

            <Text style={styles.headline}>Sign Up</Text>

            <TextInput style={styles.text} onChangeText={onEmailChange} placeholder='Email'></TextInput>
            {(errorsArr.length > 0 && errorsArr.includes('email')) && <Text>This is required.</Text>}

            <TextInput secureTextEntry={isPaasswordVisible} style={styles.text} onChangeText={onPasswordChange} placeholder='Password'
                right={<TextInput.Icon name={isPaasswordVisible ? 'eye' : 'eye-off'} onPress={() => setIsPasswordVisible(!isPaasswordVisible)} />} />
            {(errorsArr.length > 0 && errorsArr.includes('password')) && <Text>This is required.</Text>}

            <TextInput secureTextEntry={isPaasswordVisible} style={styles.text} onChangeText={onPasswordConfirmChange} placeholder='Confirm Password'
                right={<TextInput.Icon name={isPaasswordVisible ? 'eye' : 'eye-off'} onPress={() => setIsPasswordVisible(!isPaasswordVisible)} />} />
            {(errorsArr.length > 0 && errorsArr.includes('passwordConfirm')) && <Text>This is required.</Text>}

            <SecurityQuestionDropDown callback={(question) => setSecurityQ(question)} />
            {(errorsArr.length > 0 && errorsArr.includes('securityQ')) && <Text>This is required.</Text>}

            <TextInput secureTextEntry={true} style={styles.text} onChangeText={(secA) => setSecurityA(secA)} placeholder='Security Answer'></TextInput>
            {(errorsArr.length > 0 && errorsArr.includes('securityA')) && <Text>This is required.</Text>}

            <View>
                <Button onPress={onSingUpPress} style={styles.btn} title='Sign Up' />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flex: 1,
        height: '40%',
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        // alignItems: 'center',
        //justifyContent: 'center',
    },
    text: {
        margin: 10,
        fontSize: 20
    },
    headline: {
        marginVertical: 30,
        // marginBottom: 30,
        fontSize: 30
    },
    btn: {
        fontSize: 30
    }
})
