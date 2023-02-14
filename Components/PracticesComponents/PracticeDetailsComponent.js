import { StyleSheet, Text, View, ScrollView, Image, Dimensions } from 'react-native';
import { useContext, useState, useEffect } from 'react'
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { IP } from '../../IP_Address';
import { DataTable } from 'react-native-paper'



export default function PracticeDetailsComponent(props) {

    const { teamsMap, userId } = useContext(Context);
    const [teamsNameMap, setMap] = teamsMap
    const [precentage, setPrecentage] = useState('')
    const [userIdValue] = userId;
    const [studentsList, setStudentsList] = useState([])
    const screenWidth = Dimensions.get("window").width;


    useEffect(() => {
        getAttendancePrecent()
        getStudentsFullDetails()
        let x = props.practice.Date.split('T')
        props.practice.Date = x[0];
        props.practice.Date = props.practice.Date.split('-').reverse().join('-')
    }, []);



    const getTeamName = (teamId) => {
        let name = teamsNameMap.get(teamId);
        return name;
    }

    const getStudentsFullDetails = () => {
        axios.post('http://' + IP + '/practices/getstudentlistforpratice', { userId: userIdValue, practiceId: props.practice._id, students: props.practice.Students }).then(res => {
            if (res.data != false) {
                setStudentsList(res.data)
            }
        })
    }

    const getAttendancePrecent = () => {
        axios.post('http://' + IP + '/practices/attendancepercentage', { practice: props.practice, userId: userIdValue }).then(res => {
            if (res.data != false) {
                setPrecentage(res.data.result)
            }
        })
    }

    return (

        <View style={[styles.container]}>
            <Text style={[styles.headLine]} >Name : {props.practice.Name}</Text>
            <Text style={[styles.headLine]}>Date : {props.practice.Date}</Text>
            <Text style={[styles.headLine]}>Hour : {props.practice.PracticeHour}</Text>
            <Text style={[styles.headLine]}>Total Students : {props.practice.Students.length}</Text>

            <Text style={[styles.headLine]}>Team : {getTeamName(props.practice.Team.Team_ID)}  </Text>
            <Text style={[styles.headLine]}>Present : {precentage ? precentage.toFixed(2) : 0}%  </Text>

            <View style={{}}>

                <DataTable style={{ width: '100%', paddingTop: 30 }} >
                    <DataTable.Header style={{ backgroundColor: '#cc99ff', fontWeight: 'bold' }}>
                        <DataTable.Title style={{ fontWeight: 'bold' }}>Name</DataTable.Title>
                        <DataTable.Title style={{ backgroundColor: '#cc99ff', fontWeight: 'bold' }}>Status</DataTable.Title>
                    </DataTable.Header>

                    <ScrollView style={[styles.scrollStyle]} >
                        {studentsList.length > 0 ? studentsList.map((stu) => {
                            return (
                                <DataTable.Row onPress={() => { }} key={stu._id}>
                                    <DataTable.Cell>{stu.Name}</DataTable.Cell>
                                    <DataTable.Cell>{stu.isDeleted ?
                                        <Image style={{ width: 12, height: 15 }} source={require('../../assets/garbageIcon.png')} />
                                        : stu.isChecked ?
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

})

