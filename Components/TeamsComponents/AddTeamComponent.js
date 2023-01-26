import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';
import citiesFile from '../../Utils/Cities1.json'
import { SelectList } from 'react-native-dropdown-select-list'


export default function AddTeamComponent2(props) {

    const { userId } = React.useContext(Context);
    const [userIdValue] = userId;
    const [errorsArr, setErrorsArr] = React.useState([])
    const [allCities, setAllCities] = React.useState([])
    const [selectedCity, setSelectedCity] = React.useState('');
    const [teamName, setTeamName] = React.useState('')
    const [teamType, setTeamType] = React.useState('')


    // const { control, handleSubmit, formState: { errors }, reset } = useForm()


    useEffect(() => {
        let arr = []
        citiesFile.forEach((city) => {
            let obj = {
                key: city.semel,
                value: city.name
            }
            arr.push(obj)
        })
        setAllCities(arr)
    }, [])

    const isInputOk = () => {
        let arr = []
        if (teamName == '' || teamName == undefined) {
            arr.push('teamName')
        }
        if (teamType == '' || teamType == undefined) {
            arr.push('teamType')
        }
        if (selectedCity == '' || selectedCity == undefined) {
            arr.push('teamCity')
        }
        if (arr.length == 0) {
            setErrorsArr([])
            return true;
        } else {
            setErrorsArr(arr)
            return false;
        }
    }

    const onSubmit = () => {
        let input = isInputOk()
        if (!input) {
            return;
        }

        axios.post('http://' + IP + '/teams/addteam', {
            name: teamName,
            type: teamType,
            city: selectedCity,
            userID: userIdValue
        }).then(res => {
            if (res.data == true) {
                Alert.alert('Team Added')
                props.onAddTeam();
            } else {
                Alert.alert('Somthing went wrong try again');
            }
        })
    }

    return (
        <View styles={[styles.container]}>
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

