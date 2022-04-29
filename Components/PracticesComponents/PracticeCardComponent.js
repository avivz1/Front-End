import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Button, Checkbox } from 'react-native-paper'
import { useDispatch } from 'react-redux'


export default function PracticeCardComponent(props) {

    const [flag, setFlag] = useState(false)
    const [removeAllFlag, setRemoveAllFlag] = useState(false)
    const [checked, setChecked] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        setRemoveAllFlag(props.isRemoveAll)

        if(props.pressOnRemoveAll&& props.isRemoveAll){
            setChecked(true)
        }else if(!props.pressOnRemoveAll && props.isRemoveAll){
            setChecked(false)
        }

    },[props])

    const setSelectedFlag = () => {

        if (removeAllFlag == false) {
            setFlag(!flag);
        } else {
            if(!checked){
                props.unCheckedPractice()
            }
            setChecked(!checked);
        }
    }

    const setRemoveFlag = () => {
        setFlag(false)
        // setRemoveAllFlag(true)
        props.onLongPress()
    }

    const getBtnsState = () => {
        if (removeAllFlag == false && flag == true) {
            return true;
        } else {
            return false
        }
    }




    return (
        <View style={[styles.container]}>

            <Card style={flag ? styles.mainCardWithBtns : styles.mainCardWithoutBtns} onPress={setSelectedFlag} onLongPress={setRemoveFlag} >
                <View >
                    <Text style={{ paddingLeft: '20%', fontWeight: 'bold', fontSize: 20 }} >{props.practice.Name}</Text>
                </View>
                {removeAllFlag &&
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
                            // dispatch({ type: "ADD", newItem: props.data._id })
                        }}
                    />
                }
                {!removeAllFlag &&<Image style={{ width: 150, height: 50 }} resizeMode='cover' source={require('../../assets/practicephoto.png')} />}
                {/* <Image style={{ width: 150, height: 50 }} resizeMode='cover' source={require('../../assets/practicephoto.png')} /> */}
                {getBtnsState() &&
                    <View>
                        <Card.Actions>
                            <Button onPress={() => { props.callBack(props.practice, 'detailsBtn') }}>More Details</Button>
                            <Button onPress={() => { props.callBack(props.practice, 'editBtn') }}>Edit</Button>
                            <Button onPress={() => { props.callBack(props.practice, 'removeBtn') }} >Remove</Button>
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