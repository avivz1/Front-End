import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Picker } from '@react-native-picker/picker';
import { IP } from "../../IP_Address";
import axios from 'axios';



export default function EditStudentsComponent(props) {

    const [index, setIndex] = React.useState(0);
    const { control, handleSubmit, formState: { errors } } = useForm();


    useEffect(() => {
        let index = props.teams.findIndex(team => team._id == props.student.Team_ID);
        setIndex(index);
    }, [])


    const onChangeIndex = (pickedTeam, index) => {
        setIndex(index)
    }

    const onSubmit = (data) => {
        axios.post('http://' + IP + '/students/editstudent', {
            name: data.stuName == '' || data.stuName == undefined ? props.student.Name : data.stuName,
            belt: data.stuBelt == '' || data.stuBelt == undefined ? props.student.Belt : data.stuBelt,
            age: data.stuAge == '' || data.stuAge == undefined ? props.student.Age : data.stuAge,
            city: data.stuCity == '' || data.stuCity == undefined ? props.student.City : data.stuCity,
            studentId: props.student._id != '' && props.student._id != undefined ? props.student._id : '',
            Team_ID: props.teams ? props.teams[index]._id : props.student.Team_ID


        }).then(res => {
            if (res.data == true) {
                Alert.alert('Student Updated')
                props.onStudentUpdate();
            } else {
                Alert.alert('Somthing went wrong try again');
            }
        })
    }

    return (

        <View styles={[styles.container]}>
            <Text>{props.student.Name}</Text>
            <Picker
                style={{ width: 300 }}
                selectedValue={props.teams[index].Name}
                onValueChange={onChangeIndex}>
                {props.teams.map((team, index) => {
                    return (<Picker.Item key={index} label={team.Name} value={team.Name}></Picker.Item>)
                })
                    // (<Picker.Item key={1000000000} label={pickerErrorMsg} value={'error'}></Picker.Item>)
                }

            </Picker>


            <View>
                <Text>Student Name : </Text>
                <Controller
                    control={control}
                    name="stuName"
                    rules={{
                        required: false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            defaultValue={props.student ? props.student.Name : ''}
                        //placeholder={allTeams.length>0?allTeams[index].Name:'No Teams'}  //{pickedTeam.Name}

                        />
                    )}
                />

                {errors.stuName && <Text>This is required.</Text>}


                <Text>Student Age : </Text>
                <Controller
                    control={control}
                    name="stuAge"
                    rules={{
                        required: false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            defaultValue={props.student ? props.student.Age.toString() : ''}
                        //placeholder={allTeams.length>0?allTeams[index].Type:'No Teams'}


                        />
                    )}
                />
                {errors.stuAge && <Text>This is required.</Text>}


                <Text>Student Belt : </Text>
                <Controller
                    control={control}
                    name="stuBelt"
                    rules={{
                        required: false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            defaultValue={props.student ? props.student.Belt : ''}
                        />
                    )}
                />
                {errors.stuBelt && <Text>This is required.</Text>}

                <Text>Student City : </Text>
                <Controller
                    control={control}
                    name="stuCity"
                    rules={{
                        required: false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            defaultValue={props.student ? props.student.City : ''}
                        //placeholder={allTeams.length>0?allTeams[index].City:'No Cities'}

                        />
                    )}
                />
                {errors.stuCity && <Text>This is required.</Text>}



                <Button title="Submit" onPress={handleSubmit(onSubmit)} />

            </View>

        </View>



    )


}




const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flex: 1,
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





