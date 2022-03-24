import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper'
import { getDrawerStatusFromState } from '@react-navigation/drawer';




export default function AddPracticeComponent(props) {
    const { userId } = React.useContext(Context);
    const [userIdValue] = userId;
    const [index, setIndex] = React.useState(0);
    const [pickedTeam, setPickedTeam] = React.useState('');
    const [practiceName, setPracticeName] = useState('')
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [date, setDate] = useState(new Date());



    const showPicker = () => {
        setIsPickerShow(true);
    };

    const onChange = (event, value) => {
        console.log(value)
        setIsPickerShow(false);
        if (value != undefined) {
            setDate(value);
        }
        // if (Platform.OS === 'android') {
        //     setIsPickerShow(false);
        // }
    };

    
    
    useEffect(() => {
        
    }, [])
    
    const setChoosenTeam = (picked, index) => {
        setPickedTeam(picked)
        setIndex(index)
    }
    
    const modifyDate = (d) => {
        let year = d.getFullYear() 
        let day = d.getDay() 
        let month = d.getMonth() 

        // let hours = d.getHours() 
        // let minutes = d.getMinutes()
        return day+'/'+month+'/'+year
    }

    const onSubmit = () => {

    }

    return (
        <View style={styles.container}>

            <TextInput onChangeText={setPracticeName} placeholder='Practice Name'></TextInput>
            <TextInput type="date" onChangeText={setDate} value={date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()} placeholder='Date'></TextInput>

            <Button title='calendar' icon='calendar' onPress={showPicker} />

            {isPickerShow && (
                <DateTimePicker
                    value={date}
                    mode={'date'}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour={true}
                    onChange={onChange}
                />
            )}

            < Picker
                selectedValue={props.teams.lenght > 0 ? pickedTeam : props.teams[index]}
                onValueChange={setChoosenTeam} >
                {
                    props.teams.map((team, index) => {
                        return (<Picker.Item key={index} label={team.Name} value={team}></Picker.Item>)
                    })
                }
            </Picker>


        </View >

    )

}




const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flex: 0,
        height: 450,
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
