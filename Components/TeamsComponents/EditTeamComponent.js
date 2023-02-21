import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { useEffect, useRef,useState } from "react";
import { IP } from "../../IP_Address";
import axios from 'axios';
import citiesFile from '../../Utils/citisListUpdated.json'
import { SelectList } from 'react-native-dropdown-select-list'
import textValidation from '../../Services/TextValidation.js'
import CustomAlert from '../../Utils/CustomAlert'



export default function EditTeamComponent(props) {


    const [errorsArr, setErrorsArr] = useState([])
    const [allCities, setAllCities] = useState(citiesFile)
    const [selectedCity, setSelectedCity] = useState(props.team.City);
    const [teamName, setTeamName] = useState(props.team.Name)
    const [teamType, setTeamType] = useState(props.team.Type)
    const { isInputOk } = textValidation;
    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();


    
    const onSubmit = () => {
        let input = isInputOk([{ teamName: teamName }, { teamType: teamType }, { teamCity: selectedCity }])
        if (!input.status) {
            setErrorsArr(input.data)
            return;
        }

        axios.post('http://' + IP + '/teams/editteam', {
            name: teamName,
            type: teamType,
            city: selectedCity,
            _id: props.team._id,
        }).then(res => {
            if (res.data == true) {
                alertRef.current.setMsg('Team Updated')
                setIsAlertHandle(false)
                alertRef.current.focus()
                // Alert.alert('Team Updated')
            } else {
                alertRef.current.setMsg('Somthing went wrong try again')
                setIsAlertHandle(true)
                alertRef.current.focus()
                // Alert.alert('Somthing went wrong try again');
            }
        })
    }

    const callbackFromAlert = () => {
        props.onTeamUpdate();
    }

    return (

        <View styles={[styles.container]}>
            <CustomAlert oneBtn={alertOneBtn} callback={callbackFromAlert} selfHandle={isAlertHandle} ref={alertRef} />

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





