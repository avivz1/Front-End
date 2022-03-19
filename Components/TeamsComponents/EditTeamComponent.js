import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Picker } from '@react-native-picker/picker';
import { IP } from "../../IP_Address";
import axios from 'axios';



export default function EditTeamComponent2(props) {

    const { control, handleSubmit, formState: { errors } } = useForm();


    useEffect(() => {

    }, [])


    const onSubmit = (data) => {
        axios.post('http://' + IP + '/teams/editteam', {
            name: data.teamName == '' || data.teamName == undefined ? props.team.Name : data.teamName,
            type: data.teamType == '' || data.teamType == undefined ? props.team.Type : data.teamType,
            city: data.teamCity == '' || data.teamCity == undefined ? props.team.City : data.teamCity,
            _id: props.team._id == '' || props.team._id != undefined ? props.team._id : '',
        }).then(res => {
            if (res.data == true) {
                Alert.alert('Team Updated')
                props.onTeamUpdate();
            } else {
                Alert.alert('Somthing went wrong try again');
            }
        })
    }

    return (

        <View styles={[styles.container]}>
            <Text>{props.team.Name}</Text>


            <View>
                <Text>Team Name : </Text>
                <Controller
                    control={control}
                    name="teamName"
                    rules={{
                        required: false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            defaultValue={props.team ? props.team.Name : ''}
                        />
                    )}
                />

                {errors.teamName && <Text>This is required.</Text>}


                <Text>Team Type : </Text>
                <Controller
                    control={control}
                    name="teamType"
                    rules={{
                        required: false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            defaultValue={props.team ? props.team.Type : ''}
                        />
                    )}
                />
                {errors.teamType && <Text>This is required.</Text>}


                <Text>Student City : </Text>
                <Controller
                    control={control}
                    name="teamCity"
                    rules={{
                        required: false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            defaultValue={props.team ? props.team.City : ''}
                        />
                    )}
                />
                {errors.teamCity && <Text>This is required.</Text>}

                <Button title="Submit" onPress={handleSubmit(onSubmit)} />

            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flex: 0,
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





