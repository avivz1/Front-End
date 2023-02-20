import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';
import citiesFile from '../../Utils/citisListUpdated.json'
import { SelectList } from 'react-native-dropdown-select-list'
import textValidation from '../../Services/TextValidation.js'


export default function AddTeamComponent2(props) {

    const { userId } = React.useContext(Context);
    const [userIdValue] = userId;
    const [errorsArr, setErrorsArr] = React.useState([])
    const [allCities, setAllCities] = React.useState(citiesFile)
    const [selectedCity, setSelectedCity] = React.useState('');
    const [teamName, setTeamName] = React.useState('')
    const [teamType, setTeamType] = React.useState('')
    const { isInputOk } = textValidation;

    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();

    const onSubmit = () => {
        let input = isInputOk([{ teamName: teamName }, { teamType: teamType }, { teamCity: selectedCity }])
        if (!input.status) {
            setErrorsArr(input.data)
            return;
        } else {


            axios.post('http://' + IP + '/teams/addteam', {
                name: teamName,
                type: teamType,
                city: selectedCity,
                userID: userIdValue
            }).then(res => {
                if (res.data == true) {
                    alertRef.current.setMsg('Team Added')
                    setIsAlertHandle(false)
                    alertRef.current.focus()
                    // Alert.alert('Team Added')
                } else {
                    alertRef.current.setMsg('Somthing went wrong try again')
                    setIsAlertHandle(true)
                    alertRef.current.focus()
                    // Alert.alert('Somthing went wrong try again');
                }
            })
        }
    }
    
    const callbackFromAlert = ()=>{
        props.onAddTeam();
    }

    return (
        <View styles={[styles.container]}>
            <CustomAlert oneBtn={alertOneBtn} callback={callbackFromAlert} selfHandle={isAlertHandle} ref={alertRef} />
            <Text style={{ fontWeight: 'bold' }}>Add Team</Text>


            <View>
                <Text>Team Name : </Text>
                <TextInput keyboardType='ascii-capable' placeholder='Enter Name' onChangeText={(name) => setTeamName(name)} />
                {(errorsArr.length > 0 && errorsArr.includes('teamName')) && <Text>This is required.</Text>}


                <Text>Team Type : </Text>
                <TextInput keyboardType='numeric' placeholder='Enter Type' onChangeText={(type) => setTeamType(type)} />
                {(errorsArr.length > 0 && errorsArr.includes('teamType')) && <Text>This is required.</Text>}


                <Text>Team City : </Text>
                <SelectList
                    placeholder='Select City'
                    setSelected={(cityName) => setSelectedCity(cityName)}
                    data={allCities}
                    save="value"
                />
                {(errorsArr.length > 0 && errorsArr.includes('teamCity')) && <Text>This is required.</Text>}


                <Button title="Submit" onPress={onSubmit} />

            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flex: 0,
        height: 450,
        width: '100%',
        backgroundColor: '#fff',
        fontSize: 10,
    },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1,
        fontSize: 15,
    },
    editForm: {
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

