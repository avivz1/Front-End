import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Button } from 'react-native-paper'


export default function PracticeCardComponent(props) {

    const [flag, setFlag] = useState(false)
    const [removeAllFlag, setRemoveAllFlag] = useState(false)

    useEffect(() => {
        if (props.isRemoveAll) {
            setRemoveAllFlag(true)
        }
    })

    const setSelectedFlag = () => {
        setFlag(!flag)
    }

    const setRemoveFlag = () => {
        props.onLongPress()
    }





    return (
        <View style={[styles.container]}>
            {/* {removeAllFlag ? */}

                <Card style={styles.mainCardView} onPress={setSelectedFlag} onLongPress={setRemoveFlag} >
                    <View >
                        <Text style={{ paddingLeft: '20%', fontWeight: 'bold', fontSize: 20 }} >{props.practice.Name}</Text>
                    </View>
                    <View>
                        <Image style={{ width: 150, height: 50 }} resizeMode='cover' source={require('../../assets/practicephoto.png')} />
                    </View>

                </Card>

                {/* : */}
                
            

            {flag ?
                <Card style={styles.mainCardViewFlag} onPress={setSelectedFlag} onLongPress={setRemoveFlag}>

                    <Text style={{ paddingLeft: '20%', fontWeight: 'bold', fontSize: 20 }}>{props.practice.Name}</Text>
                    <Image style={{ width: 150, height: 50 }} source={require('../../assets/practicephoto.png')} />

                    {/* card btns */}
                    <Card.Actions>
                        <Button onPress={() => { props.callBack(props.practice, 'detailsBtn') }}>More Details</Button>
                        <Button onPress={() => { props.callBack(props.practice, 'editBtn') }}>Edit</Button>
                        <Button onPress={() => { props.callBack(props.practice, 'removeBtn') }} >Remove</Button>
                    </Card.Actions>
                </Card>
                :


                <Card style={styles.mainCardView} onPress={setSelectedFlag} onLongPress={setRemoveFlag} >
                    <View >
                        <Text style={{ paddingLeft: '20%', fontWeight: 'bold', fontSize: 20 }} >{props.practice.Name}</Text>
                    </View>
                    <View>
                        <Image style={{ width: 150, height: 50 }} resizeMode='cover' source={require('../../assets/practicephoto.png')} />
                    </View>

                </Card>
            }

        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        margin: 10,


    },
    mainCardView: {
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
    mainCardViewFlag: {
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