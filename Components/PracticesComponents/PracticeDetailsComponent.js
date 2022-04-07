import { StyleSheet, Text, View, ScrollView, TextInput, ViewComponent, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { IP } from '../../IP_Address';
import { DataTable } from 'react-native-paper'






export default function PracticeDetailsComponent(props) {

    const { teamsMap, userId } = React.useContext(Context);
    const [teamsNameMap, setMap] = teamsMap
    const [precentage, setPrecentage] = useState('')
    const [userIdValue] = userId;
    const [studentsList,setStudentsList] = useState([])




    useEffect(()=> {
        getAttendancePrecent()
        getStudentsFullDetails()
        let x = props.practice.Date.split('T')
        props.practice.Date = x[0];
    }, []);

    useEffect(()=>{

    },[])

    const getTeamName = (teamId) => {
        let name = teamsNameMap.get(teamId);
        return name;
    }

    const getStudentsFullDetails = () => {
        let stuArr = props.practice.Students.filter(s=>s.Name==null)
        axios.post('http://' + IP + '/students/getFewStudents', { students: stuArr }).then(res => {
            if (res.data != false) {
                setStudentsList(res.data)
            }
        })
    }

    const getAttendancePrecent = () => {
        axios.post('http://' + IP + '/practices/attendancepercentage', { practice: props.practice, userId: userIdValue }).then(res => {
            if (res.data != false) {
                setPrecentage(res.data)
            }
        })
    }
    
    return (

        <View style={[styles.container]}>
            <Text style={{padding:5}} >Name : {props.practice.Name}</Text>
            <Text style={{padding:5}}>Date : {props.practice.Date}</Text>
            <Text style={{padding:5}}>Hour : {props.practice.PracticeHour}</Text>
            <Text style={{padding:5}}>Total Students :{props.practice.Students.length}</Text>

            <Text style={{padding:5}}>Team : {getTeamName(props.practice.Team.Team_ID)}  </Text>
            <Text style={{padding:5}}>Arrivel Precent : {precentage ? precentage.toFixed(2) : ''}%  </Text>

            <DataTable style={[styles.TableText]} >
                <DataTable.Header>
                    <DataTable.Title>Name</DataTable.Title>
                    <DataTable.Title>Belt</DataTable.Title>
                </DataTable.Header>
            
                {studentsList.length > 0 ? studentsList.map((stu, index) => {
                    return (
                        <DataTable.Row style={[styles.editForm]} key={index}>
                                <DataTable.Cell>{stu.Name}</DataTable.Cell>
                                <DataTable.Cell>{stu.Belt}</DataTable.Cell>
                            </DataTable.Row>
                        )
                    })
                    
                    :
                    <Text>No Students</Text>
                    
                }
            </DataTable>

        </View>
    )
}



const styles = StyleSheet.create({

    head: { height: 400, backgroundColor: 'orange' },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#2ecc71' },
    row: { height: 28 },
    text: { textAlign: 'center' },


    container: {
        flex: 0,
        padding: 10,
        paddingTop: 10,
        backgroundColor: '#ffffff',
        height:'60%'
      },
      
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1,
        fontSize: 15,
    },
    editForm: {
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    HeadStyle: {
        height: 50,
        alignContent: "center",
        backgroundColor: '#CE39FE'
      },
      TableText: {
        margin: 8,
        height: 49,
        padding:5,
        alignContent: "center",
        alignItems: 'center',
      }
});

