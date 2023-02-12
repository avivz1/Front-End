import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Picker } from '@react-native-picker/picker';
import { IP } from "../../IP_Address";
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list'
import citiesFile from '../../Utils/citisListUpdated.json'
import BeltsPickerComponent from '../../Components/BeltsPickerComponent'
import textValidation from '../../Services/TextValidation.js'




export default function EditStudentsComponent(props) {

    const [index, setIndex] = useState(0);
    const [allCities, setAllCities] = useState(citiesFile)
    const [selectedCity, setSelectedCity] = useState(props.student ? props.student.City : '');
    const [errorsArr, setErrorsArr] = useState([])
    const [stuBelt, setStuBelt] = useState(props.student ? props.student.Belt : '')
    const [stuName, setStuName] = useState(props.student ? props.student.Name : '')
    const [stuAge, setStuAge] = useState(props.student ? props.student.Age.toString() : '')
    const [emergencyName, setEmergencyName] = useState(props.student ? props.student.EmergencyContact.Name : '');
    const [emergencyPhone, setEmergencyPhone] = useState(props.student ? props.student.EmergencyContact.Phone.toString() : '');
    const [studentPhone, setStudentPhone] = useState(props.student ? props.student.Phone.toString() : '');
    const { isInputOk } = textValidation;

    useEffect(() => {
        let index = props.teams.findIndex(team => team._id == props.student.Team_ID);
        setIndex(index);
    }, [])


    const onChangeIndex = (pickedTeam, index) => {
        setIndex(index)
    }

    const onBeltPicked = (belt) => {
        setStuBelt(belt)
    }

    // const isInputOk = () => {
    //     let arr = []
    //     if (stuName == '' || stuName == undefined) {
    //         arr.push('stuName')
    //     }
    //     if (studentPhone == '' || studentPhone == undefined) {
    //         arr.push('stuPhone')
    //     }
    //     if (emergencyName == '' || emergencyName == undefined) {
    //         arr.push('emergencyName')
    //     }
    //     if (emergencyPhone == '' || emergencyPhone == undefined) {
    //         arr.push('emergencyPhone')
    //     }
    //     if (stuAge == '' || stuAge == undefined) {
    //         arr.push('stuAge')
    //     }
    //     if (stuBelt == '' || stuBelt == undefined) {
    //         arr.push('stuBelt')
    //     }
    //     if (selectedCity == '' || selectedCity == undefined) {
    //         arr.push('stuCity')
    //     }
    //     if (arr.length == 0) {
    //         setErrorsArr([])
    //         return true;
    //     } else {
    //         setErrorsArr(arr)
    //         return false;
    //     }
    // }

    const onSubmit = () => {
        let input = isInputOk([{stuCity:selectedCity},{stuBelt:stuBelt},{stuAge:stuAge},{emergencyName:emergencyName},{emergencyPhone:emergencyPhone},{stuPhone:studentPhone},{stuName:stuName}])
        if (!input.status) {
            setErrorsArr(input.data)
            return;
        }

        axios.post('http://' + IP + '/students/editstudent', {
            name: stuName,
            belt: stuBelt,
            age: stuAge,
            city: selectedCity,
            studentId: props.student._id,
            Team_ID: props.teams ? props.teams[index]._id : props.student.Team_ID,
            phoneNum: studentPhone,
            emergencyContact: { Name: emergencyName, Phone: emergencyPhone }


        }).then(res => {
            if (res.data == true) {
                Alert.alert('Student Updated')
                props.onStudentUpdate();
            } else {
                Alert.alert('Somthing went wrong try again');
            }
        })
    }

    return (

        <View style={[styles.container]}>

            <Text>{props.student.Name}</Text>

            <Picker
                selectedValue={props.teams[index].Name}
                onValueChange={onChangeIndex}>
                {props.teams.map((team, index) => {
                    return (<Picker.Item key={index} label={team.Name} value={team.Name}></Picker.Item>)
                })
                }
            </Picker>


            <Text>Student Name : </Text>
            <TextInput keyboardType='ascii-capable' style={[styles.inputText]} value={stuName} placeholder='Enter Name' onChangeText={(name) => setStuName(name)} />
            {(errorsArr.length > 0 && errorsArr.includes('stuName')) && <Text>This is required.</Text>}

            <Text>Student Age : </Text>
            <TextInput keyboardType='numeric' style={[styles.inputText]} value={stuAge} placeholder='Enter age' onChangeText={(age) => setStuAge(age)} />
            {(errorsArr.length > 0 && errorsArr.includes('stuAge')) && <Text>This is required.</Text>}

            <Text>Student Phone : </Text>
            <TextInput keyboardType='numeric' style={[styles.inputText]} value={studentPhone} placeholder='Enter student phone' onChangeText={(sPhone) => setStudentPhone(sPhone)} />
            {(errorsArr.length > 0 && errorsArr.includes('stuPhone')) && <Text>This is required.</Text>}

            <Text>Emergency Contact Name : </Text>
            <TextInput keyboardType='ascii-capable' style={[styles.inputText]} value={emergencyName} placeholder='Enter emergency name' onChangeText={(eName) => setEmergencyName(eName)} />
            {(errorsArr.length > 0 && errorsArr.includes('emergencyName')) && <Text>This is required.</Text>}

            <Text>Emergency Contact Number : </Text>
            <TextInput keyboardType='numeric' style={[styles.inputText]} value={emergencyPhone} placeholder='Enter emergency phone' onChangeText={(ePhone) => setEmergencyPhone(ePhone)} />
            {(errorsArr.length > 0 && errorsArr.includes('emergencyPhone')) && <Text>This is required.</Text>}


            <SelectList
                defaultOption={{ key: props.student.City, value: props.student.City }}
                placeholder='Select City'
                setSelected={(cityName) => setSelectedCity(cityName)}
                data={allCities}
                save="value"
            />
            {(errorsArr.length > 0 && errorsArr.includes('stuCity')) && <Text>This is required.</Text>}


            <Text>Student Belt : </Text>
            <BeltsPickerComponent callback={onBeltPicked} data={props.student.Belt} />
            {(errorsArr.length > 0 && errorsArr.includes('stuBelt')) && <Text>This is required.</Text>}





            {/* <Controller
                    control={control}
                    name="stuName"
                    rules={{
                        required: false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            defaultValue={props.student ? props.student.Name : ''}
                        //placeholder={allTeams.length>0?allTeams[index].Name:'No Teams'}  //{pickedTeam.Name}

                        />
                    )}
                /> */}

            {/* {errors.stuName && <Text>This is required.</Text>} */}




            {/* 
                <Text>Student Age : </Text>
                <Controller
                    control={control}
                    name="stuAge"
                    rules={{
                        required: false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            defaultValue={props.student ? props.student.Age.toString() : ''}
                        //placeholder={allTeams.length>0?allTeams[index].Type:'No Teams'}


                        />
                    )}
                />
                {errors.stuAge && <Text>This is required.</Text>} */}

            {/* 
                <Text>Student Belt : </Text>
                <Controller
                    control={control}
                    name="stuBelt"
                    rules={{
                        required: false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            defaultValue={props.student ? props.student.Belt : ''}
                        />
                    )}
                />
                {errors.stuBelt && <Text>This is required.</Text>}

                <Text>Student City : </Text>

                <SelectList
                    placeholder='Select City'
                    setSelected={(cityName) => setSelectedCity(cityName)}
                    data={allCities}
                    save="value"
                /> */}



            <Button title="Submit" onPress={onSubmit} />


        </View>



    )


}




const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flex: 0,
        height: '70%',
        width: '70%',
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
    inputText: {
        borderWidth: 1,
    },


    editForm: {
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});





