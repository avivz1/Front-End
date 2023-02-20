import { StyleSheet, Text, View, Button, TextInput, Alert, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';
import BeltsPickerComponent from '../../Components/BeltsPickerComponent'
import { SelectList } from 'react-native-dropdown-select-list'
import citiesFile from '../../Utils/citisListUpdated.json'
import textValidation from '../../Services/TextValidation.js'
import CustomAlert from '../../Utils/CustomAlert'



export default function AddStudentsComponent(props) {

    const { userId } = React.useContext(Context);
    const [userIdValue] = userId;
    const [index, setIndex] = React.useState(0);
    const [pickedTeam, setPickedTeam] = React.useState('');
    const [stuBelt, setStuBelt] = React.useState('')
    const [stuName, setStuName] = React.useState('')
    const [stuAge, setStuAge] = React.useState('')
    const [studentPhone, setStudentPhone] = React.useState('');
    const [errorsArr, setErrorsArr] = React.useState([])
    const [allCities, setAllCities] = React.useState(citiesFile)
    const [selectedCity, setSelectedCity] = React.useState('');
    const [emergencyName, setEmergencyName] = React.useState('');
    const [emergencyPhone, setEmergencyPhone] = React.useState('');
    const { isInputOk } = textValidation;
    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();

    const setChoosenTeam = (picked, index) => {
        setPickedTeam(picked)
        setIndex(index)
    }

    const onBeltPicked = (belt) => {
        setStuBelt(belt)
    }

    const onSubmit = () => {
        let input = isInputOk([{ stuName: stuName }, { stuAge: stuAge }, { stuBelt: stuBelt }, { stuPhone: studentPhone }, { stuCity: selectedCity }, { emergencyName: emergencyName }, { emergencyPhone: emergencyPhone }])
        if (!input.status) {
            setErrorsArr(input.data)
            return;
        }
        if (isNaN(stuAge)) {
            alertRef.current.setMsg('Age is not a Number! try again')
            setIsAlertHandle(true)
            alertRef.current.focus()
            // Alert.alert('Age is not a Number! try again')
        } else {
            axios.post('http://' + IP + '/students/addstudent', {
                userid: userIdValue,
                teamID: pickedTeam ? pickedTeam._id : props.teams[index],
                name: stuName,
                belt: stuBelt,
                city: selectedCity,
                age: stuAge,
                phoneNum: studentPhone,
                emergencyContact: { Name: emergencyName, Phone: emergencyPhone }
            }).then(res => {
                if (res.data) {
                    // Alert.alert('Student Was Added')
                    alertRef.current.setMsg('Student Was Added')
                    setIsAlertHandle(false)
                    alertRef.current.focus()
                    // props.onAddClostModal()
                } else {
                    alertRef.current.setMsg('Somthing went wrong. Try again')
                    setIsAlertHandle(true)
                    alertRef.current.focus()
                    // Alert.alert("Somthing went wrong. Try again")

                }
            })


        }
    }

    const onAddStuCallbackFromAlert = () => {
        props.onAddClostModal()

    }

    return (

        <View style={styles.container}>
            <CustomAlert oneBtn={alertOneBtn} selfHandle={isAlertHandle} callback={onAddStuCallbackFromAlert} ref={alertRef} />

            <Picker
                selectedValue={props.teams.lenght > 0 ? pickedTeam : props.teams[index]}
                onValueChange={setChoosenTeam}>
                {props.teams.map((team) => {
                    return (<Picker.Item key={team._id} label={team.Name} value={team}></Picker.Item>)
                })}
            </Picker>

            <Text>Student Name : </Text>
            <TextInput keyboardType='ascii-capable' style={[styles.inputText]} placeholder='Enter Name' onChangeText={(name) => setStuName(name)} />
            {(errorsArr.length > 0 && errorsArr.includes('stuName')) && <Text>This is required.</Text>}


            <Text>Student Age : </Text>
            <TextInput keyboardType='numeric' style={[styles.inputText]} placeholder='Enter age' onChangeText={(age) => setStuAge(age)} />
            {(errorsArr.length > 0 && errorsArr.includes('stuAge')) && <Text>This is required.</Text>}

            <Text>Student Phone : </Text>
            <TextInput keyboardType='numeric' style={[styles.inputText]} placeholder='Enter student phone' onChangeText={(sPhone) => setStudentPhone(sPhone)} />
            {(errorsArr.length > 0 && errorsArr.includes('stuPhone')) && <Text>This is required.</Text>}

            <Text>Emergency Contact Name : </Text>
            <TextInput keyboardType='ascii-capable' style={[styles.inputText]} placeholder='Enter emergency name' onChangeText={(eName) => setEmergencyName(eName)} />
            {(errorsArr.length > 0 && errorsArr.includes('emergencyName')) && <Text>This is required.</Text>}

            <Text>Emergency Contact Number : </Text>
            <TextInput keyboardType='numeric' style={[styles.inputText]} placeholder='Enter emergency phone' onChangeText={(ePhone) => setEmergencyPhone(ePhone)} />
            {(errorsArr.length > 0 && errorsArr.includes('emergencyPhone')) && <Text>This is required.</Text>}


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
        height: '90%',
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
