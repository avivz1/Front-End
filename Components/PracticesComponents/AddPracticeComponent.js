import { StyleSheet, Text, View, TextInput, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Snackbar } from 'react-native-paper'
import StudentCard from './StudentCheckBoxCard'
import { useDispatch, useSelector } from 'react-redux'





export default function AddPracticeComponent(props) {
    const { userId } = React.useContext(Context);
    const [userIdValue] = userId;
    const [index, setIndex] = React.useState(0);
    const [pickedTeam, setPickedTeam] = React.useState('');
    const [date, setDate] = useState(new Date());
    const [practiceName, setPracticeName] = useState()
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [pickedStudents, setPickedStudents] = useState('')
    const [checkedStudents, setCheckedStudents] = useState('')
    const [error, setError] = useState(false)

    const dispatch = useDispatch()
    const selectorArr = useSelector((s) => s.StudentSelected)


    useEffect(() => {
        dispatch({ type: "CLEAR" })
        if (props.teams.length > 0) {
            setPracticeName(props.teams[0].Name +' - ' +date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear())
            if (props.students.length > 0) {
                let stus = props.students.filter(s => s.Team_ID == props.teams[index]._id);
                setPickedStudents(stus)
            }
        } else {
            Alert.alert('You must create a team first')
            props.onAddPractice()
        }
    }, [])


    const showPicker = () => {
        setIsPickerShow(true);
    };

    const onChangeDate = (event, value) => {
        setIsPickerShow(false);

        if (value != undefined) {
            // (value.getDate())
            setDate(value);
            setPracticeName(pickedTeam?pickedTeam:props.teams[0].Name+' - ' +value.getDate() + '/' +0+ (value.getMonth() + 1) + '/' + value.getFullYear())
        }
    };

    const setChoosenTeam = (picked, index) => {
        setIndex(index)
        let stus = props.students.filter(s => s.Team_ID == props.teams[index]._id);
        setPickedStudents(stus)
        setPickedTeam(picked)
        setPracticeName(picked.Name+' - ' +date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear())

    }


    const onSubmit = (data) => {
        if (practiceName != '' && date) {
            let obj = {
                userid: userIdValue,
                _date: date,
                name: practiceName,
                teamID: props.teams[index]._id,
            }

            axios.post('http://' + IP + '/practices/addpractice', {
                practice: obj,
                allStudents: pickedStudents,
                chosenStudents: selectorArr.arr
            }).then(res => {
                if (res.data) {
                    props.onAddPractice()
                } else {
                    Alert.alert('ther was a problem try again')
                    props.onAddPractice()
                }
            })
        }else{
            setError(true)
        }

    }

    return (
        <View style={styles.container}>

            <TextInput style={styles.input} onChangeText={setPracticeName} value={practiceName}></TextInput>

            <TextInput type="date" onChangeText={setDate} value={date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()} placeholder='Date'></TextInput>

            <Button title='calendar' icon='calendar' onPress={showPicker} />

            {isPickerShow && (
                <DateTimePicker
                    value={date}
                    mode={'date'}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour={true}
                    onChange={onChangeDate}
                />
            )}

            < Picker
                selectedValue={props.teams.lenght > 0 ? pickedTeam : props.teams[index]}
                onValueChange={setChoosenTeam} >
                {
                    props.teams.map((team, index) => {
                        return (<Picker.Item key={index} label={team.Name} value={team}></Picker.Item>)
                    })
                }
            </Picker>

            <ScrollView>
                <View style={styles.container}>
                    {pickedStudents.length > 0 ? pickedStudents.map((stu, index) => {
                        return (
                            <View key={index}>
                                <StudentCard key={index} data={stu} />
                            </View>
                        )
                    }) : <Text>No Students</Text>}
                </View>

            </ScrollView>
            {error && <Text>Name OR Date are Required</Text>}
            <Button onPress={onSubmit}>Submit</Button>


        </View >

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
    },
    card: {
        margin: 8,
        height: 49,
        width: '80%',
        // alignContent: "center",
        // alignItems: 'center',
    }
});
