import { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import axios from 'axios'
import { IP } from '../IP_Address';
import { Context } from '../ContextAPI/Context';
import DataToExcel from '../Services/DataToExcel'
import Dialog from "react-native-dialog";
import textValidation from '../Services/TextValidation'
import SecurityQuestionDropDown from './SecurityQuestionPicker'
import { TextInput } from 'react-native-paper'
import CustomAlert from '../Utils/CustomAlert'



export default function SettingsComponent() {


    const { excelProcess } = DataToExcel;
    const { userId } = useContext(Context);
    const [userIdValue, setUserId] = userId;
    const [userPassword, setUserPassword] = useState('')
    const [userConfirmPassword, setUserConfirmPassword] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userSecurityQ, setUserSecurityQ] = useState('')
    const [userSecurityA, setUserSecurityA] = useState('')
    const [visible, setVisible] = useState(false);
    const [inputPassword, setInputPassword] = useState('')
    const [errorsArr, setErrorsArr] = useState([])
    const [isPaasswordVisible, setIsPasswordVisible] = useState(true)
    const { isInputOk } = textValidation;
    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();

    useEffect(() => {
        getUserDetails()
    }, [])

    const getUserDetails = () => {
        axios.post('http://' + IP + '/users/getuserdetails', { userId: userIdValue }).then(res => {
            if (res.status == 200) {
                setUserEmail(res.data.data.Email)
                setUserPassword(res.data.data.Password)
                setUserSecurityA(res.data.data.SecurityAnswer)
                setUserSecurityQ(res.data.data.SecurityQuestion)
            }
        }).catch((error) => {
            alertRef.current.setMsg(error.response.data.message)
            setIsAlertHandle(true)
            alertRef.current.focus()
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
        axios.post('http://' + IP + '/users/resetdb', { password: inputPassword, userId: userIdValue }).then(res => {
            if (res.data) {
                alertRef.current.setMsg('Success - Data Deleted')
                setIsAlertHandle(true)
                alertRef.current.focus()
            } else {
                alertRef.current.setMsg('Somthing went wrong. try again')
                setIsAlertHandle(true)
                alertRef.current.focus()
            }
        })
        setVisible(false)
    };

    const submit = () => {
        let input = isInputOk([{ email: userEmail }, { password: userPassword }, { securityA: userSecurityA }, { securityQ: userSecurityQ }, { confirmPassword: userConfirmPassword }])
        if (input.status) {
            if (userConfirmPassword != userPassword) {
                alertRef.current.setMsg('Passwords dont match. try again')
                setIsAlertHandle(true)
                alertRef.current.focus()
                return;
            } else {
                axios.post('http://' + IP + '/users/updateuserdetails', {
                    userId: userIdValue,
                    email: userEmail,
                    password: userPassword,
                    securityQuestion: userSecurityQ,
                    securityAnswer: userSecurityA
                }).then(res => {
                    if (res.data) {
                        alertRef.current.setMsg('Success')
                        setIsAlertHandle(true)
                        alertRef.current.focus()
                        return;
                    } else {
                        alertRef.current.setMsg('Somthing went wrong')
                        setIsAlertHandle(true)
                        alertRef.current.focus()
                        return;
                    }
                })
            }
        } else {
            setErrorsArr(input.data)
            return;
        }
    }

    const setSecurityQuestionCallBack = (question) => {
        setUserSecurityQ(question)
    }

    return (
        <View style={{ margin: 20 }}>
            <CustomAlert oneBtn={alertOneBtn} selfHandle={isAlertHandle} ref={alertRef} />

            <Text style={styles.headline}>Profile</Text>

            <Text>Email</Text>
            <TextInput style={styles.text} value={userEmail} placeholder={'Email'} onChangeText={(mail) => setUserEmail(mail)} ></TextInput>
            {(errorsArr.includes('email')) && <Text>This is required.</Text>}

            <Text>Password</Text>
            <TextInput style={styles.text} secureTextEntry={isPaasswordVisible} value={userPassword} placeholder={'Password'} onChangeText={(pass) => setUserPassword(pass)}
                right={<TextInput.Icon name={isPaasswordVisible ? 'eye-off' : 'eye'} onPress={() => setIsPasswordVisible(!isPaasswordVisible)} />}
            />
            {(errorsArr.includes('password')) && <Text>This is required.</Text>}

            <Text>Confirm Password</Text>
            <TextInput style={styles.text} secureTextEntry={isPaasswordVisible} placeholder={'Confirm Password'} onChangeText={(confirmPass) => setUserConfirmPassword(confirmPass)}
                right={<TextInput.Icon name={isPaasswordVisible ? 'eye-off' : 'eye'} onPress={() => setIsPasswordVisible(!isPaasswordVisible)} />}
            />
            {(errorsArr.includes('confirmPassword')) && <Text>This is required.</Text>}

            <SecurityQuestionDropDown data={userSecurityQ} callback={setSecurityQuestionCallBack} />
            {(errorsArr.includes('securityQ')) && <Text>This is required.</Text>}

            <Text>Security Answer</Text>
            <TextInput style={styles.text} secureTextEntry={isPaasswordVisible} value={userSecurityA} placeholder={'Security Answer'} onChangeText={(secA) => setUserSecurityA(secA)}
                right={<TextInput.Icon name={isPaasswordVisible ? 'eye-off' : 'eye'} onPress={() => setIsPasswordVisible(!isPaasswordVisible)} />}
            />
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



const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flex: 1,
        height: '40%',
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
    },
    headline: {
        marginVertical: 10,
        fontSize: 30
    },

    text: {
        margin: 10,
        fontSize: 20
    },
});


