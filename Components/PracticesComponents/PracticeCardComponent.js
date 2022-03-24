import { View, Text,  TextInput, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Card,Button } from 'react-native-paper' 


export default function PracticeCardComponent(props) {

    const [flag, setFlag] = useState(false)

    const setSelectedFlag = () => {
        setFlag(!flag)
    }


    return (
        <View >

            {flag ?
                <Card style={styles.mainCardViewFlag} onPress={setSelectedFlag} >
                        <Text  >{props.practice.Name}</Text>
                        <Image
                            style={styles.tinyLogo}
                            source={{
                                uri: 'https://gsmauditors.com/wp-content/uploads/2016/05/istockphoto-1133765772-612x612-1.jpg',
                            }}></Image>
                        <Card.Actions>
                            <Button  onPress={() => { props.callBack(props.team,'detailsBtn') }}>More Details</Button>
                            <Button  onPress={() => { props.callBack(props.team,'editBtn') }}>Edit</Button>
                            <Button  onPress={() => { props.callBack(props.team,'removeBtn') }} >Remove</Button>
                        </Card.Actions>
                </Card>
                :
                <Card style={styles.mainCardView} onPress={setSelectedFlag} >
                        <Text  >{props.practice.Name}</Text>
                        <Image
                            style={styles.tinyLogo}
                            source={{
                                uri: 'https://gsmauditors.com/wp-content/uploads/2016/05/istockphoto-1133765772-612x612-1.jpg',
                            }}></Image>
                </Card>
            }

        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        paddingTop:Platform.OS==='android'?0:0,
        paddingEnd:10,
        margin:10,
       
        
     
    },
    title:{
      textAlign:'right'
    },
    card:{
      height:100,
      width:100,
      fontSize:100,
    },
    tinyLogo: {
      width: 50,
      height: 50,
    },
    mainCardView: {
      margin:10,
      height:120,
      borderRadius: 15,
      shadowRadius: 8,
      elevation: 8,
      paddingLeft: 16,
      paddingRight: 14,
     
     
    
    },
    mainCardViewFlag: {
      margin:10,
      height:150,
      borderRadius: 15,
      shadowRadius: 8,
      elevation: 8,
      paddingLeft: 16,
      paddingRight: 14,
      },
      ButtoNStyle:{
        borderRadius: 25,
  
      }
  
  });