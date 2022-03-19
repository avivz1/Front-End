import { StyleSheet, Text, View, Button, TextInput, ViewComponent, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'
import { Context } from '../../ContextAPI/Context';



export default function ViewStudentComponent(props) {
    const { teamsMap } = React.useContext(Context);
    const [teamsNameMap, setMap] = teamsMap

    useEffect(() => {

    });

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
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 80 : 0,
        flex: 1,

    }
});
