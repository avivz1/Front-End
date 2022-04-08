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
    const [practicesList, setPractices] = useState([])
    const [dates, setDates] = useState({})
    const [currentMonthDate, setCurrentMonthDate] = useState(dateOBject.getMonth() + 1)
    const [presentMonthPrecentage , setPresentMonthPrecentage] = useState('')


    useEffect(() => {
        getStudentPracticesDetails()
    }, []);

    const getStudentPracticesDetails = () => {
        axios.post('http://' + IP + '/practices/getstudentattendents', { userId: userIdValue, stuId: props.student._id }).then(res => {
            if (res.data != false) {
                let arr = [];
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
                getPrecentageByMonth(arr);
                processDates(arr);
            }
        })
    }

    const getTeamName = (teamId) => {
        let name = teamsNameMap.get(teamId);
        return name;
    }

    const getPrecentageByMonth = (arr)=>{
        let byMonth = arr.filter(pra=>{
            let preDate = pra.date.split('-')
            preDate= preDate[1]
            if(preDate==currentMonthDate){
                return pra;
            }
        })
        let wasNumber = byMonth.filter(p=>p.was==true)        
        setPresentMonthPrecentage((wasNumber.length/byMonth.length)*100)
    }
    
    const monthChange = (data)=>{
        setCurrentMonthDate(data.month)
    }

    const processDates = (arr) => {
        let obj = {}
        arr.forEach(details => {
            if (details.was) {
                obj[details.date] = { selected: true, marked: true, selectedColor: 'blue' }
            } else {
                obj[details.date] = { selected: true, marked: true, selectedColor: 'red' }
            }
            return obj;
        });
        setDates(obj)
    }

    return (

        <View >
            <Text>Name : {props.student.Name}</Text>
            <Text>Belt : {props.student.Belt}</Text>
            <Text>Age : {props.student.Age}</Text>
            <Text>Team : {getTeamName(props.student.Team_ID)}  </Text>
            <Text>Precentage By Month :{presentMonthPrecentage}%  </Text>

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
