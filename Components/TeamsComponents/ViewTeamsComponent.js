import React, { useEffect, useContext, useRef, useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity, TouchableHighlight, BackHandler, ScrollView, Image } from 'react-native';
import { Context } from '../../ContextAPI/Context';
import { IP } from '../../IP_Address';
import Overlay from 'react-native-modal-overlay';
import { Card, FAB, Searchbar, RadioButton } from 'react-native-paper'
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

    const [isRadioBtnShow, setIsRadioBtnShow] = useState(false);
    const [isRadioBtnON, setIsRadioBtnON] = useState(false);
    const [isUserPressRemoveAll, setIsUserPressRemoveAll] = useState(false);
    const [teamsCheckedStatus, setTeamsCheckedStatus] = useState([]);

    useEffect(() => {
        getAllTeams();
    }, [])

    useEffect(() => {
        if (teamsCheckedStatus.length > 0 && teamsCheckedStatus.length == allTeams.length && !isUserPressRemoveAll) {
            setIsRadioBtnON(true);
        }
    }, [teamsCheckedStatus])

    const switchStudentsAndDeleteTeam = (switchToTeam) => {
        axios.post('http://' + IP + '/students/changestudentsteams/', { students: students, teamId: switchToTeam._id }).then(res => {
            if (res.data) {
                Alert.alert('All Student of this team Was Moved to another team')
                axios.post('http://' + IP + '/teams/deleteteam', { teamId: pickedTeam._id, userId: userIdValue }).then((res_ => {
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
            case 'updateRequest':
                getAllTeams();
                break;
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
                                                    axios.post('http://' + IP + '/students/deleteFewStudents', { students: res.data, userId: userIdValue }).then(res_DeleteFewStudents => {
                                                        if (!res_DeleteFewStudents.data) {
                                                            Alert.alert('Failed. try again')
                                                        } else {
                                                            Alert.alert('All Student of this team Was Deleted')
                                                            axios.post('http://' + IP + '/teams/deleteteam', { teamId: team._id, userId: userIdValue }).then((res_DeleteTeam => {
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
                                    axios.post('http://' + IP + '/teams/deleteteam', { teamId: team._id, userId: userIdValue }).then(res2 => {
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

    BackHandler.addEventListener('hardwareBackPress', () => {
        if (isRadioBtnShow == true) {
            setIsRadioBtnShow(false)
            setIsRadioBtnON(false)
            setIsUserPressRemoveAll(true);
            return true;
        } else if (isRadioBtnShow == false) {
            BackHandler.exitApp();
            // return false;
        }
    })

    const onChildCardLongPress = () => {
        setIsRadioBtnShow(true)
        setIsRadioBtnON(false)
    }

    const checkOrUncheckTeam = (status, id) => {

        setIsUserPressRemoveAll(false);
        if (!status) {
            setIsRadioBtnON(false);
            let state = teamsCheckedStatus.filter(x => x != id)
            setTeamsCheckedStatus(state)
        } else {

            if (!teamsCheckedStatus.includes(id)) {
                setTeamsCheckedStatus(teamsCheckedStatus => [...teamsCheckedStatus, id]);
            }


        }

    }

    const onRadionBtnPresses = () => {

        if (isRadioBtnON) {
            let arr = allTeams.map(team => team._id);
            setTeamsCheckedStatus(arr);
        } else {
            let arr2 = []
            setTeamsCheckedStatus(arr2);
        }

        setIsRadioBtnON(!isRadioBtnON)
        setIsUserPressRemoveAll(true)
    }
    // text: 'Yes', onPress: () => {

    const removeFewTeams = () => {
        if (teamsCheckedStatus.length > 0) {
            Alert.alert('Warning', 'Are you sure you want to delete those Teams ?(all Attached Students will be deleted!)' + '\n',
                [{ text: 'Cancel' }, {
                    text: 'Yes', onPress: () => {
                        axios.post('http://' + IP + '/teams/removeFewTeams', { userID: userIdValue, teams: teamsCheckedStatus }).then(res => {
                            if (res.data == true) {
                                axios.post('http://' + IP + '/teams/getalluserteams', { userID: userIdValue }).then(res1 => {
                                    setTeams(res1.data)
                                    setIsRadioBtnShow(false)
                                    setIsRadioBtnON(false)
                                    setIsUserPressRemoveAll(false);
                                    setTeamsCheckedStatus([])
                                })
                            }

                        })

                    }
                }]
            )
        }

    }



    return (

        <View style={[styles.container]}>

            <Overlay visible={isVisible() ? true : false} onClose={onCloseModal} closeOnTouchOutside>
                {editVisible && <EditTeamComponent onTeamUpdate={closeEditModal} team={pickedTeam ? pickedTeam : ''} />}
                {detailsVisible && <TeamDetailsComponent team={pickedTeam ? pickedTeam : ''} />}
                {addVisible && <AddTeamComponent onAddTeam={closeAddModal} />}
            </Overlay>
            {removeVisible && <RemoveTeamDialog pickedTeam={pickedTeam} teams={allTeams} onRemoveOkPress={switchStudentsAndDeleteTeam} onRemoveCanclePress={closeRemoveModal} />}


            <Searchbar placeholder='Search' onChangeText={onChangeSearch} value={searchText} />
            {isRadioBtnShow &&
                <RadioButton
                    value="mainRadioBtn"
                    status={isRadioBtnON ? 'checked' : 'unchecked'}
                    onPress={() => onRadionBtnPresses()}
                />
            }
            {isRadioBtnShow && <TouchableOpacity onPress={removeFewTeams}><Image style={{ width: 20, height: 30, margin: 7 }} source={require('../../assets/garbageIcon.png')} ></Image></TouchableOpacity>}


            <ScrollView>
                <View style={[styles.container]}>

                    {allTeams.length > 0 ? allTeams.map((team, index) => {
                        return (
                            <View key={index}>
                                {
                                    team.Name.includes(searchText) &&
                                    <TeamCardComoponent checkUnCheckTeam={checkOrUncheckTeam} isUserRemoveAll={isUserPressRemoveAll} isRadioBtnON={isRadioBtnON} isRadioBtnShow={isRadioBtnShow} onLongPress={onChildCardLongPress} key={index} callBack={TeamCardPress} team={team} />
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
