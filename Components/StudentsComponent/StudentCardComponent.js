import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { Card, Button, Checkbox } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';
import { IP } from '../../IP_Address';
import axios from 'axios';



export default function StudentCardComponent(props) {

    const [flag, setFlag] = useState(false)
    const [pickedImage, setPickedImage] = useState();
    const [isRadioBtnShow, setIsRadioBtnShow] = useState(false);
    const [checked, setChecked] = useState(false);


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
                // props.data.Image=image;
                Alert.alert('updated')
            } else {
                Alert.alert('was problem')
            }
        })
    }

    const pictureHandler = () => {
        Alert.alert('Take a Picture','', [
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

    return (
        <View style={[styles.container]}>

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
                {/* require('../../assets/practicephoto.png') */}
                {!props.isRadioBtnShow && <Image style={{ width: 150, height: 50 }} resizeMode='cover' source={{ uri: pickedImage ? pickedImage : 'https://gsmauditors.com/wp-content/uploads/2016/05/istockphoto-1133765772-612x612-1.jpg' }} />}

                {getBtnsState() &&
                    <View>
                        <Card.Actions>
                            <Button onPress={() => { props.callBack(props.data, 'detailsBtn') }}>More Details</Button>
                            <Button onPress={() => { props.callBack(props.data, 'editBtn') }}>Edit</Button>
                            <Button onPress={() => { props.callBack(props.data, 'removeBtn') }} >Remove</Button>
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
