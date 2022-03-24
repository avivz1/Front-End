import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native';
import { Context } from '../../ContextAPI/Context';
import ViewCardStudentComp from './StudentCardComponent';
import { IP } from '../../IP_Address';
import Overlay from 'react-native-modal-overlay';
import EditStudentComponent from './EditStudentComponent';
import StudentDetailsComponent from './StudentDetailsComponent'
import AddStudentComponent from './AddStudentComponent'
import { Card, FAB, Searchbar } from 'react-native-paper'



export default function ViewStudentsComponent() {

    const { userId, teamsMap } = React.useContext(Context);
    const [userIdValue] = userId;
    const [teamsNameMap, setMap] = teamsMap

    const [studentsArr, setStudents] = React.useState([]);
    const [allTeams, setTeams] = React.useState([]);
    const [detailsVisible, setDetailsVisible] = React.useState(false);
    const [editVisible, setEditVisible] = React.useState(false);
    const [addVisible, setAddVisible] = React.useState(false);
    const [pickedStudent, setPickedStudent] = React.useState({});
    const [searchText, setSearchText] = React.useState('');
    const onChangeSearch = query => setSearchText(query)

    useEffect(() => {
        getAllStudents();
        getAllTeams();
    }, [])

    const getAllStudents = () => {
        axios.post('http://' + IP + '/students/getallstudentsbyuserid', { userid: userIdValue }).then(res => {
            if (res.data) {
                setStudents(res.data)
            } else {
                //Toast there was a problem
            }
        })

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
        } else if (editVisible) {
            setEditVisible(false);
        } else {
            setAddVisible(false)
        }
    }

    const onAddPress = () => {
        setAddVisible(true)
    }

    const closeEditModal = () => {
        getAllStudents();
        setEditVisible(false);

    }
    const closeAddModal = () => {
        getAllStudents();
        setAddVisible(false);

    }

    const StudentCardPress = (stu, btnType) => {
        setPickedStudent(stu);
        switch (btnType) {
            case 'detailsBtn': setDetailsVisible(true)
                break;
            case 'editBtn': setEditVisible(true) //props.setBtnPress(stu, 'edit')
                break;
            case 'removeBtn': Alert.alert('Warning', 'Are you sure you want to delete this student? ' + '\n' + stu.Name + '\n', [
                { text: 'Cancel' },
                {
                    text: 'Yes', onPress: () => {
                        axios.delete('http://' + IP + '/students/deletestudent/' + stu._id).then((res => {
                            if (res.data) {
                                getAllStudents()
                                Alert.alert('Student has been deleted');
                            } else {
                                Alert.alert('There was a problem. try again')
                            }
                        }))
                    }
                }
            ])
                break;
        }

    }

    return (

        <View style={[styles.container]}>

            <Overlay visible={editVisible ? true : detailsVisible ? true : addVisible ? true : false} onClose={onCloseModal} closeOnTouchOutside>
                {editVisible && <EditStudentComponent onStudentUpdate={closeEditModal} teams={allTeams} student={pickedStudent ? pickedStudent : ''} />}
                {detailsVisible && <StudentDetailsComponent student={pickedStudent ? pickedStudent : ''} />}
                {addVisible && <AddStudentComponent onAddClostModal={closeAddModal} teams={allTeams} />}
            </Overlay>


            <Searchbar placeholder='Search' onChangeText={onChangeSearch} value={searchText} />
            <ScrollView>
                <View style={[styles.container]}>

                    {studentsArr.length > 0 ? studentsArr.map((stu, index) => {
                        return (
                            <View key={index}>
                                {
                                    stu.Name.includes(searchText) &&
                                    <ViewCardStudentComp key={index} callBack={StudentCardPress} data={stu} />
                                }
                            </View>
                        )
                    }) : <Text>No Students</Text>}
                </View>

            </ScrollView>

            <FAB
                style={{ margin: 16, position: 'absolute', right: 0, bottom: 0 }}
                big
                icon='plus'
                onPress={onAddPress}
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

