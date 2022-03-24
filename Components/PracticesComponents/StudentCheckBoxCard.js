import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Card, Button, Checkbox } from 'react-native-paper'


export default function StudentCheckBoxCard(props) {

    const [checked, setChecked] = React.useState(false);

    return (
        <View >
            <Card style={styles.mainCardViewFlag} >
                <Text  >{props.data.Name}</Text>
                <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setChecked(!checked);
                        props.callBack(props.data._id)
                    }} />
            </Card>



        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 0 : 0,
        paddingEnd: 10,
        margin: 10,



    },
    title: {
        textAlign: 'right'
    },
    card: {
        height: 100,
        width: 100,
        fontSize: 100,
    },
    tinyLogo: {
        width: 50,
        height: 35,
    },
    mainCardView: {
        margin: 10,
        height: 70,
        borderRadius: 15,
        shadowRadius: 8,
        elevation: 8,
        paddingLeft: 16,
        paddingRight: 14,



    },
    mainCardViewFlag: {
        margin: 10,
        height: 60,
        borderRadius: 15,
        shadowRadius: 8,
        elevation: 8,
        paddingLeft: 16,
        paddingRight: 14,
    },
    ButtoNStyle: {
        borderRadius: 25,

    }

});