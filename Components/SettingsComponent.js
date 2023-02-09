import { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import axios from 'axios'
import { IP } from '../IP_Address';
import { Context } from '../ContextAPI/Context';
import DataToExcel from '../Services/DataToExcel'
import Dialog from "react-native-dialog";
import textValidation from '../Services/TextValidation'



export default function SettingsComponent() {


    const { excelProcess } = DataToExcel;
    const { userId } = useContext(Context);
    const [userIdValue, setUserId] = userId;
    const [userPassword, setUserPassword] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userSecurityQ, setUserSecurityQ] = useState('')
    const [userSecurityA, setUserSecurityA] = useState('')
    const [visible, setVisible] = useState(false);
    const [inputPassword, setInputPassword] = useState('')
    const [errorsArr, setErrorsArr] = useState([])
    const { isInputOk } = textValidation;

    useEffect(() => {
        getUserDetails()
    }, [])

    const getUserDetails = () => {
        axios.post('http://' + IP + '/login/getuserdetails', { userId: userIdValue }).then(res => {
            if (res.data) {
                setUserEmail(res.data.Email)
                setUserPassword(res.data.Password)
                setUserSecurityA(res.data.SecurityAnswer)
                setUserSecurityQ(res.data.SecurityQuestion)
            }
        })
    }

    const toExcel = () => {
        excelProcess(userIdValue)
    }

    const showDialog = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleDeleteDb = () => {
        //token
        //need to validate the input password
        axios.post('http://' + IP + '/login/resetdb', { password: inputPassword, userId: userIdValue }).then(res => {
            if (res.data) {
                Alert.alert('Success')
            } else {
                Alert.alert('Somthing went wrong. try again')
            }
        })
        setVisible(false)
    };

    // const isInputOk = () => {
    //     let arr = []
    //     if (userEmail == '' || userEmail == undefined) {
    //         arr.push('email')
    //     }
    //     if (userPassword == '' || userPassword == undefined) {
    //         arr.push('password')
    //     }
    //     if (userSecurityA == '' || userSecurityA == undefined) {
    //         arr.push('securityA')
    //     }
    //     if (userSecurityQ == '' || userSecurityQ == undefined) {
    //         arr.push('securityQ')
    //     }

    //     if (arr.length == 0) {
    //         setErrorsArr([])
    //         return true;
    //     } else {
    //         setErrorsArr(arr)
    //         return false;
    //     }
    // }



    const submit = () => {
        let input = isInputOk([{email:userEmail},{password:userPassword},{securityA:userSecurityA},{securityQ:userSecurityQ}])
        if (input.status) {
            axios.post('http://' + IP + '/users/updateuserdetails', {
                userId: userIdValue,
                email: userEmail,
                password: userPassword,
                securityQuestion: userSecurityQ,
                securityAnswer: userSecurityA
            }).then(res => {
                if (res.data) {
                    Alert.alert('Success')
                } else {
                    Alert.alert('Somthing went wrong')
                }
            })
        }else{
            setErrorsArr(input.data)
            return;
        }
    }

    return (
        <View style={{ margin: 20 }}>

            <Text style={{ fontWeight: 'bold', fontSize: 22 }}>Profile</Text>

            <Text>Email</Text>
            <TextInput value={userEmail} placeholder={'Email'} onChangeText={(mail) => setUserEmail(mail)} ></TextInput>
            {(errorsArr.includes('email')) && <Text>This is required.</Text>}

            <Text>Password</Text>
            <TextInput value={userPassword} placeholder={'Password'} onChangeText={(pass) => setUserPassword(pass)} ></TextInput>
            {(errorsArr.includes('password')) && <Text>This is required.</Text>}

            <Text>Security Question</Text>
            <TextInput value={userSecurityQ} placeholder={'Security Question'} onChangeText={(secQ) => setUserSecurityQ(secQ)} ></TextInput>
            {(errorsArr.includes('securityQ')) && <Text>This is required.</Text>}

            <Text>Security Answer</Text>
            <TextInput value={userSecurityA} placeholder={'Security Answer'} onChangeText={(secA) => setUserSecurityA(secA)} ></TextInput>
            {(errorsArr.includes('securityA')) && <Text>This is required.</Text>}

            <Button title='Submit Data' onPress={submit} />
            <Button onPress={toExcel} title='Export Db To Excel' />

            <Button onPress={showDialog} title='Reset DB' />

            <Dialog.Container visible={visible}>
                <Dialog.Title>Data delete</Dialog.Title>
                <Dialog.Description>
                    Do you want to delete all of your data? You cannot undo this action.
                </Dialog.Description>
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Input label='Enter Password' onChangeText={(pass) => setInputPassword(pass)} />
                <Dialog.Button label="Delete" onPress={handleDeleteDb} />
            </Dialog.Container>

        </View>
    )
}
