import { StyleSheet, Text, View, Button, TextInput, ViewComponent, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'



export default function TeamDetailsComponent(props) {

 

    useEffect(()=>{

    });


    return (

        <View >
            <Text>Name : {props.team.Name}</Text>
            <Text>Type : {props.team.Type}</Text>
            <Text>City : {props.team.City}</Text>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 80 : 0,
        flex: 1,

    }
});
