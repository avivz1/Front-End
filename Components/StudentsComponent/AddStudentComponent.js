import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';
import BeltsPickerComponent from '../../Utils/BeltsPickerComponent'
import citiesFile from '../../Utils/Cities1.json'
import { SelectList } from 'react-native-dropdown-select-list'




export default function AddStudentsComponent(props) {

    const { userId } = React.useContext(Context);
    const [userIdValue] = userId;
    const [index, setIndex] = React.useState(0);
    const [pickedTeam, setPickedTeam] = React.useState('');
    const [stuBelt, setStuBelt] = React.useState('')
    const [stuName, setStuName] = React.useState('')
    const [stuAge, setStuAge] = React.useState('')
    const [errorsArr, setErrorsArr] = React.useState([])
    const [allCities, setAllCities] = React.useState([])
    const [selectedCity, setSelectedCity] = React.useState('');


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


    const setChoosenTeam = (picked, index) => {
        setPickedTeam(picked)
        setIndex(index)
    }

    const onBeltPicked = (belt) => {
        setStuBelt(belt)
    }

    const isInputOk = () => {
        let arr = []
        if (stuName == '' || stuName == undefined) {
            arr.push('stuName')
        }
        if (stuAge == '' || stuAge == undefined) {
            arr.push('stuAge')
        }
        if (stuBelt == '' || stuBelt == undefined) {
            arr.push('stuBelt')
        }
        if (selectedCity == '' || selectedCity == undefined) {
            arr.push('stuCity')
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

        if (isNaN(stuAge)) {
            Alert.alert('Age is not a Number! try again')
        } else {
            axios.post('http://' + IP + '/students/addstudent', {
                userid: userIdValue,
                teamID: pickedTeam ? pickedTeam._id : props.teams[index],
                name: stuName,
                belt: stuBelt,
                city: selectedCity,
                age: stuAge,
            }).then(res => {
                if (res.data) {
                    Alert.alert('Student Was Added')
                    props.onAddClostModal()
                } else {
                    Alert.alert("Somthing went wrong. Try again")
                }
            })


        }
    }



    return (

        <View style={styles.container}>
            <Picker
                selectedValue={props.teams.lenght > 0 ? pickedTeam : props.teams[index]}
                onValueChange={setChoosenTeam}>
                {props.teams.map((team, index) => {
                    return (<Picker.Item key={index} label={team.Name} value={team}></Picker.Item>)
                })}
            </Picker>

            <Text>Student Name : </Text>
            <TextInput keyboardType='ascii-capable' style={[styles.inputText]} placeholder='Enter Name' onChangeText={(name) => setStuName(name)} />
            {(errorsArr.length > 0 && errorsArr.includes('stuName')) && <Text>This is required.</Text>}


            <Text>Student Age : </Text>
            <TextInput keyboardType='numeric' style={[styles.inputText]} placeholder='Enter age' onChangeText={(age) => setStuAge(age)} />
            {(errorsArr.length > 0 && errorsArr.includes('stuAge')) && <Text>This is required.</Text>}


            <SelectList
                placeholder='Select City'
                setSelected={(cityName) => setSelectedCity(cityName)}
                data={allCities}
                save="value"
            />
            {(errorsArr.length > 0 && errorsArr.includes('stuCity')) && <Text>This is required.</Text>}


            <Text>Student Belt : </Text>
            <BeltsPickerComponent callback={onBeltPicked} />
            {(errorsArr.length > 0 && errorsArr.includes('stuBelt')) && <Text>This is required.</Text>}


            <Button title="Submit" onPress={onSubmit} />
        </View>





    )


}




const styles = StyleSheet.create({
    container: {
        flex: 0,
        height: '80%',
        width: '100%',
        backgroundColor: '#fff',
        fontSize: 10,


    },

    inputText: {
        borderWidth: 1,
    },

    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    }
});
