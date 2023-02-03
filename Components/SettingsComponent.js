import { useState, useEffect, useContext,useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import axios from 'axios'
import { IP } from '../IP_Address';
import { Context } from '../ContextAPI/Context';
import DataToExcel from '../Services/DataToExcel'
import Dialog from "react-native-dialog";



export default function SettingsComponent() {

    // const [userDetails, setUserDetails] = useState('')
    const { excelProcess } = DataToExcel;
    const { userId } = useContext(Context);
    const [userIdValue, setUserId] = userId;
    const [userPassword, setUserPassword] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userSecurityQ, setUserSecurityQ] = useState('')
    const [userSecurityA, setUserSecurityA] = useState('')
    const [visible, setVisible] = useState(false);
    const [inputPassword,setInputPassword] = useState('')

    useEffect(() => {
        getUserDetails()
    }, [])

    const getUserDetails = () => {
        axios.post('http://' + IP + '/login/getuserdetails', { userId: userIdValue }).then(res => {
            if (res.data) {
                setUserEmail(res.data.Email)
                setUserPassword(res.data.Password)
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
        axios.post('http://' + IP + '/login/resetdb',{password:inputPassword,userId:userIdValue}).then(res => {
            if(res.data){
                Alert.alert('Success')
            }else{
                Alert.alert('Somthing went wrong. try again')
            }
        })
        setVisible(false)
    };

    const submit = () => {
        console.log('submit')
    }

    return (
        <View style={{ margin: 20 }}>

            <Text style={{ fontWeight: 'bold', fontSize: 22 }}>Profile</Text>

            <Text>Email</Text>
            <TextInput value={userEmail} placeholder={'Email'} onChange={(mail) => setUserEmail(mail)} ></TextInput>

            <Text>Password</Text>
            <TextInput value={userPassword} placeholder={'Password'} onChange={(pass) => setUserPassword(pass)} ></TextInput>

            <Text>Security Question</Text>
            <TextInput value={userSecurityQ} placeholder={'Security Question'} onChange={(secQ) => setUserSecurityQ(secQ)} ></TextInput>

            <Text>Security Answer</Text>
            <TextInput value={userSecurityA} placeholder={'Security Answer'} onChange={(secA) => setUserSecurityA(secA)} ></TextInput>

            <Button title='Submit' onPress={submit} />

            <Button onPress={toExcel} title='Export Db To Excel' />

            <Button onPress={showDialog} title='Reset DB' />

            <Dialog.Container visible={visible}>
                <Dialog.Title>Data delete</Dialog.Title>
                <Dialog.Description>
                    Do you want to delete all of your data? You cannot undo this action.
                </Dialog.Description>
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Input label='Enter Password' onChangeText={(pass)=>setInputPassword(pass)}/>
                <Dialog.Button label="Delete" onPress={handleDeleteDb} />
            </Dialog.Container>

        </View>
    )
}
