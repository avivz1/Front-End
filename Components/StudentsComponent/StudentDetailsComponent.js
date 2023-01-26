import { StyleSheet, Text, View, Button, TextInput, ViewComponent, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { IP } from '../../IP_Address';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'



export default function ViewStudentComponent(props) {
    const dateOBject = new Date()
    const { teamsMap, userId } = React.useContext(Context);
    const [userIdValue] = userId;
    const [teamsNameMap, setMap] = teamsMap
    const [dates, setDates] = useState({})
    const [presentMonthPrecentage, setPresentMonthPrecentage] = useState('')
    const [attendanceArray, setAttendanceArray] = useState([])



    useEffect(() => {
        getStudentPracticesDetails()
    }, []);
    
    useEffect(()=>{
        getPrecentageByMonth(dateOBject.getMonth() + 1);
        processDates();
    },[attendanceArray])


    const getStudentPracticesDetails = () => {
        axios.post('http://' + IP + '/practices/getstudentattendents', { userId: userIdValue, stuId: props.student._id }).then(res => {
            if (res.data != false) {
                let arr = []
                res.data.notPresentPractices.forEach(prac => {
                    let d = prac.Date.split('T');
                    d = d[0];
                    let obj = {
                        was: false,
                        date: d
                    }
                    arr.push(obj)
                });
                res.data.presentPractices.forEach(prac => {
                    let d = prac.Date.split('T');
                    d = d[0];
                    let obj = {
                        was: true,
                        date: d
                    }
                    arr.push(obj)
                });
                setAttendanceArray(arr)
            }
        })
    }



    const getPrecentageByMonth = (month) => {
        let obj = {}
        let arr = []
        attendanceArray.forEach(practice => {
            let preDate = practice.date.split('-')
            preDate = preDate[1]
            if (preDate == month) {
                obj=practice;
                arr.push(obj);
            }
        })

        // let byMonth = attendanceArray.filter(pra => {
        //     if (preDate == '0' + month) {
        //         obj = pra;
        //     }
        //     return obj;
        // })
        let wasNumber = arr.filter(p => p.was == true)
        setPresentMonthPrecentage((wasNumber.length / arr.length) * 100)
    }



    const processDates = () => {
        let obj = {}
        attendanceArray.forEach(details => {
            if (details.was && details) {
                obj[details.date] = { selected: true, marked: true, selectedColor: 'blue' }
            } else {
                obj[details.date] = { selected: true, marked: true, selectedColor: 'red' }
            }
            return obj;
        });
        setDates(obj)
    }

    const monthChange = (data) => {
        let d = '0'+data.month
        getPrecentageByMonth(d)
        processDates();
    }

    const getTeamName = (teamId) => {
        let name = teamsNameMap.get(teamId);
        return name;
    }

    return (

        <View >
            <Text>Name : {props.student.Name}</Text>
            <Text>Belt : {props.student.Belt}</Text>
            <Text>Age : {props.student.Age}</Text>
            <Text>Team : {getTeamName(props.student.Team_ID)}  </Text>
            <Text>Precentage By Month :{presentMonthPrecentage ? presentMonthPrecentage.toFixed(2) : 0}%  </Text>
            <Text>City : {props.student.City}</Text>

            {/* <Text>{JSON.stringify(practicesList)}</Text> */}
            <Calendar
                onMonthChange={monthChange}
                markedDates={dates}
            />
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 80 : 0,
        flex: 1,

    }
});
