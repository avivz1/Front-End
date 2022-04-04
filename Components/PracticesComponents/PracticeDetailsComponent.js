import { StyleSheet, Text, View, Button, TextInput, ViewComponent, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'
import { Context } from '../../ContextAPI/Context';



export default function PracticeDetailsComponent(props) {

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
            <Text>Name : {props.practice.Name}</Text>
            <Text>Date : {props.practice.Date}</Text>
            <Text>Hour : {props.practice.PracticeHour}</Text>
            <Text>Students : {JSON.stringify(props.practice.Students)}</Text>
            <Text>Team : {getTeamName(props.practice.Team.Team_ID)}  </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 80 : 0,
        flex: 1,

    }
});
