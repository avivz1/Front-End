import { View, Text,  TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import React, { useState,useEffect } from "react";
import { Card,Button ,Checkbox} from 'react-native-paper' 


export default function TeamCardComponent(props) {

    const [flag, setFlag] = useState(false);
    const [isRadioBtnShow, setIsRadioBtnShow] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setIsRadioBtnShow(props.isRadioBtnShow)

        if(props.isUserRemoveAll && props.isRadioBtnON ){
            setChecked(true)
            props.checkUnCheckTeam(true,props.team._id)
        }else if(!props.isRadioBtnON && props.isUserRemoveAll){
            setChecked(false)
            props.checkUnCheckTeam(false,props.team._id)
        }
        
    },[props.isRadioBtnON,props.isUserRemoveAll,props.isRadioBtnShow])

    const onPressEvent = () => {
        if (isRadioBtnShow == false) {
            setFlag(!flag);
        } else {
            props.checkUnCheckTeam(!checked,props.team._id)
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
        // <View >

        //     {flag ?
        //         <Card style={styles.mainCardViewFlag} onPress={setSelectedFlag} >
        //                 <Text  >{props.team.Name}</Text>
        //                 <Image
        //                     style={styles.tinyLogo}
        //                     source={{
        //                         uri: 'https://gsmauditors.com/wp-content/uploads/2016/05/istockphoto-1133765772-612x612-1.jpg',
        //                     }}></Image>
        //                 <Card.Actions>
        //                     <Button  onPress={() => { props.callBack(props.team,'detailsBtn') }}>More Details</Button>
        //                     <Button  onPress={() => { props.callBack(props.team,'editBtn') }}>Edit</Button>
        //                     <Button  onPress={() => { props.callBack(props.team,'removeBtn') }} >Remove</Button>
        //                 </Card.Actions>
        //         </Card>
        //         :
        //         <Card style={styles.mainCardView} onPress={setSelectedFlag} >
        //                 <Text  >{props.team.Name}</Text>
        //                 <Image
        //                     style={styles.tinyLogo}
        //                     source={{
        //                         uri: 'https://gsmauditors.com/wp-content/uploads/2016/05/istockphoto-1133765772-612x612-1.jpg',
        //                     }}></Image>
        //         </Card>
        //     }

        // </View>

        <View style={[styles.container]}>

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
            {!props.isRadioBtnShow &&<Image style={{ width: 70, height: 70 }} resizeMode='cover' source={require('../../assets/teaml.png')} />}
            
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