import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button,Dimensions, TextInput } from 'react-native';
import { Context } from '../ContextAPI/Context';
import { IP } from '../IP_Address';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

export default function HomeComponent() {

  const { userId, teamsMap } = React.useContext(Context);
  const [teamsNameMap, setMap] = teamsMap
  const [userIdValue] = userId;
  const screenWidth = Dimensions.get("window").width;
  
  const [teamsPieData,setTeamsPieData] = useState([])
  const [practicePieData,setPracticePieData] = useState([])
  const redColors = ['rgb(255, 0, 30)','rgb(255, 80, 70)','rgb(200, 0, 0)','rgb(255, 208, 66)','rgb(255, 255, 66)','rgb(255, 66, 66)']
  const greenColors = ['rgb(130, 255, 50)','rgb(130, 240, 40)','rgb(66, 255, 113)','rgb(255, 255, 66)','rgb(66, 255, 208)','rgb(113, 255, 66)']
  const blueColors = ['rgb(66, 255, 255)','rgb(66, 208, 255)','rgb(66, 161, 255)','rgb(66, 113, 255)','rgb(66, 66, 255)','rgb(113, 66, 255)']

  useEffect(async () => {
    axios.post('http://' + IP + '/teams/getdistributionbyTeam/', { userId:userIdValue }).then(res => {
      let arr=[];
      res.data.forEach((data,i) => {
        let obj = {
          name: data.name,
          population: data.studQuantity,
          color: redColors[i],
          legendFontSize: 15,
          legendFontColor: "#7F7F7F",
        }
        arr.push(obj)
      });
      setTeamsPieData(arr)
  })

  axios.post('http://' + IP + '/practices/getTotalDivision/', { userId:userIdValue }).then(res => {
    let arr1=[];

    let obj = {
      name: 'Present',
      population: ((res.data.present/res.data.total)*100),
      color: blueColors[0],
      legendFontSize: 15,
      legendFontColor: "#7F7F7F",
    }
    let obj1 = {
      name: 'Not Present',
      population: ((res.data.notPresent/res.data.total)*100),
      color: blueColors[1],
      legendFontSize: 15,
      legendFontColor: "#7F7F7F",
    }
    arr1.push(obj)
    arr1.push(obj1)
    setPracticePieData(arr1)

})


  }, [])


  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };


return (


  <View style={styles.container}>
    <Text style={{fontSize:30, padding:15}}>Student By Team</Text>
    <PieChart
      data={teamsPieData}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      accessor={"population"}
      backgroundColor={"transparent"}
      paddingLeft={"15"}
      center={[10, 10]}
      absolute
    />
       <Text style={{fontSize:30, padding:15}}>Student By Practices</Text>
    <PieChart
      data={practicePieData}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      accessor={"population"}
      backgroundColor={"transparent"}
      paddingLeft={"15"}
      center={[10, 10]}
      absolute
    />

  </View>


)









}


const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    fontSize: 10,
  }
})