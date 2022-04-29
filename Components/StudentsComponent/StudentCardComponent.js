import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { Card, Button } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';
import { IP } from '../../IP_Address';
import axios from 'axios';



export default function StudentCardComponent(props) {

    const [flag, setFlag] = useState(false)
    const [pickedImage, setPickedImage] = React.useState();

    const setSelectedFlag = () => {
        setFlag(!flag)
    }

    useEffect(() => {
        if (props.data.Image != undefined || props.data.Image != null) {
            setPickedImage(props.data.Image)
        } else {
            setPickedImage('https://gsmauditors.com/wp-content/uploads/2016/05/istockphoto-1133765772-612x612-1.jpg')
        }
    })

    const addOrUpdateStudentPhoto = (image) => {
        axios.post('http://' + IP + '/students/addorupdatestudentphoto ', { studentId: props.data._id, photo: image }).then(res => {
            if (res.data == true) {
                Alert.alert('updated')
            } else {
                Alert.alert('was problem')
            }
        })
    }

    const pictureHandler = () => {
        Alert.alert('A', 'v', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Take a Picture', onPress: () => { takeImageHandler() } },
            { text: 'Gallery', onPress: () => { pickImage() } }
        ])

    }


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            addOrUpdateStudentPhoto(result.uri)
            setPickedImage(result.uri);
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
        if (image.cancelled!=true) {
            addOrUpdateStudentPhoto(image.uri)
            setPickedImage(image.uri);
            props.callBack(props.data, 'updateRequest')
        }
    };


    return (
        <View >
            {flag ?
                <Card style={styles.mainCardViewFlag} onPress={setSelectedFlag} >
                    <Text style={{fontSize:20}} >{props.data.Name}</Text>
                    <Image
                        style={styles.tinyLogo}
                        source={{
                            uri: props.data.Image ? props.data.Image : 'https://gsmauditors.com/wp-content/uploads/2016/05/istockphoto-1133765772-612x612-1.jpg'
                        }}></Image>
                    <Card.Actions>
                        <Button onPress={() => { props.callBack(props.data, 'detailsBtn') }}>More Details</Button>
                        <Button onPress={() => { props.callBack(props.data, 'editBtn') }}>Edit</Button>
                        <Button onPress={() => { props.callBack(props.data, 'removeBtn') }} >Remove</Button>
                        <Button onPress={() => { pictureHandler() }}>Picture</Button>
                    </Card.Actions>
                </Card>
                :
                <Card style={styles.mainCardView} onPress={setSelectedFlag} >
                    <Text style={{fontSize:20}} >{props.data.Name}</Text>
                    <Image
                        style={styles.tinyLogo}
                        source={{
                            uri: props.data.Image ? props.data.Image : 'https://gsmauditors.com/wp-content/uploads/2016/05/istockphoto-1133765772-612x612-1.jpg'
                        }}></Image>
                </Card>
            }

        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 0 : 0,
        paddingEnd: 10,
        margin: 10,



    },
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
    mainCardView: {
        margin: 10,
        height: 120,
        borderRadius: 15,
        shadowRadius: 8,
        elevation: 8,
        paddingLeft: 16,
        paddingRight: 14,



    },
    mainCardViewFlag: {
        margin: 10,
        height: 150,
        borderRadius: 15,
        shadowRadius: 8,
        elevation: 8,
        paddingLeft: 16,
        paddingRight: 14,
    },
    ButtoNStyle: {
        borderRadius: 25,

    }

});