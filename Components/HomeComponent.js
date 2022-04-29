import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, ScrollView } from 'react-native';
import { Context } from '../ContextAPI/Context';
import { IP } from '../IP_Address';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system';
import { PermissionsAndroid } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { ActivityIndicator, Colors } from 'react-native-paper';




export default function HomeComponent() {

  const { userId, teamsMap } = React.useContext(Context);
  const [teamsNameMap, setMap] = teamsMap
  const [userIdValue] = userId;
  const [excelData, setExcelData] = useState([])

  
  const [teamsPieData, setTeamsPieData] = useState([])
  const [practicePieData, setPracticePieData] = useState([])
  const [barChartData, setBarChartData] = useState([])
  const redColors = ['rgb(100, 100, 100)', 'rgb(100, 100, 200)', 'rgb(200, 0, 0)', 'rgb(255, 100, 66)', 'rgb(255, 155, 66)', 'rgb(255, 66, 66)']
  const greenColors = ['rgb(150, 250, 100)', 'rgb(100, 240, 40)', 'rgb(66, 255, 113)', 'rgb(255, 255, 66)', 'rgb(66, 255, 208)', 'rgb(113, 255, 66)']
  const blueColors = ['rgb(66, 255, 255)', 'rgb(66, 208, 255)', 'rgb(66, 161, 255)', 'rgb(66, 113, 255)', 'rgb(66, 66, 255)', 'rgb(113, 66, 255)', 'rgb(100, 100, 200)', 'rgb(150, 120, 230)']
  const screenWidth = Dimensions.get("window").width;

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
    color: () => 'rgb(13, 0, 255, 1)',
    barRadius: 60,
    barPercentage: 0.2,
    useShadowColorFromDataset: false, // optional
  };

  const dataBarPie = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: barChartData ? barChartData : [],
        color: (opacity = 1) => `rgba(200, 0, 0, ${opacity})`, // optional
      }
    ],
  };

  const headers = [
    { label: "Name", key: "name" },
    { label: "Team_ID", key: "teamId" },
    { label: "User_ID", key: "userId" },
    { label: "Created_Date", key: "createdDate" },
    { label: "Age", key: "age" },
    { label: "Belt", key: "belt" },
    { label: "Image", key: "image" },
    { label: "Practices", key: "practices" },
    { label: "City", key: "city" },
  ];



  useEffect(async () => {
    dataForBackup();

    axios.post('http://' + IP + '/practices/getTotalDivisionByMonth', { userId: userIdValue }).then(res => {
      if (res.data) {
        setBarChartData(res.data)
      }
    })


    axios.post('http://' + IP + '/teams/getdistributionbyTeam', { userId: userIdValue }).then(res => {
      let arr = [];
      if (res.data.length > 0) {
        res.data.forEach((data, i) => {
          let obj = {
            name: data.name,
            population: data.studQuantity,
            color: blueColors[i],
            legendFontSize: 15,
            legendFontColor: "#7F7F7F",
          }
          arr.push(obj)
        });
        setTeamsPieData(arr)
      }
    })

    axios.post('http://' + IP + '/practices/getTotalDivision', { userId: userIdValue }).then(res => {
      let arr1 = [];

      if (res.data.present == 0 && res.data.notPresent == 0 && res.data.total == 0) {
        setPracticePieData(arr1);
      } else {

        let obj = {
          name: '%  Present',
          population: ((res.data.present / res.data.total) * 100),
          color: redColors[0],
          legendFontSize: 15,
          legendFontColor: "#7F7F7F",
        }
        let obj1 = {
          name: '%  Not Present',
          population: ((res.data.notPresent / res.data.total) * 100),
          color: redColors[1],
          legendFontSize: 15,
          legendFontColor: "#7F7F7F",
        }
        arr1.push(obj)
        arr1.push(obj1)
        setPracticePieData(arr1)
      }

    })


  }, [])

  const addData = () => {
    axios.post('http://' + IP + '/login/adddata', { userId: userIdValue }).then(res => {
      if (res.data) {
        Alert.alert('data added')
      } else {
        Alert.alert('there was a problem')
      }
    })
  }

  // Function to check the platform
  // If Platform is Android then check for permissions.
  const checkPermission = async () => {

    if (Platform.OS === 'ios') {
      tryExcel();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          console.log('Storage Permission Granted.');
          tryExcel();
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log("++++" + err);
      }
    }
  };


  const dataForBackup = () => {
    axios.post('http://' + IP + '/login/backupdb', { userId: userIdValue }).then(res => {
      if (res.data != false) {
        setExcelData(res.data)
      }
    })
  }



  const tryExcel = async (data) => {
    let dataSheet1 = excelData[0].map(practice => {
      let obj = {
        'Name': practice.Name,
        'Date': practice.Date,
        'Team': practice.Team.Name ? practice.Team.Name : practice.Team.Team_ID,
        'Students': () => {
          let arr = []
          practice.Students.forEach(stu => {
            arr.push(stu.Name ? stu.Name : stu.Student_ID)
          });
          return arr.toString()
        },

      }
      return obj;
    })
    let dataSheet2 = excelData[1].map(team => {
      let obj = {
        'Name': team.Name,
        'City': team.City,
        'Created_Date': team.CreatedDate,
        'Type': team.Type,
      }
      return obj;
    })
    let dataSheet3 = excelData[2].map(stu => {
      let obj = {
        'Name': stu.Name,
        'Age': stu.Age,
        'Belt': stu.Belt,
        'City': stu.City,
        'Created_Date': stu.CreatedDate,
        'Image': stu.Image,
        'Team': stu.Team_ID,
        'Practices': stu.Practices.toString
      }
      return obj;
    })

    var ws = XLSX.utils.json_to_sheet(dataSheet1);
    var ws1 = XLSX.utils.json_to_sheet(dataSheet2);
    var ws2 = XLSX.utils.json_to_sheet(dataSheet3);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Practices");
    XLSX.utils.book_append_sheet(wb, ws1, "Teams");
    XLSX.utils.book_append_sheet(wb, ws2, "Students");
    const wbout = XLSX.write(wb, {
      type: 'base64',
      bookType: "xlsx"
    });
    const uri = FileSystem.cacheDirectory + 'file.xlsx'
    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64
    });



    await FileSystem.getContentUriAsync(uri).then(cUri => {
      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: cUri,
        flags: 1,
      });
    });

  }

  const isLoading = ()=>{
    if(barChartData.length<=0 || teamsPieData.length<=0 || practicePieData.length<=0){
      return true;
    }else{
      return false
    }
  }

  return (

    <View style={styles.container}>

      {isLoading() && <ActivityIndicator  type={'large'} animating={true} color={Colors.red800} />}

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
        <Text style={{ fontSize: 26, padding: 15 }}>Student Practices By Month (%)</Text>

        {dataBarPie ?
          <BarChart
            style={{ padding: 30 }}
            data={dataBarPie}
            width={screenWidth}
            flatColor={true}
            showValuesOnTopOfBars={true}
            height={250}
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


        <Button style={styles.center} onPress={addData} title='Add Data' />
        {excelData &&
          <Button style={''} onPress={checkPermission} title='Export Db To Excel' />}
      </ScrollView>
      }

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

