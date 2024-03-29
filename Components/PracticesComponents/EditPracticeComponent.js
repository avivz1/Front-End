import { StyleSheet, Text, View, TextInput, Alert, ScrollView } from 'react-native';
import { useState, useEffect, useRef,useContext } from 'react';
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { IP } from '../../IP_Address';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Snackbar } from 'react-native-paper'
import StudentCard from './StudentCheckBoxCard'
import { useDispatch, useSelector } from 'react-redux'
import CustomAlert from '../../Utils/CustomAlert'




export default function EditPracticeComponent(props) {
    const { userId, teamsMap } = useContext(Context);
    const [userIdValue] = userId;

    const [isPickerShow, setIsPickerShow] = useState(false);
    const [pickedStudents, setPickedStudents] = useState([])
    const [practiceName, setPracticeName] = useState('')
    const [errorSubmit, setErrorSubmit] = useState(false)
    const [date, setDate] = useState(new Date(props.practice.Date.split('T')[0]));
    const [teamName, setTeamName] = useState('')
    const dispatch = useDispatch()
    const selectorArr = useSelector((s) => s.StudentSelected)
    const practiceNameRef = useRef();
    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();

    useEffect(() => {
        if (props.practice) {
            setPracticeName(props.practice.Name)
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
            handelPracticeName(value)
        }
    };

    const handelPracticeName = (fullDate) => {
        let day = fullDate.getDate() > 9 ? fullDate.getDate() : '0' + (fullDate.getDate())
        let month = fullDate.getMonth() > 9 ? fullDate.getMonth() + 1 : '0' + (fullDate.getMonth() + 1)
        let fullName = teamName + ' - ' + day + '/' + month + '/' + fullDate.getFullYear()
        practiceNameRef.current.setNativeProps({ text: fullName });
        setPracticeName(fullName)
    }

    const onSubmit = () => {
        if (practiceName == '' || practiceName == null || practiceName.length == 0) {
            setErrorSubmit(true)
        } else {
            let obj = {
                userid: userIdValue,
                _date: date,
                name: practiceName,
                teamID: props.practice.Team.Team_ID,
                _id: props.practice._id
            }

            axios.post('http://' + IP + '/practices/updatepractice', {
                practice: obj,
                allStudents: pickedStudents,
                chosenStudents: selectorArr.arr
            }).then(res => {
                if (res.data) {
                    alertRef.current.setMsg('Updated!')
                    setIsAlertHandle(false)
                    alertRef.current.focus()
                } else {
                    alertRef.current.setMsg('Somthing went wrong. try again')
                    setIsAlertHandle(false)
                    alertRef.current.focus()

                }
            })
        }

    }

    const callBackFromAlert = () => {
        props.onPracticeUpdate()
    }

    return (
        <View style={styles.container}>
            <CustomAlert oneBtn={alertOneBtn} selfHandle={isAlertHandle} callback={callBackFromAlert} ref={alertRef} />

            <Text ref={practiceNameRef} style={styles.text} defaultValue={props.practice.Name} placeholder='Practice Name'>{practiceName}</Text>
            {errorSubmit && <Text>This is required.</Text>}

            <Text style={{ float: 'left', textAlign: 'right', margin: 3 }} type="date" placeholder='Date'> {date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()} </Text>

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
                    {pickedStudents.length > 0 ? pickedStudents.map((stu) => {
                        return (
                            <View key={stu._id}>
                                <StudentCard key={stu._id} data={stu} />
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
    text: {
        marginTop: 10,
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 15,
        padding: 10,
        textAlign: 'auto'
        // alignContent:'center',
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
