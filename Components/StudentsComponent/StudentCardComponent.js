import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Card, Button, Checkbox } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';
import { IP } from '../../IP_Address';
import axios from 'axios';
import Overlay from "react-native-modal-overlay";
import CustomAlert from '../../Utils/CustomAlert'



export default function StudentCardComponent(props) {

    const [flag, setFlag] = useState(false)
    const [pickedImage, setPickedImage] = useState();
    const [isRadioBtnShow, setIsRadioBtnShow] = useState(false);
    const [checked, setChecked] = useState(false);
    const [isImagePressed, setIsImagePRessed] = useState(false);
    const [isAlertHandle, setIsAlertHandle] = useState(false)
    const [alertOneBtn, setAlertOnebtn] = useState(true)
    const alertRef = useRef();

    useEffect(() => {
        if (props.data.Image != undefined && props.data.Image != null && props.data.Image != '') {
            setPickedImage(props.data.Image)
        } else {
            setPickedImage('https://gsmauditors.com/wp-content/uploads/2016/05/istockphoto-1133765772-612x612-1.jpg')
        }
    }, [])

    useEffect(() => {
        setIsRadioBtnShow(props.isRadioBtnShow)

        if (props.isUserRemoveAll && props.isRadioBtnON) {
            setChecked(true)
            props.checkUnCheckStudent(true, props.data._id)
        } else if (!props.isRadioBtnON && props.isUserRemoveAll) {
            setChecked(false)
            props.checkUnCheckStudent(false, props.data._id)
        }

    }, [props.isRadioBtnON, props.isUserRemoveAll, props.isRadioBtnShow])


    const addOrUpdateStudentPhoto = (image) => {
        axios.post('http://' + IP + '/students/addorupdatestudentphoto ', { studentId: props.data._id, photo: image }).then(res => {
            if (res.data == true) {
                // alertRef.current.setMsg('Updated')
                // setIsAlertHandle(true)
                // alertRef.current.focus()
                // Alert.alert('updated')
            } else {
                alertRef.current.setMsg('There was a problem. try again')
                setIsAlertHandle(false)
                alertRef.current.focus()
                // Alert.alert('was problem')
            }
        })
    }

    const pictureHandler = () => {
        Alert.alert('Take a Picture', '', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Gallery', onPress: () => { pickImage() } },
            { text: 'Camera', onPress: () => { takeImageHandler() } },
        ])

    }

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
        if (image.canceled != true) {
            addOrUpdateStudentPhoto(image.assets[0].uri)
            props.callBack(props.data, 'updateRequest')
            setPickedImage(image.assets[0].uri);
        }
    };

    const onPressEvent = () => {
        if (isRadioBtnShow == false) {
            setFlag(!flag);
        } else {
            props.checkUnCheckStudent(!checked, props.data._id)
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

    const onImagePress = () => {
        setIsImagePRessed(true)
    }


    return (
        <View style={[styles.container]}>
            <CustomAlert oneBtn={alertOneBtn}  selfHandle={isAlertHandle} ref={alertRef} />

            <Card style={flag ? styles.mainCardWithBtns : styles.mainCardWithoutBtns} onPress={onPressEvent} onLongPress={longPressEvent} >
                <View >
                    <Text style={{ paddingLeft: '20%', fontWeight: 'bold', fontSize: 20 }} >{props.data.Name}</Text>
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
                {!props.isRadioBtnShow &&
                    <TouchableOpacity style={{ width: 80 }} onPress={onImagePress}>
                        <Image style={{ width: 80, height: 50 }} resizeMode='cover' source={{ uri: pickedImage ? pickedImage : 'https://gsmauditors.com/wp-content/uploads/2016/05/istockphoto-1133765772-612x612-1.jpg' }} />
                    </TouchableOpacity>
                }

                <Overlay visible={isImagePressed} style={{ width: 300, height: 300 }} onClose={() => setIsImagePRessed(false)} closeOnTouchOutside>
                    {isImagePressed && <Image style={{ width: 300, height: 300 }} onPress={onImagePress} resizeMode='cover' source={{ uri: pickedImage ? pickedImage : 'https://gsmauditors.com/wp-content/uploads/2016/05/istockphoto-1133765772-612x612-1.jpg' }} />}
                </Overlay>

                {getBtnsState() &&
                    <View>
                        <Card.Actions>
                            <Button onPress={() => { props.callBack(props.data, 'detailsBtn') }}>More Details</Button>
                            <Button onPress={() => { props.callBack(props.data, 'editBtn') }}>Edit</Button>
                            <Button onPress={() => { props.callBack(props.data, 'removeBtn') }} >Remove</Button>
                            <Button onPress={() => { props.callBack(props.data, 'callBtn') }} >Call</Button>
                            <Button onPress={() => { pictureHandler() }}>Picture</Button>

                        </Card.Actions>
                    </View>
                }
            </Card>

        </View >

    )

}
const styles = StyleSheet.create({

    title: {
        textAlign: 'right'
    },
    card: {
        height: 100,
        width: 100,
        fontSize: 100,
    },
    tinyLogo: {
        width: '50%',
        height: '50%',
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
