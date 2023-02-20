import { StyleSheet, Text, View,  ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react'
import { DataTable, FAB } from 'react-native-paper'
import { Context } from '../../ContextAPI/Context';
import axios from 'axios';
import { IP } from '../../IP_Address';






export default function TeamDetailsComponent(props) {

    const { userId } = React.useContext(Context);
    const [userIdValue] = userId;

    const [teamName, setTeamName] = useState(props.team.Name)
    const [teamType, setTeamType] = useState(props.team.Type)
    const [teamCity, setTeamCity] = useState(props.team.City)
    const [createdDate, setCreatedDate] = useState(props.team.CreatedDate.split('T')[0])
    const [teamId, setTeamId] = useState(props.team._id)
    const [studentsList, setStudentsList] = useState([])


    useEffect(() => {
        getStudentsByTeam()
    }, []);

    const getStudentsByTeam = () => {
        axios.post('http://' + IP + '/students/getstudentsbyteamid', { teamId: teamId, userId: userIdValue }).then(res => {
            if (res.data.length > 0) {
                setStudentsList(res.data)
            }
        })
    }


    return (

        <View style={[styles.container]}>
            <Text style={[styles.text]}>Name : {teamName}</Text>
            <Text style={[styles.text]}>Type : {teamType}</Text>
            <Text style={[styles.text]}>City : {teamCity}</Text>
            <Text style={[styles.text]}>Created Date : {createdDate}</Text>
            <Text style={[styles.text]}>Num of Students  : {studentsList.length}</Text>


            <View style={{flex:0}}>

                <DataTable style={{ overflow: 'scroll',padding:20 }}>
                    <DataTable.Header style={{ backgroundColor: '#cc99ff', fontWeight: 'bold' }}>
                        <DataTable.Title style={{ fontWeight: 'bold' }}>Name</DataTable.Title>
                        <DataTable.Title style={{ backgroundColor: '#cc99ff', fontWeight: 'bold' }}>Belt</DataTable.Title>
                        <DataTable.Title style={{ backgroundColor: '#cc99ff', fontWeight: 'bold' }}>Age</DataTable.Title>
                    </DataTable.Header>

                    <ScrollView style={{ height: '60%', width: '100%', }} >
                        {studentsList.length > 0 ? studentsList.map((stu) => {
                            return (
                                <DataTable.Row onPress={() => { }} key={stu._id}>
                                    <DataTable.Cell>{stu.Name}</DataTable.Cell>
                                    <DataTable.Cell>{stu.Belt}</DataTable.Cell>
                                    <DataTable.Cell>{stu.Age}</DataTable.Cell>
                                </DataTable.Row>
                            )
                        })

                            :
                            <Text>No Students</Text>

                        }
                    </ScrollView>
                </DataTable>
            </View>
        </View >
    )
}



const styles = StyleSheet.create({
    // container: {
    //     paddingTop: Platform.OS === 'android' ? 80 : 0,
    //     flex: 1,

    // },
    mainView: {
        alignItems: 'center',
        textAlign: 'center',
        height: '80%',
        width: '100%',
        margin: 2,
        padding: 2,
        flex: 0,

    },
    text: {
        margin: 2,
        padding: 2,
        fontWeight: 'bold',
    },

    container: {
        display:'flex',
        alignSelf: 'center',
        height: '70%',
        width: '100%',
        flex: 0,

    },

    container1: {
        paddingTop: 10,
        backgroundColor: '#ffffff',
        height: '100%',
        width: '100%',
        alignContent: 'center',
        overflow: 'scroll'
    },

    scrollStyle: {
        height: 300,
    },

    headLine: {
        fontWeight: "bold",
        padding: 5,
    }

});

