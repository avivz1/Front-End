import { StyleSheet, Text, View, Button, TextInput, ViewComponent,ScrollView,Image, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'
import { inline } from 'react-native-web/dist/cjs/exports/StyleSheet/compiler';
import { block } from 'react-native-reanimated';
import { DataTable, FAB } from 'react-native-paper'




export default function TeamDetailsComponent(props) {
    const [teamName,setTeamName] = useState(props.team.Name)
    const [teamType,setTeamType] = useState(props.team.Type)
    const [teamCity,setTeamCity] = useState(props.team.City)
    const [studentsList,setStudentsList] = useState([])
 

    useEffect(()=>{
        let obj ={
            Name:'aviv',
            Belt:'red',
            isDeleted:false,
            isChecked:true,
        }
        let arr=[]
        arr.push(obj)
        setStudentsList(arr)
    },[]);


    return (

        <View style={[styles.mainView]} >
            <Text style={[styles.text]}>Name : {teamName}</Text>
            <Text style={[styles.text]}>Type : {teamType}</Text>
            <Text style={[styles.text]}>City : {teamCity}</Text>


            <View style={[styles.container]}>

                <DataTable style={{ width: '100%', paddingTop: 30 }} >
                    <DataTable.Header style={{ backgroundColor: '#cc99ff', fontWeight: 'bold' }}>
                        <DataTable.Title style={{ fontWeight: 'bold' }}>Name</DataTable.Title>
                        <DataTable.Title style={{ backgroundColor: '#cc99ff', fontWeight: 'bold' }}>Belt</DataTable.Title>
                        <DataTable.Title style={{ backgroundColor: '#cc99ff', fontWeight: 'bold' }}>present</DataTable.Title>
                    </DataTable.Header>

                    <ScrollView style={[styles.scrollStyle]} >
                        {studentsList.length > 0 ? studentsList.map((stu, index) => {
                            return (
                                <DataTable.Row  onPress={() => { }} key={index}>
                                    <DataTable.Cell>{stu.Name}</DataTable.Cell>
                                    <DataTable.Cell>{stu.Belt}</DataTable.Cell>
                                    <DataTable.Cell>{stu.isDeleted ?
                                        <Image style={{ width: 12, height: 15 }} source={require('../../assets/garbageIcon.png')} />
                                        :stu.isChecked? 
                                        <Image style={{ width: 11, height: 11 }} source={require('../../assets/check.png')} />
                                        :
                                        <Image style={{ width: 11, height: 11 }} source={require('../../assets/uncheck.png')} />
                                    }
                                    </DataTable.Cell>
                                </DataTable.Row>
                            )
                        })

                            :
                            <Text>No Students</Text>

                        }
                    </ScrollView>
                </DataTable>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    // container: {
    //     paddingTop: Platform.OS === 'android' ? 80 : 0,
    //     flex: 1,

    // },
    mainView : {
        alignItems:'center',
        textAlign:'center',
        height:'100%',
        width:'100%',
        margin:2,
        padding:2,
        
    },
    text:{
        margin:2,
        padding:2,
        fontWeight:'bold',
    },

    container: {
        flex: 0,
        paddingTop: 10,
        backgroundColor: '#ffffff',
        height: '90%',
        width: '100%',
        alignContent: 'center',
    },

    scrollStyle: {
        width: '100%',
        height: '70%',
        // backgroundColor: '#33ccff',

    },

    headLine: {
        fontWeight: "bold",
        padding: 5,
    }

});
