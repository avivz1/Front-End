import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Button, Checkbox } from 'react-native-paper'
import axios from "axios";
import {useDispatch} from 'react-redux'


export default function StudentCheckBoxCard(props) {

    const [checked, setChecked] = React.useState(false);
    const [isDeleted, setIsDeleted] = React.useState(false);
    const dispatch = useDispatch();

    
    useEffect(() => {
        if (props.data.isChecked) {
            setChecked(props.data.isChecked)
            if(props.data.isChecked==true){
                dispatch({type:"ADD",newItem:props.data._id})
            }
        }
        if (props.data.isDeleted == true) {
            setIsDeleted(true)
        } else {
            setIsDeleted(false)

        }
    }, [])


    return (
        <View >
            <Card onPress={() => { }} style={styles.mainCardViewFlag} >
                <Text style={isDeleted ? styles.deleted : styles.notDeleted} >{isDeleted ? 'This Student Was Deleted || ' + props.data.Name : props.data.Name}</Text>
                {!isDeleted &&
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
                            dispatch({type:"ADD",newItem:props.data._id})
                        }} />
                }
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
    deleted: {
        backgroundColor: '#FC5252'
    },
    notDeleted: {
        backgroundColor: '#7AA1DD'
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