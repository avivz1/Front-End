
 Alert.alert('Warning', 'Are you sure you want to delete this Team? ' + '\n' + team.Name + '\n', [
    { text: 'Cancel' },

    {
        text: 'Yes', onPress: () => {
            axios.post('http://' + IP + '/students/getstudentsbyteamid', { teamId: team._id, userId: userIdValue }).then(res => {
                if (res.data.length>0) {
                    Alert.alert('Warning', 'There is STUDENTS attached to this team, You can delete them or switch them to another team',
                        [
                            
                            {
                                text: 'Delete Students', onPress: () => {
                                    axios.post('http://' + IP + '/students/deleteFewStudents', { students: res.data }).then(res_DeleteFewStudents => {
                                        if (!res_DeleteFewStudents.data) {
                                            Alert.alert('Failed. try again')
                                        } else {
                                            Alert.alert('All Student of this team Was Deleted')
                                            axios.delete('http://' + IP + '/teams/deleteteam/' + team._id).then((res_DeleteTeam => {
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
                                    
                                    axios.post('http://' + IP + '/students/changestudentsteams/', { students: res.data, teamId: '6232205cab5ea7e8791c18d5' }).then(res_MoveTeam => {
                                        if (res_MoveTeam.data) {
                                            Alert.alert('All Student of this team Was Moved to another team')
                                            axios.delete('http://' + IP + '/teams/deleteteam/' + team._id).then((res_DeleteTeam => {
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
                            { text: 'Cancel' }
                        ])
                } else {
                    axios.delete('http://' + IP + '/teams/deleteteam/' + team._id).then(res2 => {
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