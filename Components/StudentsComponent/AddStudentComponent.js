import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';


export default function AddStudentsComponent(props) {

    const { userId } = React.useContext(Context);
    const [userIdValue] = userId;
    const [index, setIndex] = React.useState(0);
    const [pickedTeam, setPickedTeam] = React.useState('');
    const { control, handleSubmit, formState: { errors }, reset } = useForm()


    useEffect(() => {

    }, [])

    const setChoosenTeam = (picked, index) => {
        setPickedTeam(picked)
        setIndex(index)
    }





    const onSubmit = (data) => {
        if (!isNaN(data.age)) {
            Alert.alert('Age is not a Number! try again')
        } else if (props.teams.length > 0) {
            axios.post('http://' + IP + '/students/addstudent', {
                userid: userIdValue,
                teamID: pickedTeam ? pickedTeam._id : props.teams[index],
                name: data.stuName,
                belt: data.stuBelt,
                city: data.stuCity,
                age: data.stuAge,
            }).then(res => {
                if (res.data) {
                    Alert.alert('Student Was Added')
                    props.onAddClostModal()
                } else {
                    Alert.alert("Somthing went wrong. Try again")
                }
            })
        } else {
            Alert.alert('You Must Have a team before creating a student')
            props.onAddClostModal()

        }
    }

    return (

        <View style={styles.container}>
            <Picker
                selectedValue={props.teams.lenght > 0 ? pickedTeam : props.teams[index]}
                onValueChange={setChoosenTeam}>
                {props.teams.map((team, index) => {
                    return (<Picker.Item key={index} label={team.Name} value={team}></Picker.Item>)
                })}
            </Picker>

            <Text>Student Name : </Text>
            <Controller
                control={control}
                name="stuName"
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        defaultValue={''}

                    />
                )}
            />
            {errors.stuName && <Text>This is required.</Text>}


            <Text>Student Age : </Text>
            <Controller
                control={control}
                name="stuAge"
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        defaultValue={''}
                    />
                )}
            />
            {errors.stuAge && <Text>This is required.</Text>}


            <Text>Student Belt : </Text>
            <Controller
                control={control}
                name="stuBelt"
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        defaultValue={''}
                    //placeholder={allTeams.length>0?allTeams[index].City:'No Cities'}

                    />
                )}
            />
            {errors.stuBelt && <Text>This is required.</Text>}

            <Text>Student City : </Text>
            <Controller
                control={control}
                name="stuCity"
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        defaultValue={''}
                    />
                )}
            />
            {errors.stuCity && <Text>This is required.</Text>}

            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>





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
