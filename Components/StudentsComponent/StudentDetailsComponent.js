import { StyleSheet, Text, View, Button, TextInput, ViewComponent, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { IP } from '../../IP_Address';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'



export default function ViewStudentComponent(props) {
    const { teamsMap } = React.useContext(Context);
    const [teamsNameMap, setMap] = teamsMap
    const [practicesList, setPractices] = useState([])
    const [okDates, setOkDates] = useState({})

    useEffect(() => {
        getStudentPracticesDetails()
    }, []);

    const getStudentPracticesDetails = () => {
        axios.post('http://' + IP + '/practices/getFewPractices', { practices: props.student.Practices }).then(res => {
            if (res.data != false) {
                let datesArr = []
                setPractices(res.data)
                res.data.forEach(pr => {
                    let d = pr.Date.split('T')
                    d = d[0]
                    //d = d.toString().replace(/-/g, '/')
                    datesArr.push(d)
                });
                processOkDates(datesArr)

            }
        })
    }

    const getTeamName = (teamId) => {
        let name = teamsNameMap.get(teamId);
        return name;
    }

    const processOkDates = (arr) => {
        let obj = {}
        // {'2022-04-07': {selected: true, marked: true, selectedColor: 'blue'}
        arr.forEach(date => {
            obj[date] = { selected: true, marked: true }
            return obj;
        });
        setOkDates(obj)
    }

    return (

        <View >
            <Text>Name : {props.student.Name}</Text>
            <Text>Belt : {props.student.Belt}</Text>
            <Text>Age : {props.student.Age}</Text>
            <Text>Team : {getTeamName(props.student.Team_ID)}  </Text>

            {/* <Text>{JSON.stringify(practicesList)}</Text> */}
            <Calendar
                markedDates={okDates}
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
