import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { IP } from '../../IP_Address';


export default function AddTeamComponent2(props) {

    const { userId } = React.useContext(Context);
    const [userIdValue] = userId;
    const { control, handleSubmit, formState: { errors }, reset } = useForm()


    useEffect(() => {

    }, [])


    const onSubmit = (data) => {
        axios.post('http://' + IP + '/teams/addteam', {
            name: data.teamName == '' || data.teamName == undefined ? '' : data.teamName,
            type: data.teamType == '' || data.teamType == undefined ? '' : data.teamType,
            city: data.teamCity == '' || data.teamCity == undefined ? '' : data.teamCity,
            userID: userIdValue =='' || undefined ? '':userIdValue
        }).then(res => {
            if (res.data == true) {
                Alert.alert('Team Added')
                props.onAddTeam();
            } else {
                Alert.alert('Somthing went wrong try again');
            }
        })
    }

    return (
        <View styles={[styles.container]}>
            <Text>Add Team</Text>


            <View>
                <Text>Team Name : </Text>
                <Controller
                    control={control}
                    name="teamName"
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

                {errors.teamName && <Text>This is required.</Text>}


                <Text>Team Type : </Text>
                <Controller
                    control={control}
                    name="teamType"
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
                {errors.teamType && <Text>This is required.</Text>}


                <Text>Team City : </Text>
                <Controller
                    control={control}
                    name="teamCity"
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

