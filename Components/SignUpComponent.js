import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { IP } from '../IP_Address';
import { Context } from '../ContextAPI/Context';





export default function SignUp({ navigation }) {

    const { userId } = useContext(Context);
    const [userIdValue, setUserId] = userId;
    const [email, onEmailChange] = useState("");
    const [password, onPasswordChange] = useState("");
    const [passwordConfirm, onPasswordConfirmChange] = useState("");
    const [securityQ, setSecurityQ] = useState('')
    const [securityA, setSecurityA] = useState('')
    const [errorsArr, setErrorsArr] = useState([])

    const onSingUpPress = function () {
        let status = isInputOk();
        if (!status) {
            return;
        }
        if (password == passwordConfirm) {
            let userData = { inputEmail: email, inputPassword: password, securityA: securityA, securityQ: securityQ }
            axios.post('http://' + IP + '/login/signup', userData).then((res) => {
                if (res.data) {
                    setUserId(res.data)

                    alert('User Created');
                    navigation.replace('Home')
                } else {
                    alert('There Was a problem. Try Again');
                }
            });
        } else {
            Alert.alert('Passwords dont match')
        }
    }

    const isInputOk = () => {
        let arr = []
        if (email == '' || email == undefined) {
            arr.push('email')
        }
        if (password == '' || password == undefined) {
            arr.push('password')
        }
        if (passwordConfirm == '' || passwordConfirm == undefined) {
            arr.push('passwordConfirm')
        }
        if (securityQ == '' || securityQ == undefined) {
            arr.push('securityQ')
        }
        if (securityA == '' || securityA == undefined) {
            arr.push('securityA')
        }
        if (arr.length == 0) {
            setErrorsArr([])
            return true;
        } else {
            setErrorsArr(arr)
            return false;
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headline}>Sign Up</Text>

            <TextInput style={styles.text} onChangeText={onEmailChange} placeholder='Email'></TextInput>
            {(errorsArr.length > 0 && errorsArr.includes('email')) && <Text>This is required.</Text>}

            <TextInput secureTextEntry={true} style={styles.text} onChangeText={onPasswordChange} placeholder='Password'></TextInput>
            {(errorsArr.length > 0 && errorsArr.includes('password')) && <Text>This is required.</Text>}

            <TextInput secureTextEntry={true} style={styles.text} onChangeText={onPasswordConfirmChange} placeholder='Confirm Password'></TextInput>
            {(errorsArr.length > 0 && errorsArr.includes('passwordConfirm')) && <Text>This is required.</Text>}

            <TextInput secureTextEntry={true} style={styles.text} onChangeText={(secQ) => setSecurityQ(secQ)} placeholder='Security Question'></TextInput>
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
        alignItems: 'center',
        //justifyContent: 'center',
    },
    text: {
        marginBottom: 20,
        fontSize: 20
    },
    headline: {
        marginVertical: 100,
        marginBottom: 30,
        fontSize: 30
    },
    btn: {
        fontSize: 30
    }
})
