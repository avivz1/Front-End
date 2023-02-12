import { StyleSheet, Text, View, Button, TextInput, ViewComponent, Platform, ScrollView, Alert, Linking, TouchableOpacity } from 'react-native';
import { useContext, useState, useEffect } from 'react'
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { IP } from '../../IP_Address';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'
import { DataTable } from 'react-native-paper'
import AddNewActivityComp from './AddNewStudentActivity'
import Overlay from 'react-native-modal-overlay';


export default function StudentDetailsComponent(props) {
    const dateOBject = new Date()
    const { teamsMap, userId } = useContext(Context);
    const [userIdValue] = userId;
    const [teamsNameMap, setMap] = teamsMap
    const [dates, setDates] = useState({})
    const [presentMonthPrecentage, setPresentMonthPrecentage] = useState('')
    const [eventsArr, setEventsArr] = useState({ attendance: [], activities: [] })
    const [newActivityEvent, setNewActivityEvent] = useState('')
    const [newActivityNote, setNewActivityNote] = useState('')
    const [newActivityDate, setNewActivityDate] = useState('')
    const [activities, setActivities] = useState(props.student.Activities ? props.student.Activities : [])
    const [activityInputErrors, setActivityInputErrors] = useState('')
    const [addActivityFlag, setAddActivityFlag] = useState(false)
    const [dayPress, setDayPress] = useState('')

    useEffect(() => {
        getStudentPracticesDetails()
    }, []);

    useEffect(() => {
        getPrecentageByMonth(dateOBject.getMonth() + 1);
        processDates();
    }, [eventsArr])

    const getAllActivities = () => {
        axios.post('http://' + IP + '/students/getstudentactivities', { userId: userIdValue, stuId: props.student._id }).then(res => {
            if (res.data) {
                setActivities(res.data)
            } else {
                Alert.alert('failed to get activities')
            }
        })
    }

    const isInputValid = () => {
        let arr = []
        if (newActivityEvent == '' || newActivityEvent == undefined) {
            arr.push('activityEventError')
        }
        if (newActivityNote == '' || newActivityNote == undefined) {
            arr.push('activityNoteError')
        }
        if (newActivityDate == '' || newActivityDate == undefined) {
            arr.push('activityDateError')
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
            axios.post('http://' + IP + '/students/addnewstudentactivity', { userId: userIdValue, stuId: props.student._id, activity: { Event: newActivityEvent, Note: newActivityNote, Date: newActivityDate } })
                .then(res => {
                    if (res.data) {
                        getAllActivities()
                        Alert.alert('Success')
                    } else {
                        console.log('Somthing went wrong')
                    }
                })
        } else {
            Alert.alert('empty activity details')
        }
    }

    const deleteActivity = (act) => {
        axios.post('http://' + IP + '/students/deleteactivity', { activity: act, userId: userIdValue, stuId: props.student._id }).then(res => {
            if (res.data) {
                getAllActivities()
            } else {
                Alert.alert('Error')
            }
        })
    }

    const getStudentPracticesDetails = () => {
        axios.post('http://' + IP + '/practices/getstudentattendents', { userId: userIdValue, stuId: props.student._id }).then(res => {
            if (res.data != false) {
                let presentArr = []
                // let activitiesArr = res.data.activities
                res.data.notPresentPractices.forEach(prac => {
                    let d = prac.Date.split('T');
                    d = d[0];
                    let obj = {
                        was: false,
                        date: d
                    }
                    presentArr.push(obj)
                });
                res.data.presentPractices.forEach(prac => {
                    let d = prac.Date.split('T');
                    d = d[0];
                    let obj = {
                        was: true,
                        date: d
                    }
                    presentArr.push(obj)
                });
                let obj = { attendance: presentArr, activities: res.data.activities }
                setEventsArr(obj)
            }
        })
    }

    const getPrecentageByMonth = (month) => {
        let obj = {}
        let arr = []
        eventsArr.attendance.forEach(practice => {
            let preDate = practice.date.split('-')
            preDate = preDate[1]
            if (preDate == month) {
                obj = practice;
                arr.push(obj);
            }
        })

        let wasNumber = arr.filter(p => p.was == true)
        setPresentMonthPrecentage((wasNumber.length / arr.length) * 100)
    }

    const processDates = () => {
        let obj = {}
        if (eventsArr.attendance.length > 0) {
            eventsArr.attendance.forEach(details => {
                if (details.was) {
                    obj[details.date] = { selected: true, marked: true, selectedColor: 'blue' }
                } else {
                    obj[details.date] = { selected: true, marked: true, selectedColor: 'red' }
                }
                return obj;
            });
        }
        if (eventsArr.activities.length > 0) {
            eventsArr.activities.forEach(activity => {

                if (activity.Date in obj) {
                    if (obj[activity.Date].selectedColor == "blue") {
                        obj[activity.Date] = { selected: true, marked: true, selectedColor: 'blue', dotColor: 'black' }

                    } else {
                        obj[activity.Date] = { selected: true, marked: true, selectedColor: 'red', dotColor: 'black' }

                    } 
                }else{
                    obj[activity.Date] = { marked: true, dotColor: 'green' }
                }
                return obj;
            })
        }
        setDates(obj)
    }

    const monthChange = (data) => {
        let d = '0' + data.month
        getPrecentageByMonth(d)
        processDates();
    }

    const getTeamName = (teamId) => {
        let name = teamsNameMap.get(teamId);
        return name;
    }

    const onRowLongPress = (data) => {
        Alert.alert('Delete This Activity?', data.Event, [
            { text: 'Cancel' },
            {
                text: 'Ok', onPress: () => {
                    deleteActivity(data)
                }
            }
        ])
    }

    const openDialer = (phone) => {
        Linking.openURL(`tel:${phone}`);
    }

    const onDayPress = (date) => {
        setDayPress(date.dateString)
        setAddActivityFlag(true)
    }

    const onAddActivity = () => {
        setAddActivityFlag(false)
        getStudentPracticesDetails()
    }

    const handelErrorOnAddActivity = () => {
        Alert.alert('somthing went wrong try again')
    }


    return (

        <View style={{ height: '80%' }}>
            <Text>Name : {props.student.Name}</Text>
            <TouchableOpacity onPress={() => openDialer(props.student.Phone)}>
                <Text>Phone :{props.student.Phone}</Text>
            </TouchableOpacity>
            <Text>Belt : {props.student.Belt}</Text>
            <Text>Age : {props.student.Age}</Text>
            <Text>Team : {getTeamName(props.student.Team_ID)}  </Text>
            <Text>Precentage By Month :{presentMonthPrecentage ? presentMonthPrecentage.toFixed(2) : 0}%  </Text>
            <Text>City : {props.student.City}</Text>
            <Text> Emergency Contact :</Text>
            <TouchableOpacity onPress={() => openDialer(props.student.EmergencyContact.Phone)}>
                <Text>Emergency Phone :{props.student.EmergencyContact.Phone}</Text>
            </TouchableOpacity>
            <ScrollView style={{ height: '50%' }}>
                <Calendar
                    onDayPress={onDayPress}
                    onMonthChange={monthChange}
                    markedDates={dates}
                />

                <DataTable style={{ width: '100%', paddingTop: 30 }} >

                    <DataTable.Header style={{ backgroundColor: '#ADD8E6', fontWeight: 'bold' }}>
                        <DataTable.Title style={{ fontWeight: 'bold' }}>Event</DataTable.Title>
                        <DataTable.Title style={{ fontWeight: 'bold' }}>Note</DataTable.Title>
                        <DataTable.Title style={{ fontWeight: 'bold' }}>Date</DataTable.Title>
                    </DataTable.Header>

                    <ScrollView>
                        {activities.length > 0 ? activities.map((act) => {
                            return (
                                <DataTable.Row key={act._id} onLongPress={() => onRowLongPress(act)} onPress={() => { }}>
                                    <DataTable.Cell>{act.Event}</DataTable.Cell>
                                    <DataTable.Cell>{act.Note}</DataTable.Cell>
                                    <DataTable.Cell>{act.Date}</DataTable.Cell>
                                </DataTable.Row>
                            )
                        })
                            :
                            <Text onPress={() => { }}>No Activities</Text>
                        }
                    </ScrollView>

                </DataTable>
                {/* <View style={{ margin: 30 }}>
                    <Text style={[styles.mainHeadLines]}>Add Activity </Text>
                    <Text style={[styles.smallHeadLines]}>Add Event </Text>
                    <TextInput placeholder='New Activity Event' onChangeText={(event) => setNewActivityEvent(event)} />
                    {activityInputErrors.includes('activityEventError') && <Text>This is required</Text>}
                    
                    <Text style={[styles.smallHeadLines]}>Add Note </Text>
                    <TextInput placeholder='New Activity Note' onChangeText={(note) => setNewActivityNote(note)} />
                    {activityInputErrors.includes('activityNoteError') && <Text>This is required</Text>}
                    
                    <Text style={[styles.smallHeadLines]}>Date </Text>
                    <TextInput placeholder='New Activity Date' onChangeText={(date) => setNewActivityDate(date)} />
                    {activityInputErrors.includes('activityDateError') && <Text>This is required</Text>}
                    
                    <Button title='Add new Activity' onPress={() => addNewActivity()} />
                </View> */}
            </ScrollView>
            <Overlay visible={addActivityFlag} onClose={() => setAddActivityFlag(false)} closeOnTouchOutside>
                {addActivityFlag && <AddNewActivityComp studentID={props.student._id} data={dayPress} onError={handelErrorOnAddActivity} onSuccess={onAddActivity} onCancel={() => setAddActivityFlag(false)} />}
            </Overlay>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 80 : 0,
        flex: 1,
    },
    smallHeadLines: {
        fontWeight: 'bold'
    },
    mainHeadLines: {
        fontWeight: 'bold',
        margin: 10
    }
});
