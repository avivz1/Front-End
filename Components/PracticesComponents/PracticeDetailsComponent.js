import { StyleSheet, Text, View, Button, TextInput, ViewComponent, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { IP } from '../../IP_Address';
import { Picker } from '@react-native-picker/picker';





export default function PracticeDetailsComponent(props) {

    const { teamsMap,userId } = React.useContext(Context);
    const [teamsNameMap, setMap] = teamsMap
    const [precentage,setPrecentage] = useState('')
    const [userIdValue] = userId;
    const [index, setIndex] = React.useState(0);




    useEffect(() => {
        console.log(props.practice.Students)
        let x = props.practice.Date.split('T')
        props.practice.Date = x[0];
        getAttendancePrecent()
    }, []);

    const getTeamName = (teamId) => {
        let name = teamsNameMap.get(teamId);
        return name;
    }
    
    const onChangeIndex = (index) => {
        setIndex(index)
    }

    const getAttendancePrecent = () => {
        axios.post('http://' + IP + '/practices/attendancepercentage', { practice: props.practice ,userId:userIdValue}).then(res => {
        if(res.data!=false){
            setPrecentage(res.data)
        }
        })

    }
//{JSON.stringify(props.practice.Students)}
    return (

        <View >
            <Text>Name : {props.practice.Name}</Text>
            <Text>Date : {props.practice.Date}</Text>
            <Text>Hour : {props.practice.PracticeHour}</Text>
            <Text>Students :</Text>
            <Picker
                style={{ width: 100 }}
                selectedValue={props.practice.Students[index].Name}
                onValueChange={onChangeIndex}>
                {props.practice.Students.map((student1, index) => {
                    return (<Picker.Item key={index} label={student1._id} value={student1._id}></Picker.Item>)
                })
                }

            </Picker>
            <Text>Team : {getTeamName(props.practice.Team.Team_ID)}  </Text>
            <Text>Arrivel Precent : {precentage}%  </Text>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flex: 1,
        height: '40%',
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
    }
});

