import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { showAlert, closeAlert } from "react-native-customisable-alert";
import { Picker } from '@react-native-picker/picker';

export default RemoveTeamDialog = forwardRef((props, ref) => {

    const [isVisible, setIsVisible] = useState(true);
    const [index, setIndex] = useState(0);
    const [teams,setTeams] = useState([])

    useEffect(() => {
        let filteredTeams = props.teams.filter(t => t._id != props.pickedTeam._id);
        setTeams(filteredTeams)
    }, [])

    const setChoosenTeam = (picked, index) => {
        setIndex(index)
    }



    return (
        <Modal
            transparent={true}
            visible={isVisible}
            animationIn="slideInLeft"
            animationOut="slideOutRight">
            <View
                style={{
                    // height:300,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    // alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                }}>
                <View
                    style={{
                        height: '30%',
                        width: '100%',
                        backgroundColor: 'white',
                        padding: 22,
                        justifyContent: 'center',
                        flex: 0,
                        borderRadius: 4,
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                    }}>
                    <Text>To Which Team do you want to switch?</Text>
                    <Picker
                        selectedValue={teams[index]}
                        onValueChange={setChoosenTeam}>
                        {teams.map((team, index) => {
                            return (<Picker.Item key={index} label={team.Name} value={team}></Picker.Item>)
                        })}
                    </Picker>
                    <Button
                        onPress={() => {
                            props.onRemoveOkPress(teams[index])
                            setIsVisible(false)
                        }
                        }
                        title="OK"
                    />
                    <Button style={{ width: 50 }}
                        onPress={() => {
                            props.onRemoveCanclePress()
                            setIsVisible(false)
                        }
                        }
                        title="Close"
                    />
                </View>
            </View>
        </Modal>
    );

})


const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flex: 1,
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
    btn: {
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});







