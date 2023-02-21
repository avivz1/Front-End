import { StyleSheet, Text, View,ScrollView } from 'react-native';
import { useState, useEffect, useRef,useContext } from 'react';
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper'
import StudentCard from './StudentCheckBoxCard'
import { useDispatch, useSelector } from 'react-redux'
import CustomAlert from '../../Utils/CustomAlert'




export default function AddPracticeComponent(props) {
    const { userId } = useContext(Context);
    const [userIdValue] = userId;
    const [index, setIndex] = useState(0);
    const [pickedTeam, setPickedTeam] = useState('');
    const [date, setDate] = useState(new Date());
    const [practiceName, setPracticeName] = useState('')
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [pickedStudents, setPickedStudents] = useState('')
    const [checkedStudents, setCheckedStudents] = useState('')
    const [error, setError] = useState(false)
    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();

    const dispatch = useDispatch()
    const selectorArr = useSelector((s) => s.StudentSelected)


    useEffect(() => {
        if (props.teams.length > 0) {
            dispatch({ type: "CLEAR" })
            // if (props.teams.length > 0) {
            let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
            let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
            setPracticeName(props.teams[0].Name + ' - ' + day + '/' + month + '/' + date.getFullYear())
            if (props.students.length > 0) {
                let stus = props.students.filter(s => s.Team_ID == props.teams[index]._id);
                setPickedStudents(stus)
            }
        } else {
            alertRef.current.setMsg('You must create a team before creating a practice')
            setIsAlertHandle(false)
            alertRef.current.focus()
            // props.onAddPractice()
        }
    }, [])

    useEffect(() => {
        let stus = props.students.filter(s => s.Team_ID == props.teams[index]._id);
        setPickedStudents(stus)
    }, [pickedTeam])

    const showPicker = () => {
        setIsPickerShow(true);
    };

    const onChangeDate = (event, value) => {
        setIsPickerShow(false);
        if (value != undefined) {
            setDate(value);
            let day = value.getDate() > 9 ? value.getDate() : '0' + value.getDate();
            let month = value.getMonth() + 1 > 9 ? value.getMonth() + 1 : '0' + (value.getMonth() + 1);
            let fullDate = day + '/' + month + '/' + value.getFullYear()
            let name = pickedTeam ? pickedTeam + ' - ' + fullDate : props.teams[0].Name + ' - ' + fullDate
            setPracticeName(name)
        }
    };

    const setChoosenTeam = (picked, index) => {
        setIndex(index)
        setPickedTeam(picked)
        let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
        let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
        setPracticeName(picked + ' - ' + day + '/' + month + '/' + date.getFullYear())

    }

    const onSubmit = () => {
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
                    alertRef.current.setMsg('There was a problem try again')
                    setIsAlertHandle(true)
                    alertRef.current.focus()
                    // props.onAddPractice()
                }
            })
        } else {
            setError(true)
        }

    }

    const handleAlertCallback = () => {
        props.onAddPractice()
    }


    return (
        <View style={styles.container}>
            <CustomAlert oneBtn={alertOneBtn} selfHandle={isAlertHandle} callback={() => handleAlertCallback()} ref={alertRef} />
            <Text>{practiceName}</Text>
            <Text>{date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()}</Text>
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
                selectedValue={pickedTeam ? pickedTeam : props.teams[index]}
                onValueChange={setChoosenTeam} >
                {
                    props.teams.map((team, index) => {
                        return (<Picker.Item key={team._id} label={team.Name} value={team.Name}></Picker.Item>)
                    })
                }
            </Picker>

            <ScrollView>
                <View style={styles.container}>
                    {pickedStudents.length > 0 ? pickedStudents.map((stu, index) => {
                        return (

                            <View key={stu._id}>
                                <StudentCard key={stu._id} data={stu} />
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
