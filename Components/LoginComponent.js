import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TextInput, Button, Alert } from "react-native";
import axios from 'axios';
import { Context } from '../ContextAPI/Context';
import { IP } from '../IP_Address';

export default function LoginComponent({ navigation }) {

    const { userId } = React.useContext(Context);
    const [userIdValue, setUserId] = userId;
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSignUpPress = () => {
        navigation.navigate('SignUp');
    }
    const onLoginPress = () => {
        if (!email) {
            alert('Please fill Email');
        }
        if (!password) {
            alert('Please fill Password');
        }
        axios.post('http://' + IP + '/login', { inputEmail: email, inputPassword: password }).then((res) => {
            if (res.data) {
                setUserId(res.data)
                navigation.replace('Home')
            } else {
                alert('User is not exists');
            }
        })
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

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password."
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            <Button style={styles.loginText} title='Login' onPress={onLoginPress} />


            <Button style={styles.signUp_button} title='Sign up' onPress={onSignUpPress} />

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



// import axios from 'axios';
// import { StyleSheet, Text, View, Button, TextInput, Alert, ImageBackground } from 'react-native';
// import React from "react";
// import { Context } from '../ContextAPI/Context';
// import { IP } from '../IP_Address';
// // import newStyle from '../style/ss'





// export default function LoginComponent({ navigation }) {

//     const { userId } = React.useContext(Context);
//     const [userIdValue, setUserId] = userId;
//     const [email, setEmail] = React.useState("");
//     const [password, setPassword] = React.useState("");




//     const onSignUpPress = () => {
//         navigation.navigate('SignUp');
//     }

//     const onLoginPress = () => {
//         if (!email) {
//             alert('Please fill Email');
//         }
//         if (!password) {
//             alert('Please fill Password');
//         }
//         axios.post('http://' + IP + '/login', { inputEmail: email, inputPassword: password }).then((res) => {
//             if (res.data) {
//                 setUserId(res.data)
//                 navigation.replace('Home')
//             } else {
//                 alert('User is not exists');
//             }
//         })
//     }

//     return (

//         <View style={styles.container}>
//                 <TextInput onChangeText={onEmailChange} style={styles.input} placeholder='Email'></TextInput>
//                 <TextInput secureTextEntry={true} onChangeText={onPasswordChange} style={styles.input} placeholder='Password'></TextInput>
//                 <View>
//                 <Button style={styles.center} onPress={onLoginPress} title='Login' />

//                     <Text onPress={onSignUpPress} style={styles.text}>Sign Up</Text>
//                 </View>
//         </View>

//     );
// }




// const styles = StyleSheet.create({
//     container: {
//         alignSelf: 'center',
//         flex: 2,
//         height: '40%',
//         width: '100%',
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginVertical: 1,
//         fontSize: 10,
//     },

//     image: {
//         flex: 1,
//         justifyContent: "center"
//     },
//     center: {
//         margin: 100,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     text: {
//         margin: 10

//     },
//     input: {
//         margin: 15,
//         height: 40,
//         borderColor: '#7a42f4',
//         borderWidth: 1,
//         fontSize: 15,
//     },
//     inputView: {
//         backgroundColor: "#FFC0CB",
//         borderRadius: 30,
//         width: "70%",
//         height: 45,
//         marginBottom: 20,
//         alignItems: "center",
//     },

//     TextInput: {
//         height: 50,
//         flex: 1,
//         padding: 10,
//         marginLeft: 20,
//     }

// });
