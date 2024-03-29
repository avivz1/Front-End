import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Alert, TouchableOpacity, TouchableHighlight, Linking, Image, BackHandler, ScrollView } from 'react-native';
import { Context } from '../../ContextAPI/Context';
import ViewCardStudentComp from './StudentCardComponent';
import { IP } from '../../IP_Address';
import Overlay from 'react-native-modal-overlay';
import EditStudentComponent from './EditStudentComponent';
import StudentDetailsComponent from './StudentDetailsComponent'
import AddStudentComponent from './AddStudentComponent'
import { FAB, Searchbar, RadioButton } from 'react-native-paper'
import { ActivityIndicator, Colors } from 'react-native-paper';
import CustomAlert from '../../Utils/CustomAlert'



export default function ViewStudentsComponent() {

    const { userId, teamsMap } = useContext(Context);
    const [userIdValue] = userId;
    const [teamsNameMap, setMap] = teamsMap


    const [studentsArr, setStudents] = useState([]);
    const [allTeams, setTeams] = useState([]);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [pickedStudent, setPickedStudent] = useState({});
    const [searchText, setSearchText] = useState('');
    const onChangeSearch = query => setSearchText(query)

    const [isLoading, setIsLoading] = useState(false)
    const [isRadioBtnShow, setIsRadioBtnShow] = useState(false);
    const [isRadioBtnON, setIsRadioBtnON] = useState(false);
    const [isUserPressRemoveAll, setIsUserPressRemoveAll] = useState(false);
    const [studentsCheckedStatus, setStudentsCheckedStatus] = useState([]);
    const [callVisible, setCallVisible] = useState(false);

    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();


    useEffect(() => {
        if (allTeams.length > 0 && studentsArr.length > 0) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
        }
    }, [allTeams, studentsArr])

    useEffect(() => {
        getAllStudents();
        getAllTeams();
    }, [])

    useEffect(() => {
        if (studentsCheckedStatus.length > 0 && studentsCheckedStatus.length == studentsArr.length && !isUserPressRemoveAll) {
            setIsRadioBtnON(true);
        }
    }, [studentsCheckedStatus])


    const getAllStudents = () => {
        axios.post('http://' + IP + '/students/getallstudentsbyuserid', { userid: userIdValue }).then(res => {
            if (res.data) {
                setStudents([])
                setStudents(res.data)
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
        if (allTeams.length > 0) {
            setAddVisible(true)
        } else {
            alertRef.current.setMsg('Must have a team before creating a student')
            setIsAlertHandle(true)
            alertRef.current.focus()
            // Alert.alert('must have a team before creating student')
        }
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
            case 'updateRequest':
                getAllStudents();
                break;

            case 'callBtn': setCallVisible(true)
                break;

            case 'detailsBtn': setDetailsVisible(true)
                break;
            case 'editBtn': setEditVisible(true)
                break;
            case 'removeBtn': Alert.alert('Warning', 'Are you sure you want to delete this student? ' + '\n' + stu.Name + '\n', [
                { text: 'Cancel' },
                {
                    text: 'Yes', onPress: () => {
                        axios.post('http://' + IP + '/students/deletestudent', { userId: userIdValue, stuId: stu._id }).then((res => {
                            if (res.data) {
                                getAllStudents()
                                alertRef.current.setMsg('Student has been deleted')
                                setIsAlertHandle(true)
                                alertRef.current.focus()
                                // Alert.alert('Student has been deleted');
                            } else {
                                alertRef.current.setMsg('Must have a team before creating a student')
                                setIsAlertHandle(true)
                                alertRef.current.focus()
                                // Alert.alert('There was a problem. try again')
                            }
                        }))
                    }
                }
            ])
                break;
        }

    }

    const onChildCardLongPress = () => {
        setIsRadioBtnShow(true)
    }

    const checkOrUncheckStudent = (status, id) => {
        setIsUserPressRemoveAll(false);
        if (!status) {
            setIsRadioBtnON(false);
            let state = studentsCheckedStatus.filter(x => x != id)
            setStudentsCheckedStatus(state)
        } else {

            if (!studentsCheckedStatus.includes(id)) {
                setStudentsCheckedStatus(studentsCheckedStatus => [...studentsCheckedStatus, id]);
            }
        }
    }

    const onRadionBtnPresses = () => {
        if (isRadioBtnON) {
            let arr = studentsArr.map(stu => stu._id);
            setStudentsCheckedStatus(arr);
        } else {
            setStudentsCheckedStatus([]);
        }
        setIsRadioBtnON(!isRadioBtnON)
        setIsUserPressRemoveAll(true)
    }

    const removeFewStudents = () => {
        axios.post('http://' + IP + '/students/deletefewstudents', { userId: userIdValue, students: studentsCheckedStatus }).then(res => {
            if (res.data == true) {
                axios.post('http://' + IP + '/students/getallstudentsbyuserid', { userid: userIdValue }).then(res1 => {
                    setStudents(res1.data)
                    setIsRadioBtnShow(false)
                    setIsRadioBtnON(false)
                    setIsUserPressRemoveAll(false);
                    setStudentsCheckedStatus([])
                })
            }

        })
    }

    const openDialer = (phone) => {
        Linking.openURL(`tel:${phone}`);
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

    return (

        <View style={[styles.container]}>
            <CustomAlert oneBtn={alertOneBtn} selfHandle={isAlertHandle} ref={alertRef} />

            {isLoading ? <ActivityIndicator type={'large'} animating={true} color={Colors.red800} /> :
                <View>

                    <Overlay visible={editVisible ? true : detailsVisible ? true : addVisible ? true : false} onClose={onCloseModal} closeOnTouchOutside>
                        {editVisible && <EditStudentComponent onStudentUpdate={closeEditModal} teams={allTeams} student={pickedStudent ? pickedStudent : ''} />}
                        {detailsVisible && <StudentDetailsComponent student={pickedStudent ? pickedStudent : ''} />}
                    </Overlay>

                    <Overlay visible={callVisible} onClose={() => setCallVisible(false)} closeOnTouchOutside>
                        <TouchableOpacity onPress={() => openDialer(pickedStudent.Phone)}>
                            <Text>Student Phone</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openDialer(pickedStudent.EmergencyContact.Phone)}>
                            <Text>Emergency Phone</Text>
                        </TouchableOpacity>
                    </Overlay>

                    {/* {isRadioBtnShow && <Button title='Change Team' style={{ width: '10%', height: 30, margin:7}} onPress={changeTeamToFewStudents} />} */}

                    <Searchbar placeholder='Search' onChangeText={onChangeSearch} value={searchText} />
                    {isRadioBtnShow &&
                        <RadioButton
                            value="mainRadioBtn"
                            status={isRadioBtnON ? 'checked' : 'unchecked'}
                            onPress={() => onRadionBtnPresses()}
                        />
                    }
                    {isRadioBtnShow && <TouchableOpacity onPress={removeFewStudents}><Image style={{ width: 20, height: 30, margin: 7 }} source={require('../../assets/garbageIcon.png')} ></Image></TouchableOpacity>}

                    <ScrollView>
                        <View style={[styles.container]}>

                            {studentsArr.length > 0 ? studentsArr.map((stu, index) => {
                                return (
                                    <View key={stu._id}>
                                        {
                                            stu.Name.includes(searchText) &&
                                            <ViewCardStudentComp checkUnCheckStudent={checkOrUncheckStudent} isUserRemoveAll={isUserPressRemoveAll} isRadioBtnON={isRadioBtnON} isRadioBtnShow={isRadioBtnShow} key={stu._id} onLongPress={onChildCardLongPress} callBack={StudentCardPress} data={stu} />
                                        }
                                    </View>
                                )
                            }) : <Text>No Students</Text>}
                        </View>

                    </ScrollView>

                </View>
            }
            <FAB
                style={{ margin: 16, position: 'absolute', right: 0, bottom: 0 }}
                big
                icon='plus'
                onPress={onAddPress}
            />
            <Overlay visible={addVisible} onClose={onCloseModal} closeOnTouchOutside>
                <AddStudentComponent onAddClostModal={closeAddModal} teams={allTeams} />

            </Overlay>

        </View>
    )


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 10,
        backgroundColor: '#ffffff',

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

