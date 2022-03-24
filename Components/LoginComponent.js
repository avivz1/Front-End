import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, Alert ,ImageBackground } from 'react-native';
import React from "react";
import { Context } from '../ContextAPI/Context';
import { IP } from '../IP_Address';




export default function LoginComponent({ navigation }) {

    const { userId } = React.useContext(Context);
    const [userIdValue, setUserId] = userId;
    const [email, onEmailChange] = React.useState("");
    const [password, onPasswordChange] = React.useState("");

    // const image = { uri: "https://reactjs.org/logo-og.png" };


    const onSignUpPress = function () {
        navigation.navigate('SignUp');
    }

    const onLoginPress = function () {
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
            {/* <ImageBackground source={image} resizeMode="cover" style={styles.image}> */}
                <TextInput onChangeText={onEmailChange} style={styles.input} placeholder='Email'></TextInput>
                <TextInput secureTextEntry={true} onChangeText={onPasswordChange} style={styles.input} placeholder='Password'></TextInput>
                <View>
                    <Button style={styles.center} onPress={onLoginPress} title='Login' />
                    <Text onPress={onSignUpPress} style={styles.text}>Sign Up</Text>
                </View>
                {/* </ImageBackground> */}
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flex: 2,
        height: '40%',
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 1,
        fontSize: 10,
    },
    image: {
        flex: 1,
        justifyContent: "center"
      },
    center: {
        margin: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        margin: 10

    },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1,
        fontSize: 15,
    },

});
