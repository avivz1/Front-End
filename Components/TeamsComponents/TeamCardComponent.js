import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect,useRef } from "react";
import { Card, Button, Checkbox } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';
import defaultImage from '../../assets/teaml.png'
import axios from 'axios';
import { IP } from '../../IP_Address';
import CustomAlert from '../../Utils/CustomAlert'


export default function TeamCardComponent(props) {

    const [flag, setFlag] = useState(false);
    const [isRadioBtnShow, setIsRadioBtnShow] = useState(false);
    const [checked, setChecked] = useState(false);
    const [pickedImage, setPickedImage] = useState();
    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();

    /*-----------------------------------useEffect's section--------------------------------------------*/
    useEffect(() => {
        if (props.team.Image != undefined && props.team.Image != null && props.team.Image != '') {
            setPickedImage(props.team.Image)
        } else {
            // setPickedImage(defaultImage);
        }
    }, [])

    useEffect(() => {
        setIsRadioBtnShow(props.isRadioBtnShow)

        if (props.isUserRemoveAll && props.isRadioBtnON) {
            setChecked(true)
            props.checkUnCheckTeam(true, props.team._id)
        } else if (!props.isRadioBtnON && props.isUserRemoveAll) {
            setChecked(false)
            props.checkUnCheckTeam(false, props.team._id)
        }

    }, [props.isRadioBtnON, props.isUserRemoveAll, props.isRadioBtnShow])


    /*---------------------------------------------------------------------------------------*/

    const onPressEvent = () => {
        if (isRadioBtnShow == false) {
            setFlag(!flag);
        } else {
            props.checkUnCheckTeam(!checked, props.team._id)
            setChecked(!checked);
        }
    }

    const longPressEvent = () => {
        setFlag(false)
        props.onLongPress()
    }

    const getBtnsState = () => {
        if (isRadioBtnShow == false && flag == true) {
            return true;
        } else {
            return false
        }
    }

    /*-------------------------------------------image section start--------------------------------------------*/
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            addOrUpdateStudentPhoto(result.assets[0].uri)
            setPickedImage(result.assets[0].uri);
            props.callBack(props.data, 'updateRequest');
        }
    };

    const verifyPermissions = async () => {
        const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // const result = await Permissions.askAsync(Permissions.CAMERA);
        if (result.status !== 'granted') {
            // Alert.alert(
            //     'Insufficient permissions!',
            //     'You need to grant camera permissions to use this app.',
            //     [{ text: 'Okay' }]
            // );
            alertRef.current.setMsg('Insufficient permissions! You need to grant camera permissions to use this app')
            setIsAlertHandle(true)
            alertRef.current.focus()
            return false;
        }
        return true;
    };

    const pictureHandler = () => {
        Alert.alert('Take a Picture', '', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Gallery', onPress: () => { pickImage() } },
            { text: 'Camera', onPress: () => { takeImageHandler() } },
        ])

    }

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
        if (image.canceled != true) {
            addOrUpdateStudentPhoto(image.assets[0].uri)
            setPickedImage(image.assets[0].uri);
            props.callBack('updateRequest')
        }
    };

    const addOrUpdateStudentPhoto = (image) => {
        axios.post('http://' + IP + '/teams/addorupdateteamphoto ', { teamID: props.team._id, photo: image }).then(res => {
            if (res.data == true) {
                alertRef.current.setMsg('Updated')
                setIsAlertHandle(true)
                alertRef.current.focus()
                // Alert.alert('updated')
            } else {
                alertRef.current.setMsg('There was a problem. try again')
                setIsAlertHandle(true)
                alertRef.current.focus()
                // Alert.alert('was a problem')
            }
        })
    }
    /*-------------------------------------------image section end--------------------------------------------*/

    return (


        <View style={[styles.container]}>
            <CustomAlert oneBtn={alertOneBtn} selfHandle={isAlertHandle} ref={alertRef} />

            <Card style={flag ? styles.mainCardWithBtns : styles.mainCardWithoutBtns} onPress={onPressEvent} onLongPress={longPressEvent} >
                <View >
                    <Text style={{ paddingLeft: '20%', fontWeight: 'bold', fontSize: 20 }} >{props.team.Name}</Text>
                </View>
                {props.isRadioBtnShow &&
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
                            onPressEvent()
                        }}
                    />
                }


                <Image style={{ width: 150, height: 50 }} resizeMode='cover' source={pickedImage ? { uri: pickedImage } : defaultImage} />

                {getBtnsState() &&
                    <View>
                        <Card.Actions>
                            <Button onPress={() => { props.callBack(props.team, 'detailsBtn') }}>More Details</Button>
                            <Button onPress={() => { props.callBack(props.team, 'editBtn') }}>Edit</Button>
                            <Button onPress={() => { props.callBack(props.team, 'removeBtn') }} >Remove</Button>
                            <Button onPress={() => { pictureHandler() }}>Picture</Button>

                        </Card.Actions>
                    </View>
                }
            </Card>

        </View >
    )

}
const styles = StyleSheet.create({
    container: {
        margin: 10,


    },
    mainCardWithoutBtns: {
        margin: 10,
        height: 120,
        borderRadius: 15,
        shadowRadius: 8,
        elevation: 8,
        paddingLeft: 16,
        paddingRight: 14,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center', // Centered horizontally



    },
    mainCardWithBtns: {
        margin: 10,
        height: 150,
        borderRadius: 15,
        shadowRadius: 8,
        elevation: 8,
        paddingLeft: 16,
        paddingRight: 14,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center', // Centered horizontally
    },


});