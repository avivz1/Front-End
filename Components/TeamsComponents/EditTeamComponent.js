import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Picker } from '@react-native-picker/picker';
import { IP } from "../../IP_Address";
import axios from 'axios';
import citiesFile from '../../Utils/Cities1.json'
import { SelectList } from 'react-native-dropdown-select-list'



export default function EditTeamComponent2(props) {

    // const { control, handleSubmit, formState: { errors } } = useForm();

    const [errorsArr, setErrorsArr] = React.useState([])
    const [allCities, setAllCities] = React.useState([])
    const [selectedCity, setSelectedCity] = React.useState(props.team.City);
    const [teamName, setTeamName] = React.useState(props.team.Name)
    const [teamType, setTeamType] = React.useState(props.team.Type)


    useEffect(() => {
        let arr = []
        citiesFile.forEach((city) => {
            let obj = {
                key: city.semel,
                value: city.name
            }
            arr.push(obj)
        })
        setAllCities(arr)
    }, [])

    const isInputOk = () => {
        let arr = []
        if (teamName == '' || teamName == undefined) {
            arr.push('teamName')
        }
        if (teamType == '' || teamType == undefined) {
            arr.push('teamType')
        }
        if (selectedCity == '' || selectedCity == undefined) {
            arr.push('teamCity')
        }
        if (arr.length == 0) {
            setErrorsArr([])
            return true;
        } else {
            setErrorsArr(arr)
            return false;
        }
    }

    const onSubmit = () => {
        let input = isInputOk()
        if (!input) {
            return;
        }

        axios.post('http://' + IP + '/teams/editteam', {
            name: teamName,
            type: teamType,
            city: selectedCity,
            _id: props.team._id,
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
                <TextInput keyboardType='ascii-capable' style={[styles.inputText]} placeholder='Enter Name' defaultValue={teamName} onChangeText={(name) => setTeamName(name)} />
                {(errorsArr.length > 0 && errorsArr.includes('teamName')) && <Text>This is required.</Text>}


                <Text>Team Type : </Text>
                <TextInput keyboardType='numeric' style={[styles.inputText]} placeholder='Enter Type' defaultValue={teamType} onChangeText={(type) => setTeamType(type)} />
                {(errorsArr.length > 0 && errorsArr.includes('teamType')) && <Text>This is required.</Text>}


                <Text>Team City : </Text>
                <SelectList
                    defaultOption={{ key: selectedCity, value: selectedCity }}
                    placeholder='Select City'
                    setSelected={(cityName) => setSelectedCity(cityName)}
                    data={allCities}
                    save="value"
                />
                {(errorsArr.length > 0 && errorsArr.includes('teamCity')) && <Text>This is required.</Text>}


                {/* <Controller
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
                {errors.teamCity && <Text>This is required.</Text>} */}

                <Button title="Submit" onPress={onSubmit} />

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

    },
    inputText: {
        borderWidth: 1,
    },
});





