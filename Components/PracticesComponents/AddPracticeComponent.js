import { StyleSheet, Text, View, TextInput, Alert ,ScrollView} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Snackbar } from 'react-native-paper'
import { getDrawerStatusFromState } from '@react-navigation/drawer';
import StudentCard from './StudentCheckBoxCard'





export default function AddPracticeComponent(props) {
    const { userId } = React.useContext(Context);
    const [userIdValue] = userId;
    const [index, setIndex] = React.useState(0);
    const [pickedTeam, setPickedTeam] = React.useState('');
    const [practiceName, setPracticeName] = useState('')
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [pickedStudents, setPickedStudents] = useState('')
    const [checkedStudents, setCheckedStudents] = useState('')


    useEffect(() => {
        if (props.teams.length > 0) {
            if(props.students.length > 0){
                let stus = props.students.filter(s=>s.Team_ID==props.teams[index]._id);
                setPickedStudents(stus)
            }
        }else{
            Alert.alert('No Team Found! you must have atlist 1 team')
            props.onAddPractice()
        }
    }, [])


    const showPicker = () => {
        setIsPickerShow(true);
    };

    const onChange = (event, value) => {
        setIsPickerShow(false);
        if (value != undefined) {
            setDate(value);
        }
    };

    const setChoosenTeam = (picked, index) => {
        setIndex(index)
        let stus = props.students.filter(s=>s.Team_ID==props.teams[index]._id);
        setPickedStudents(stus)
        setPickedTeam(picked)
        
    }

    const callBackCheckStudent = (stu_id)=>{
        checkedStudents.includes(stu_id)? setCheckedStudents(checkedStudents.filter(x=> x != stu_id)): setCheckedStudents([...checkedStudents,stu_id])
    }


    const onSubmit = (data) => {
        let obj ={
            userid:userIdValue,
            _date:date,
            name:practiceName,
            teamID:props.teams[index]._id,
        }

        axios.post('http://' + IP + '/practices/addpractice',{
            practice : obj,
            allStudents: pickedStudents,
            chosenStudents:checkedStudents 
        }).then(res=>{
            if(res.data){
                Alert.alert('Succesfully added')
                props.onAddPractice()
            }else{
                Alert.alert('ther was a problem try again')
                props.onAddPractice()
            }
        })
    }

    return (
        <View style={styles.container}>

            <TextInput style={styles.input} onChangeText={setPracticeName} placeholder='Practice Name'></TextInput>
            <TextInput type="date" onChangeText={setDate} value={date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()} placeholder='Date'></TextInput>

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

            <ScrollView>
                <View style={styles.container}>
                    {pickedStudents.length > 0 ? pickedStudents.map((stu, index) => {
                        return (
                            <View key={index}>
                                    <StudentCard key={index} callBack={callBackCheckStudent} data={stu} />
                            </View>
                        )
                    }) : <Text>No Students</Text>}
                </View>

            </ScrollView>

            <Button  onPress={onSubmit}>Submit</Button>


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
    },
    card: {
        margin: 8,
        height: 49,
        width:'80%',
        // alignContent: "center",
        // alignItems: 'center',
      }
});
