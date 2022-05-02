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
import { FAB, Searchbar } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';



export default function ViewStudentsComponent() {

    const { userId, teamsMap } = React.useContext(Context);
    const [userIdValue] = userId;
    const [teamsNameMap, setMap] = teamsMap


    const [pickedImage, setPickedImage] = React.useState();
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
            }
        })

    }

    const addOrUpdateStudentPhoto = () => {
        axios.post('http://' + IP + '/students/addorupdatestudentphoto ', { userID: userIdValue, studentId: pickedStudent._id, photo: pickedImage }).then(res => {
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setPickedImage(result.uri);
            addOrUpdateStudentPhoto()
        }
    };

    const verifyPermissions = async () => {
        const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // const result = await Permissions.askAsync(Permissions.CAMERA);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant camera permissions to use this app.',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    };

    const takeImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 14],
            quality: 0.5,

        });

        setPickedImage(image.uri);
        addOrUpdateStudentPhoto()
    };

    const StudentCardPress = (stu, btnType) => {
        setPickedStudent(stu);
        switch (btnType) {
            case 'updateRequest' :
                getAllStudents();
                break;
            case 'pictureBtn': Alert.alert('a', 'b', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Take a Picture', onPress: () => { takeImageHandler() } },
                { text: 'Gallery', onPress: () => { pickImage() } }
            ])
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

            {/* {isRadioBtnShow && <Button title='Change Team' style={{ width: '10%', height: 30, margin:7}} onPress={changeTeamToFewStudents} />} */}

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

