import { useState, useEffect,useContext } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import axios from 'axios'
import { IP } from '../IP_Address';
import { Context } from '../ContextAPI/Context';



export default function SettingsComponent() {

    const [userDetails, setUserDetails] = useState('')
    const { userId } = useContext(Context);
    const [userIdValue, setUserId] = userId;


    useEffect(() => {
        getUserDetails()
    },[])

    const getUserDetails = () => {
        axios.post('http://' + IP + '/login/getuserdetails', { userId: userIdValue }).then(res => {
            if (res.data) {
                setUserDetails(res.data)
            }
        })
    }

    return (
        <View style={{ margin: 20 }}>

            <Text style={{ fontSize: 22 }}>Profile</Text>

            <Text>Email</Text>
            <TextInput value={userDetails.Email} placeholder={'Email'} ></TextInput>

        </View>
    )
}
