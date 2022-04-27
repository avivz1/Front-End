import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, Dimensions, TextInput,ScrollView } from 'react-native';
import { Context } from '../ContextAPI/Context';
import { IP } from '../IP_Address';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system';
import { PermissionsAndroid } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';




export default function HomeComponent() {

  const { userId, teamsMap } = React.useContext(Context);
  const [teamsNameMap, setMap] = teamsMap
  const [userIdValue] = userId;
  const [excelData, setExcelData] = useState([])


  const [teamsPieData, setTeamsPieData] = useState([])
  const [practicePieData, setPracticePieData] = useState([])
  const redColors = ['rgb(100, 100, 100)', 'rgb(100, 100, 200)', 'rgb(200, 0, 0)', 'rgb(255, 100, 66)', 'rgb(255, 155, 66)', 'rgb(255, 66, 66)']
  const greenColors = ['rgb(150, 250, 100)', 'rgb(100, 240, 40)', 'rgb(66, 255, 113)', 'rgb(255, 255, 66)', 'rgb(66, 255, 208)', 'rgb(113, 255, 66)']
  const blueColors = ['rgb(66, 255, 255)', 'rgb(66, 208, 255)', 'rgb(66, 161, 255)', 'rgb(66, 113, 255)', 'rgb(66, 66, 255)', 'rgb(113, 66, 255)','rgb(100, 100, 200)', 'rgb(150, 120, 230)']
  const screenWidth = Dimensions.get("window").width;
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(200, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const data12 = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(200, 0, 0, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    // legend: ["Rainy"] // optional
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
    
    axios.post('http://' + IP + '/practices/getTotalDivisionByMonth', { userId: userIdValue }).then(res=>{
    if(res.data){
      console.log(res.data)
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
    let dataSheet1 = excelData[0].map(practice=>{
      let obj={
        'Name':practice.Name,
        'Date':practice.Date,
        'Team':practice.Team.Name?practice.Team.Name:practice.Team.Team_ID,
        'Students':()=>{
          let arr =[]
          practice.Students.forEach(stu => {
            arr.push(stu.Name?stu.Name:stu.Student_ID)
          });
          return arr.toString()
        },
        
      }
      return obj;
    })
    let dataSheet2 = excelData[1].map(team=>{
      let obj={
        'Name':team.Name,
        'City':team.City,
        'Created_Date':team.CreatedDate,
        'Type':team.Type,
      }
      return obj;
    })
    let dataSheet3 = excelData[2].map(stu=>{
      let obj={
        'Name':stu.Name,
        'Age':stu.Age,
        'Belt':stu.Belt,
        'City':stu.City,
        'Created_Date':stu.CreatedDate,
        'Image':stu.Image,
        'Team' :stu.Team_ID,
        'Practices':stu.Practices.toString
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


  return (

    <View style={styles.container}>
      <ScrollView>

      <Text style={{ fontSize: 30, padding: 15 }}>Student By Team</Text>
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
      <Text style={{ fontSize: 30, padding: 15 }}>Student By Practices</Text>
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
      <BarChart
        data={data12}
        width={screenWidth}
        height={220}
        yAxisLabel="$"
        chartConfig={chartConfig}
        verticalLabelRotation={30}
/>

      <Button style={styles.center} onPress={addData} title='Add Data' />
      {excelData &&
        <Button style={''} onPress={checkPermission} title='Export Db To Excel' />}
      </ScrollView>

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











// var ws = XLSX.utils.json_to_sheet(excelData);

// const headerString = 'event,timestamp\n';
// const rowString = excelData.map(d => `${d[0]},${d[1]}\n`).join('');
// const csvString = `${headerString}${rowString}`;

// // write the current list of answers to a local csv file
// const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/data.csv`;
// // pathToWrite /storage/emulated/0/Download/data.csv
// RNFetchBlob.fs
//   .writeFile(pathToWrite, csvString, 'utf8')
//   .then(() => {
//     // wrote file /storage/emulated/0/Download/data.csv
//   })
//   .catch(error => console.error(error));

// var wb = XLSX.utils.book_new();
// XLSX.utils.book_append_sheet(wb,ws,"Prova");
// const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
// var file = fs. + '/test.xlsx';
// writeFile(file, wbout, 'ascii').then((r)=>{/* :) */}).catch((e)=>{/* :( */});


// var ws = XLSX.utils.json_to_sheet(excelData);
// var wb = XLSX.utils.book_new();
// XLSX.utils.book_append_sheet(wb, ws, "file");
// const wbout = XLSX.write(wb, {
//   type: 'base64',
//   bookType: "xlsx"
// });
// const uri = FileSystem.cacheDirectory + 'file.xlsx';
// await FileSystem.writeAsStringAsync(uri, wbout, {
//   encoding: FileSystem.EncodingType.Base64
// });



// await Sharing.shareAsync(uri, {
//   mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   dialogTitle: 'MyWater data',
//   UTI: 'com.microsoft.excel.xlsx'
// });



// setUrl(url);
// const a1 = window.document.createElement('a');
// let a = global.document.getElementById('element')
// a.setAttribute('hidden','')
// // textRef.current.href
// a.setAttribute('href',url)
// a.setAttribute('download','download.csv')
// window.document.body.appendChild('a')
// a.click()
// window.document.body.removeChild('a')




{/* {url && <Button onPress={} title='Download' />} */ }


{/* <CSVLink {...csvReport}>Export to CSV</CSVLink> */ }


    // const uri = FileSystem.cacheDirectory + 'file.xlsx';
    
    // let csvFile = jsonToCSV(excelData?excelData:'')
    // const uri1 = FileSystem.getContentUriAsync(uri).then(res=>{console.log(res)})
    // 
    // FileSystem.downloadAsync(uri, FileSystem.documentDirectory + 'excelFile.xlsx', { encoding: 'Base64' }).then(r => console.log(r))
    
    // const csvData = objectToCsv(excelData)
  
    // let csvFile = jsonToCSV(excelData?excelData:'')

    
  // const objectToCsv = (rowData) => {
  
  //   const data = rowData.map(row => ({
  //     name: row.Name,
  //     teamId: row.Team_ID,
  //     userId: row.User_ID,
  //     created_Date: row.Created_Date,
  //     age: row.Age,
  //     belt: row.belt,
  //     city: row.City,
  //     image: row.Image,
  //     practices: row.Practices,
      
  //   }));
  //   const csvRows = []
  //   const headers = Object.keys(data[0] ? data[0] : {})

  //   csvRows.push(headers.join(','));

  //   for (const row of data) {
  //     const values = headers.map(header => {
  //       const escaped = ('' + row[header]).replace(/"/g, '\\"');
  //       return '"${escaped}"'
  //     })
  //     csvRows.push(values.join(','))
  //   }   

  //    return csvRows.join('\n');
  // }

  // const getReport = () => {
  //   dataForBackup()
  //   const data = excelData.map(row => ({
  //     name: row.Name,
  //     teamId: row.Team_ID,
  //     userId: row.User_ID,
  //     created_Date: row.Created_Date,
  //     age: row.Age,
  //     belt: row.belt,
  //     city: row.City,
  //     image: row.Image,
  //     practices: row.Practices,

  //   }));

  //   const csvData = objectToCsv(data)
  //   download(csvData)
  // }

  // const download = async (data) => {
  //   // const d = await FileSystem.downloadAsync(file_uri, new_path, { md5: true });
  //   const uri = FileSystem.cacheDirectory + 'file.xlsx';
  //   await FileSystem.writeAsStringAsync(uri, data, {
  //     encoding: FileSystem.EncodingType.Base64
  //   });
  //   // saveFileAsync(downloaded.uri);
  //   // const blob = new Blob([data], { type: 'text/csv' });
  //   // const url = window.URL.createObjectURL(blob);

  //   // if (url) {

  //   //   Linking.openURL(url)
  //   // }

  // }


  
  // const downloadFile1 = () => {


    // let RootDir = fs.dirs.DocumentDir;
    // let options = {
    //   fileCache: true,
    //   addAndroidDownloads: {
    //     path:
    //       RootDir +
    //       '/file_' +
    //       'csv',
    //     description: 'downloading file...',
    //     notification: true,
    //     // useDownloadManager works with Android only
    //     useDownloadManager: true,
    //   },
    // };
    // config(options)
    //   .fetch('GET', URL)
    //   .then(res => {
    //     // Alert after successful downloading
    //     alert('File Downloaded Successfully.');
    //   });
  // };
