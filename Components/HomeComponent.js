import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, ScrollView, Alert } from 'react-native';
import { Context } from '../ContextAPI/Context';
import { IP } from '../IP_Address';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
// import XLSX from 'xlsx'
// import * as FileSystem from 'expo-file-system';
// import { PermissionsAndroid } from 'react-native';
// import * as IntentLauncher from 'expo-intent-launcher';
import { ActivityIndicator, Colors } from 'react-native-paper';
import DataToExcel from '../Services/DataToExcel'



export default function HomeComponent() {

  const { excelProcess } = DataToExcel;
  const { userId, teamsMap } = React.useContext(Context);
  const [userIdValue] = userId;
  const [teamsNameMap, setMap] = teamsMap
  // const [excelData, setExcelData] = useState([])


  const [teamsPieData, setTeamsPieData] = useState([])
  const [practicePieData, setPracticePieData] = useState([])
  const [barChartData, setBarChartData] = useState([])
  const [beltsPieData, setBeltsPieData] = useState([])
  const redColors = ['rgb(179, 0, 0)', 'rgb(230, 0, 0)', 'rgb(255, 0, 0)', 'rgb(255, 51, 51)', 'rgb(255, 102, 102)', 'rgb(255, 153, 153)']
  // const greenColors = ['rgb(150, 250, 130)', 'rgb(120, 240, 60)', 'rgb(66, 255, 80)', 'rgb(200, 255, 90)', 'rgb(100, 255, 208)', 'rgb(113, 255, 100)']
  const blueColors = ['rgb(0, 0, 80)', 'rgb(0, 0, 153)', 'rgb(0, 0, 255)', 'rgb(128, 128, 255)', 'rgb(204, 204, 255)']
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    getBeltsAverage()
    getTotalDivisionByMonth();
    getdistributionbyTeam();
    getTotalDivision();

  }, [])

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    barPercentage: 0.5,
    spacingInner: 0.5,
    color: (opacity = 1) => `rgba(200, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const configBar = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0,
    fillShadowGradient: 'black',
    fillShadowGradientOpacity: 1,
    fillShadowGradientFrom: '#2f4261',
    labelColor: () => 'black',
    // color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    color: () => 'rgb(13, 0, 255)',
    barRadius: 60,
    barPercentage: 0.2,
    useShadowColorFromDataset: false, // optional
  };

  const dataBarPie = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: barChartData,
        color: (opacity = 1) => `rgba(200, 0, 0, ${opacity})`, // optional
      }
    ],
  };


  const getBeltsAverage = () => {
    axios.post('http://' + IP + '/students/getBeltsAverage', { userId: userIdValue }).then(response => {
      if (response.data.length > 0) {
        let arr = []
        response.data.forEach((colorObj, i) => {
          if (colorObj[1] != 0) {
            let obj = {
              name: '% ' + colorObj[0],
              population: Math.trunc(colorObj[1]),
              // color:greenColors[Math.floor(Math.random()*6)],
              color: colorObj[0],
              legendFontSize: 15,
              legendFontColor: "#7F7F7F",
            }
            arr.push(obj)
          }
        });
        setBeltsPieData(arr)
      }
    })
  }

  const getTotalDivisionByMonth = () => {
    axios.post('http://' + IP + '/practices/getTotalDivisionByMonth', { userId: userIdValue }).then(res => {
      if (res.data) {
        setBarChartData(res.data)
      }
    })
  }

  const getdistributionbyTeam = () => {
    axios.post('http://' + IP + '/teams/getdistributionbyTeam', { userId: userIdValue }).then(res => {
      let isOnlyOneTeamWithoutStudents = res.data.length == 1 && res.data[0].studQuantity == 0
      let arr = [];

      if (isOnlyOneTeamWithoutStudents) {
        setTeamsPieData([])

      } else {

        if (res.data.length > 0) {
          res.data.forEach((data) => {
            let obj = {
              name: "%  " + data.name,
              population: Math.trunc(data.studQuantity),
              color: blueColors[Math.floor(Math.random() * 5)],
              legendFontSize: 15,
              legendFontColor: "#7F7F7F",
            }
            arr.push(obj)
          });
          setTeamsPieData(arr)
        }
      }
    })
  }

  const getTotalDivision = () => {
    axios.post('http://' + IP + '/practices/getTotalDivision', { userId: userIdValue }).then(res => {
      let arr1 = [];

      if (res.data.present == 0 && res.data.notPresent == 0 && res.data.total == 0) {
        setPracticePieData(arr1);
      } else {

        let obj = {
          name: '%  Present',
          population: ((res.data.present / res.data.total) * 100),
          color: redColors[Math.floor(Math.random() * 6)],
          legendFontSize: 15,
          legendFontColor: "#7F7F7F",
        }
        let obj1 = {
          name: '%  Not Present',
          population: ((res.data.notPresent / res.data.total) * 100),
          color: redColors[Math.floor(Math.random() * 6)],
          legendFontSize: 15,
          legendFontColor: "#7F7F7F",
        }
        arr1.push(obj)
        arr1.push(obj1)
        setPracticePieData(arr1)
      }

    })
  }

  const addData = () => {
    axios.post('http://' + IP + '/login/adddata', { userId: userIdValue }).then(res => {
      if (res.data) {
        // Alert.alert('data added')
      } else {
        Alert.alert('there was a problem')
      }
    })
  }

  const toExcel = () => {
    excelProcess(userIdValue)
  }

  const isLoading = () => {
    if (barChartData.length <= 0 && teamsPieData.length <= 0 && practicePieData.length <= 0) {
      return true;
    } else {
      return false
    }
  }

  return (

    <View style={styles.container}>

      {isLoading() && <ActivityIndicator type={'large'} animating={true} color={Colors.red800} />}

      {!isLoading() &&

        <ScrollView>

          <Text style={{ fontSize: 30, padding: 15 }}>Student By Team</Text>
          {teamsPieData.length > 0 ?
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
            :
            <Text>No Data</Text>

          }
          <Text style={{ fontSize: 30, padding: 15 }}>Student By Practices</Text>
          {practicePieData.length > 0 ?
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
            :
            <Text >No Data</Text>
          }
          <Text style={{ fontSize: 30, padding: 15 }}>Belts Averages</Text>
          {beltsPieData.length > 0 ?
            <PieChart
              data={beltsPieData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 10]}

              absolute
            />
            :
            <Text >No Data</Text>
          }

          <Text style={{ fontSize: 26, padding: 15 }}>Student Practices By Month (%)</Text>
          {dataBarPie.datasets[0].data ?
            <BarChart
              style={{ padding: 30 }}
              data={dataBarPie}
              width={screenWidth}
              flatColor={true}
              showValuesOnTopOfBars={true}
              height={250}
              decimalPlaces={2}
              yAxisLabel="%"
              xLabelsOffset={5}
              chartConfig={configBar}
              verticalLabelRotation={30}
              absolute={true}
              withHorizontalLabels={false}
              showBarTops={false}
              center={[0, 0]}
              fromZero

            />
            :
            <Text>No Data</Text>

          }


          <Button onPress={toExcel} title='Export Db To Excel' />
        </ScrollView>
      }
      <Button onPress={addData} title='Add Data' />

    </View>

  )



}


const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    // flex: 0,
    backgroundColor: '#fff',
    // alignItems: 'center',
    fontSize: 10,
  }
})

