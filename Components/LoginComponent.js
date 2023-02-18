import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity } from "react-native";
import axios from 'axios';
import { Context } from '../ContextAPI/Context';
import { IP } from '../IP_Address';
import textValidation from '../Services/TextValidation'
import {TextInput} from 'react-native-paper'


export default function LoginComponent({ navigation }) {
    
    const { userId } = useContext(Context);
    const [userIdValue, setUserId] = userId;
    const [email, setEmail] = useState('a');
    const [password, setPassword] = useState('1');
    const [errorsArr, setErrorsArr] = useState([])
    const [isPaasswordVisible,setIsPasswordVisible] = useState(true)
    const { isInputOk } = textValidation;
    
    const onSignUpPress = () => {
        navigation.navigate('SignUp');
    }

    const onLoginPress = () => {
        let input = isInputOk([{email:email},{password:password}]);
        if (!input.status) {
            setErrorsArr(input.data)
            return;
        } else {

            axios.post('http://' + IP + '/login', { inputEmail: email, inputPassword: password }).then((res) => {
                if (res.data) {
                    setUserId(res.data)
                    navigation.replace('Home')
                } else {
                    alert('User is not exists');
                }
            })
        }
    }

    const handeleForgotPassword = () => {
        // setForgotPasswordFlag(true)
        navigation.navigate('ForgotPassword');

    }

    return (
        <View style={styles.container}>
            <Image style={styles.image} />
            {/* require("./assets/log2.png") */}
            {/* source={} */}
            <StatusBar style="auto" />
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email."
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            {(errorsArr.length > 0 && errorsArr.includes('email')) && <Text>This is required.</Text>}


            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password" 
                    secureTextEntry={isPaasswordVisible}
                    onChangeText={(password) => setPassword(password)}
                    right={<TextInput.Icon name={isPaasswordVisible?'eye':'eye-off'} onPress={()=>setIsPasswordVisible(!isPaasswordVisible)}/>}

                />
            </View>
            {(errorsArr.length > 0 && errorsArr.includes('password')) && <Text>This is required.</Text>}

            <Button style={styles.loginText} title='Login' onPress={onLoginPress} />


            <Button style={styles.signUp_button} title='Sign up' onPress={onSignUpPress} />
            <TouchableOpacity onPress={handeleForgotPassword}>
                <Text>Forgot Password? </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        marginBottom: 40,
    },

    inputView: {
        backgroundColor: "#80ccff",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,

        alignItems: "center",
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },

    signUp_button: {
        height: 30,
        marginBottom: 30,
    },

    loginBtn: {
        width: "40%",
        padding: 50,
        margin: 50,
        borderRadius: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 50,
        backgroundColor: "#FF1493",
    },
});


