import { StyleSheet, Text, View, TextInput, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Snackbar } from 'react-native-paper'
import { getDrawerStatusFromState } from '@react-navigation/drawer';
import StudentCard from './StudentCheckBoxCard'
import { useDispatch, useSelector } from 'react-redux'




export default function EditPracticeComponent(props) {
    const { userId, teamsMap } = React.useContext(Context);
    const [teamsNameMap, setMap] = teamsMap
    const [userIdValue] = userId;

    const [isPickerShow, setIsPickerShow] = useState(false);
    const [pickedStudents, setPickedStudents] = useState([])
    const [checkedStudents, setCheckedStudents] = useState('')
    const [date, setDate] = useState(new Date(props.practice.Date));
    const [teamName, setTeamName] = useState('')
    const dispatch = useDispatch()
    const selectorArr = useSelector((s) => s.StudentSelected)

    useEffect(() => {
        dispatch({ type: "CLEAR" })
        if (props.practice.Team.Name == null || props.practice.Team.Name == '') {
            let team = props.allTeams.filter(t => t._id == props.practice.Team.Team_ID)
            setTeamName(team[0].Name)
        } else {
            setTeamName(props.practice.Team.Name)
        }

        if (props.practice.Students.length > 0) {
            getStudentsList()
        }

    }, [])


    const getStudentsList = () => {
        axios.post('http://' + IP + '/practices/getstudentlistforpratice', { practiceId: props.practice._id, students: props.practice.Students, userId: userIdValue }).then((res => {
            if (res.data != false) {
                setPickedStudents(res.data);
            }
        }))

    }

    const showPicker = () => {
        setIsPickerShow(true);
    };

    const onChange = (event, value) => {
        setIsPickerShow(false);
        if (value != undefined) {
            setDate(value);
        }
    };

    const setPracticeName = (data) => {
        props.practice.Name = data
    }

    const updateStudentList = (data) => {
    }

    const onSubmit = (data) => {
        let obj = {
            userid: userIdValue,
            _date: date,
            name: props.practice.Name,
            teamID: props.practice.Team.Team_ID,
            _id: props.practice._id
        }
        
        axios.post('http://' + IP + '/practices/updatepractice', {
            practice: obj,
            allStudents: pickedStudents,
            chosenStudents: selectorArr.arr
        }).then(res => {
            if (res.data) {
                props.onPracticeUpdate()
            } else {
                Alert.alert('there was a problem try again')
                props.onPracticeUpdate()
            }
        })
    }


    return (
        <View style={styles.container}>
            <TextInput style={styles.input} onChangeText={setPracticeName} defaultValue={props.practice.Name} placeholder='Practice Name'></TextInput>
            <TextInput type="date" onChangeText={setDate} value={date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()} placeholder='Date'></TextInput>

            <Button title='calendar' icon='calendar' onPress={showPicker} />

            {isPickerShow && (
                <DateTimePicker
                    value={date}
                    mode={'date'}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour={true}
                    onChange={onChange}
                />
            )}

            <Text>{teamName}</Text>

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


            <Button onPress={() => onSubmit()}>Submit</Button>


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
    }
});
