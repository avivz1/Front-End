import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import { useEffect, useState } from "react";
import { Card, Button, Checkbox } from 'react-native-paper'
import { useDispatch } from 'react-redux'


export default function PracticeCardComponent(props) {

    const [flag, setFlag] = useState(false);
    const [isRadioBtnShow, setIsRadioBtnShow] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setIsRadioBtnShow(props.isRadioBtnShow)

        if(props.isUserRemoveAll && props.isRadioBtnON ){
            setChecked(true)
            props.checkUnCheckPractice(true,props.practice._id)
        }else if(!props.isRadioBtnON && props.isUserRemoveAll){
            setChecked(false)
            props.checkUnCheckPractice(false,props.practice._id)
        }
        
    },[props.isRadioBtnON,props.isUserRemoveAll,props.isRadioBtnShow])

    const onPressEvent = () => {
        if (isRadioBtnShow == false) {
            setFlag(!flag);
        } else {
            props.checkUnCheckPractice(!checked,props.practice._id)
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
                    <Text style={{ paddingLeft: '20%', fontWeight: 'bold', fontSize: 20 }} >{props.practice.Name}</Text>
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
                {!props.isRadioBtnShow &&<Image style={{ width: 150, height: 50 }} resizeMode='cover' source={require('../../assets/practicephoto.png')} />}
                
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