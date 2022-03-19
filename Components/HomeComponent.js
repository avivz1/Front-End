import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { Context } from '../ContextAPI/Context';
import { IP } from '../IP_Address';


export default function HomeComponent() {

  // const { userId, teams, students,teamStudents } = React.useContext(Context);
  // const [teamsValue, setTeams] = teams;
  // const [studentsArr, setStudents] = students;
  // const [user_id] = userId;
  // const [teamStudentsArr, setTeamStudents] = teamStudents;



  // useEffect(async () => {
  //   let response = await axios.post('http://'+IP+'/teams/getalluserteams', { userID: user_id })
  //   if (response.data) {
  //     setTeams(response.data)
  //   }
  //   let response1 = await axios.post('http://'+IP+'/students/getallstudentsbyuserid',{ userid: user_id })
  //   if (response1.data) {
  //     setStudents(response1.data);
  //   }
  //   if(teamsValue.length>0 && studentsArr.length>0){
  //     let stuArr = studentsArr.filter(s => s.Team_ID == teamsValue[0]._id)
  //     setTeamStudents(stuArr)
  //   }

  // }, [])




  return (
    <View><Text>Home</Text></View>
  )

  const styles = StyleSheet.create({
    container: {
      alignSelf: 'center',
      flex: 2,
      height: '40%',
      width: '80%',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 10,
    }
  })

}
