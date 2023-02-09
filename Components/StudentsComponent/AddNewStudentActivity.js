import { StyleSheet, Text, View, Button, TextInput, ViewComponent, Platform, ScrollView, Alert, Linking, TouchableOpacity } from 'react-native';
import { useContext, useState, useEffect } from 'react'
import { IP } from '../../IP_Address';
import axios from 'axios';
import { Context } from '../../ContextAPI/Context';





export default function AddNewStudentActivity(props) {

    const { userId } = useContext(Context);
    const [userIdValue] = userId;
    const [newActivityEvent, setNewActivityEvent] = useState('')
    const [newActivityNote, setNewActivityNote] = useState('')
    const [activityInputErrors, setActivityInputErrors] = useState('')

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
        if (isInputValid) {
            axios.post('http://' + IP + '/students/addnewstudentactivity', { userId: userIdValue, stuId: props.studentID, activity: { Event: newActivityEvent, Note: newActivityNote, Date: props.data ? props.data : '' } })
                .then(res => {
                    if (res.data) {
                        props.onSuccess()
                        Alert.alert('Success')
                    } else {
                        props.onError()
                    }
                })
        } else {
            Alert.alert('empty activity details')
        }
    }

    const handelCancel = () => {
        props.onCancel()
    }

    return (
        <View>
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