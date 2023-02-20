import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useContext, useState, useEffect,useRef } from 'react'
import { IP } from '../../IP_Address';
import axios from 'axios';
import { Context } from '../../ContextAPI/Context';
import textValidation from '../../Services/TextValidation'





export default function AddNewStudentActivity(props) {

    const { userId } = useContext(Context);
    const [userIdValue] = userId;
    const [newActivityEvent, setNewActivityEvent] = useState('')
    const [newActivityNote, setNewActivityNote] = useState('')
    const [activityInputErrors, setActivityInputErrors] = useState('')
    const { isInputOk } = textValidation;
    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();

    const isInputValid = () => {
        let arr = []
        if (newActivityEvent == '' || newActivityEvent == undefined) {
            arr.push('activityEventError')
        }
        if (newActivityNote == '' || newActivityNote == undefined) {
            arr.push('activityNoteError')
        }

        if (arr.length == 0) {
            setActivityInputErrors([])
            return true;
        } else {
            setActivityInputErrors(arr)
            return false;
        }
    }

    const addNewActivity = () => {
        let input = isInputOk([{ activityEventError: newActivityEvent }, { activityNoteError: newActivityNote }])
        if (input.status) {
            axios.post('http://' + IP + '/students/addnewstudentactivity', { userId: userIdValue, stuId: props.studentID, activity: { Event: newActivityEvent, Note: newActivityNote, Date: props.data ? props.data : '' } })
                .then(res => {
                    if (!res.data) {
                        props.onSuccess()
                    } else {
                        props.onError()
                    }
                })
        } else {
            setActivityInputErrors(input.data)
            // Alert.alert('empty activity details')
            alertRef.current.setMsg('Empty activity details. try again')
            setIsAlertHandle(true)
            alertRef.current.focus()
        }
    }

    const handelCancel = () => {
        props.onCancel()
    }

    return (
        <View>
            <CustomAlert oneBtn={alertOneBtn} selfHandle={isAlertHandle} ref={alertRef} />

            <Text style={[styles.mainHeadLines]}>Add Activity {props.data.split('-').reverse().join('-')} </Text>
            <Text style={[styles.smallHeadLines]}>Add Event </Text>
            <TextInput placeholder='New Activity Event' onChangeText={(event) => setNewActivityEvent(event)} />
            {activityInputErrors.includes('activityEventError') && <Text>This is required</Text>}

            <Text style={[styles.smallHeadLines]}>Add Note </Text>
            <TextInput placeholder='New Activity Note' onChangeText={(note) => setNewActivityNote(note)} />
            {activityInputErrors.includes('activityNoteError') && <Text>This is required</Text>}

            <Button title='Add' onPress={() => addNewActivity()} />
            <Button title='Cancel' onPress={() => handelCancel()} />

        </View>
    )
}

const styles = StyleSheet.create({
    smallHeadLines: {
        fontWeight: 'bold'
    },
    mainHeadLines: {
        fontWeight: 'bold',
        margin: 10
    }
});