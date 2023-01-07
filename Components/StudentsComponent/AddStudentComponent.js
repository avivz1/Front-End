import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';
import BeltsPickerComponent from '../../Utils/BeltsColors'
import CitiesFile from '../../Utils/json.json'

export default function AddStudentsComponent(props) {

    const { userId } = React.useContext(Context);
    const [userIdValue] = userId;
    const [index, setIndex] = React.useState(0);
    const [pickedTeam, setPickedTeam] = React.useState('');
    const [stuBelt, setStuBelt] = React.useState('')
    const [stuName, setStuName] = React.useState('')
    const [stuCity, setStuCity] = React.useState('')
    const [stuAge, setStuAge] = React.useState('')
    const [errorsArr, setErrorsArr] = React.useState([])
    // const { control, handleSubmit, formState: { errors }, reset } = useForm()
    let citiesFile = CitiesFile;

    // useEffect(()=>{
    //     let a = citiesFile.map((x)=>{console.log(x.yeshuv)})
    // })

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
        if (stuCity == '' || stuCity == undefined) {
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

        if (!isNaN(stuAge)) {
            Alert.alert('Age is not a Number! try again')
        } else if (props.teams.length > 0) {
            axios.post('http://' + IP + '/students/addstudent', {
                userid: userIdValue,
                teamID: pickedTeam ? pickedTeam._id : props.teams[index],
                name: stuName,
                belt: stuBelt,
                city: stuCity,
                age: stuAge,
            }).then(res => {
                if (res.data) {
                    Alert.alert('Student Was Added')
                    props.onAddClostModal()
                } else {
                    Alert.alert("Somthing went wrong. Try again")
                }
            })
        } else {
            Alert.alert('You Must Have a team before creating a student')
            props.onAddClostModal()

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
      

            <Text>Student City : </Text>
            <TextInput keyboardType='ascii-capable' style={[styles.inputText]} placeholder='Enter City' onChangeText={(city) => setStuCity(city)} />
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
        flex:0,
        height: '80%',
        width: '100%',
        backgroundColor: '#fff',
        fontSize: 10,
        

    },

    inputText: {
        borderWidth: 1,
    }

});
