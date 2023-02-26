import { StyleSheet, Text, View, Button, TextInput, ViewComponent, Platform, ScrollView, Alert, Linking, TouchableOpacity } from 'react-native';
import { useContext, useState, useEffect,useRef } from 'react'
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { IP } from '../../IP_Address';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'
import { DataTable } from 'react-native-paper'
import AddNewActivityComp from './AddNewStudentActivity'
import Overlay from 'react-native-modal-overlay';
import CustomAlert from '../../Utils/CustomAlert'


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
    const [pickedDate, setPickedDate] = useState({ pickedMonth: (dateOBject.getMonth() + 1) > 9 ? dateOBject.getMonth + 1 : '0' + (dateOBject.getMonth() + 1), pickedYear: dateOBject.getFullYear() })
    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();



    useEffect(() => {
        getAllActivities()
    }, [addActivityFlag])

    useEffect(() => {
        getStudentPracticesDetails()
    }, []);

    useEffect(() => {
        getPrecentageByMonth(pickedDate.pickedMonth, pickedDate.pickedYear);
        processDates();
    }, [eventsArr])

    const getAllActivities = () => {
        axios.post('http://' + IP + '/students/getstudentactivities', { userId: userIdValue, stuId: props.student._id }).then(res => {
            if (res.data) {
                setActivities(res.data)
            } else {
                alertRef.current.setMsg('failed to get activities')
                setIsAlertHandle(true)
                alertRef.current.focus()
                // Alert.alert('failed to get activities')
            }
        })
    }

    const deleteActivity = (act) => {
        axios.post('http://' + IP + '/students/deleteactivity', { activity: act, userId: userIdValue, stuId: props.student._id }).then(res => {
            if (res.data) {
                getAllActivities()
            } else {
                alertRef.current.setMsg('Failed to delete Activity. try again')
                setIsAlertHandle(true)
                alertRef.current.focus()
                // Alert.alert('Error')
            }
        })
    }

    const getStudentPracticesDetails = () => {
        axios.post('http://' + IP + '/practices/getstudentattendants', { userId: userIdValue, stuId: props.student._id }).then(res => {
            if (res.data != false) {
                let presentArr = []
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

    const getPrecentageByMonth = (month, year) => {
        setPickedDate({ pickedMonth: month, pickedYear: year });
        let obj = {}
        let arr = []
        eventsArr.attendance.forEach(practice => {
            let preDate = practice.date.split('-')
            let practiceMonth = preDate[1]
            let practiceYear = preDate[0]
            if (practiceMonth.toString() == month.toString() && practiceYear.toString() == year.toString()) {
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
                } else {
                    obj[activity.Date] = { marked: true, dotColor: 'green' }
                }
                return obj;
            })
        }
        // let day = dateOBject.getDate() > 9 ? dateOBject.getDate() : '0' + (dateOBject.getDate())
        // let month = dateOBject.getMonth() > 9 ? dateOBject.getMonth() : '0' + (dateOBject.getMonth()+1)
        // let year = dateOBject.getFullYear()
        // let currentDate = year + '-' + month + '-' + day
        // obj[currentDate] = { dotColor: 'lightblue' , selected: true, marked: true, selectedColor: 'lightBlue' }
        setDates(obj)
    }

    const monthChange = (data) => {
        let month = '0' + data.month
        getPrecentageByMonth(month, data.year)
        processDates();
    }

    const getTeamName = (teamId) => {
        let name = teamsNameMap.get(teamId);
        return name;
    }

    const onRowLongPress = (data) => {
        alertRef.current.setMsg('Delete This Activity ? - ' +data.Event)
        setIsAlertHandle(false)
        alertRef.current.focus()
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
        alertRef.current.setMsg('Somthing went wrong try again.')
        setIsAlertHandle(true)
        alertRef.current.focus()
    }

    const callbackFromAlert = ()=>{
        deleteActivity(data)
    }

    return (

        <View style={{ height: '80%' }}>
            <CustomAlert oneBtn={alertOneBtn} selfHandle={isAlertHandle} callback={callbackFromAlert} ref={alertRef} />

            <Text>Name : {props.student.Name}</Text>
            <TouchableOpacity onPress={() => openDialer(props.student.Phone)}>
                <Text>Phone :{props.student.Phone}</Text>
            </TouchableOpacity>
            <Text>Belt : {props.student.Belt}</Text>
            <Text>Age : {props.student.Age}</Text>
            <Text>Team : {getTeamName(props.student.Team_ID)}  </Text>
            <Text>Precentage By Month :{presentMonthPrecentage ? presentMonthPrecentage.toFixed(2) : 0}%  </Text>
            <Text>City : {props.student.City}</Text>
            <Text> Emergency Contact :{props.student.EmergencyContact.Name}</Text>
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
