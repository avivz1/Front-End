import React, { useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native';
import { Context } from '../../ContextAPI/Context';
import { IP } from '../../IP_Address';
import Overlay from 'react-native-modal-overlay';
import { Card, FAB, Searchbar } from 'react-native-paper'
import AddTeamComponent from './AddTeamComponent'
import EditTeamComponent from './EditTeamComponent'
import TeamCardComoponent from './TeamCardComponent'
import TeamDetailsComponent from './TeamDetailsComponent'
import RemoveTeamDialog from './RemoveTeamDialog'



export default function ViewTeamsComponent() {

    const { userId, teamsMap } = React.useContext(Context);
    const [teamsNameMap, setMap] = teamsMap
    const [userIdValue] = userId;

    const [allTeams, setTeams] = React.useState([]);
    const [detailsVisible, setDetailsVisible] = React.useState(false);
    const [editVisible, setEditVisible] = React.useState(false);
    const [addVisible, setAddVisible] = React.useState(false);
    const [removeVisible, setRemoveVisible] = React.useState(false);
    const [pickedTeam, setPickedTeam] = React.useState({});
    const [students, setStudents] = React.useState([]);
    const [searchText, setSearchText] = React.useState('');
    const onChangeSearch = query => setSearchText(query)

    useEffect(() => {
        getAllTeams();
    }, [])

    const switchStudentsAndDeleteTeam = (switchToTeam) => {
            axios.post('http://' + IP + '/students/changestudentsteams/', { students: students, teamId: switchToTeam._id }).then(res => {
                if (res.data) {
                    Alert.alert('All Student of this team Was Moved to another team')
                    axios.post('http://' + IP + '/teams/deleteteam' ,{teamId:pickedTeam._id,userId:userIdValue} ).then((res_=> {
                        if (res_.data) {
                            getAllTeams()
                            Alert.alert('Team has been deleted');
                        } else {
                            Alert.alert('There was a problem. try again')
                        }
                    }))
                }
            })
            setRemoveVisible(false);
    }

    const getAllTeams = () => {
        axios.post('http://' + IP + '/teams/getalluserteams', { userID: userIdValue }).then(res => {
            if (res.data) {
                setTeams(res.data)
                res.data.forEach(team => {
                    setMap(teamsNameMap.set(team._id, team.Name))
                });
            } else {
                //Toast there was a problem

            }
        })
    }

    const onCloseModal = () => {
        if (detailsVisible) {
            setDetailsVisible(false)
        }
        if (editVisible) {
            setEditVisible(false);
        }
        if (addVisible) {
            setAddVisible(false)
        }
        if (removeVisible) {
            setRemoveVisible(false)
        }
    }

    const openAddModal = () => {
        setAddVisible(true);
    }

    const closeRemoveModal = () => {
        getAllTeams();
        setRemoveVisible(false)
    }

    const closeEditModal = () => {
        getAllTeams();
        setEditVisible(false);

    }

    const closeAddModal = () => {
        getAllTeams();
        setAddVisible(false);

    }

    const TeamCardPress = (team, btnType) => {
        setPickedTeam(team);

        switch (btnType) {
            case 'detailsBtn': setDetailsVisible(true)
                break;
            case 'editBtn': setEditVisible(true)
                break;
            case 'removeBtn':

                Alert.alert('Warning', 'Are you sure you want to delete this Team? ' + '\n' + team.Name + '\n', [
                    { text: 'Cancel' },

                    {
                        text: 'Yes', onPress: () => {
                            axios.post('http://' + IP + '/students/getstudentsbyteamid', { teamId: team._id, userId: userIdValue }).then(res => {
                                if (res.data.length > 0) {
                                    setStudents(res.data)
                                    Alert.alert('Warning', 'There is STUDENTS attached to this team, You can delete them or switch them to another team',
                                        [
                                            {
                                                text: 'Delete Students', onPress: () => {
                                                    axios.post('http://' + IP + '/students/deleteFewStudents', { students: res.data }).then(res_DeleteFewStudents => {
                                                        if (!res_DeleteFewStudents.data) {
                                                            Alert.alert('Failed. try again')
                                                        } else {
                                                            Alert.alert('All Student of this team Was Deleted')
                                                            axios.post('http://' + IP + '/teams/deleteteam' , { teamId: team._id, userId: userIdValue }).then((res_DeleteTeam => {
                                                                if (res_DeleteTeam.data) {
                                                                    getAllTeams()
                                                                    Alert.alert('Team has been deleted');
                                                                } else {
                                                                    Alert.alert('There was a problem. try again')
                                                                }
                                                            }))
                                                        }
                                                    })
                                                }
                                            },
                                            {
                                                text: 'Switch to another team', onPress: () => {
                                                    setRemoveVisible(true)
                                                }
                                            },
                                            { text: 'Cancel' }
                                        ])
                                } else {
                                    axios.post('http://' + IP + '/teams/deleteteam',{ teamId: team._id, userId: userIdValue }).then(res2 => {
                                        if (res2.data) {
                                            getAllTeams()
                                            Alert.alert('Team has been deleted');
                                        } else {
                                            Alert.alert('There was a problem. try again')
                                        }
                                    })
                                }
                            })



                        }
                    }
                ])

                break;
        }

    }

    const isVisible = () => {
        if (editVisible || detailsVisible || addVisible || removeVisible) {
            return true;
        } else {
            return false;
        }
    }

    return (

        <View style={[styles.container]}>

            <Overlay visible={isVisible() ? true : false} onClose={onCloseModal} closeOnTouchOutside>
                {editVisible && <EditTeamComponent onTeamUpdate={closeEditModal} team={pickedTeam ? pickedTeam : ''} />}
                {detailsVisible && <TeamDetailsComponent team={pickedTeam ? pickedTeam : ''} />}
                {addVisible && <AddTeamComponent onAddTeam={closeAddModal} />}
            </Overlay>
                { removeVisible && <RemoveTeamDialog teams={allTeams} onRemoveOkPress={switchStudentsAndDeleteTeam} onRemoveCanclePress={closeRemoveModal} />} 
            

            <Searchbar placeholder='Search' onChangeText={onChangeSearch} value={searchText} />
            <ScrollView>
                <View style={[styles.container]}>

                    {allTeams.length > 0 ? allTeams.map((team, index) => {
                        return (
                            <View key={index}>
                                {
                                    team.Name.includes(searchText) &&
                                    <TeamCardComoponent key={index} callBack={TeamCardPress} team={team} />
                                }
                            </View>
                        )
                    }) : <Text>No Teams</Text>}
                </View>

            </ScrollView>

            <FAB
                style={{ margin: 16, position: 'absolute', right: 0, bottom: 0 }}
                big
                icon='plus'
                onPress={openAddModal}
            />

        </View>
    )


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 10,
        backgroundColor: '#ffffff'
    },
    HeadStyle: {
        height: 50,
        alignContent: "center",
        backgroundColor: '#CE39FE'
    },
    TableText: {
        margin: 8,
        height: 49,
        alignContent: "center",
        alignItems: 'center',
    }
})
