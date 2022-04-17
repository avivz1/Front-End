import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, Dimensions, TextInput } from 'react-native';
import { Context } from '../ContextAPI/Context';
import { IP } from '../IP_Address';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
// import { jsonToCSV } from 'react-native-csv'
// import { CSVLink } from "react-csv";



export default function HomeComponent() {

  const { userId, teamsMap } = React.useContext(Context);
  const [teamsNameMap, setMap] = teamsMap
  const [userIdValue] = userId;
  const [excelData, setExcelData] = useState([])


  const [teamsPieData, setTeamsPieData] = useState([])
  const [practicePieData, setPracticePieData] = useState([])
  const redColors = ['rgb(255, 0, 0)', 'rgb(255, 80, 70)', 'rgb(200, 0, 0)', 'rgb(255, 100, 66)', 'rgb(255, 155, 66)', 'rgb(255, 66, 66)']
  const greenColors = ['rgb(150, 250, 100)', 'rgb(100, 240, 40)', 'rgb(66, 255, 113)', 'rgb(255, 255, 66)', 'rgb(66, 255, 208)', 'rgb(113, 255, 66)']
  const blueColors = ['rgb(66, 255, 255)', 'rgb(66, 208, 255)', 'rgb(66, 161, 255)', 'rgb(66, 113, 255)', 'rgb(66, 66, 255)', 'rgb(113, 66, 255)']
  const screenWidth = Dimensions.get("window").width;

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


  useEffect(async () => {

    axios.post('http://' + IP + '/teams/getdistributionbyTeam/', { userId: userIdValue }).then(res => {
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

    axios.post('http://' + IP + '/practices/getTotalDivision/', { userId: userIdValue }).then(res => {
      let arr1 = [];

      if (res.data.present == 0 && res.data.notPresent == 0 && res.data.total == 0) {
        setPracticePieData(arr1);
      } else {

        let obj = {
          name: '%  Present',
          population: ((res.data.present / res.data.total) * 100),
          color: greenColors[0],
          legendFontSize: 15,
          legendFontColor: "#7F7F7F",
        }
        let obj1 = {
          name: '%  Not Present',
          population: ((res.data.notPresent / res.data.total) * 100),
          color: greenColors[1],
          legendFontSize: 15,
          legendFontColor: "#7F7F7F",
        }
        arr1.push(obj)
        arr1.push(obj1)
        setPracticePieData(arr1)
      }

    })


  }, [])


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


  const addData = () => {
    axios.post('http://' + IP + '/login/adddata', { userId: userIdValue }).then(res => {
      if (res.data) {
        Alert.alert('data added')
      } else {
        Alert.alert('there was a problem')
      }
    })
  }

  const dataForBackup = () => {
    axios.post('http://' + IP + '/login/backupdb', { userId: userIdValue }).then(res => {
      if (res.data != false) {
        setExcelData(res.data)
        // funcMock()
      }
    })
  }

  const funcMock = () => {
    // dataForBackup();
    // const results = jsonToCSV(excelData);
  }

  // const data = [
  //   { firstName: "Warren", lastName: "Morrow", email: "sokyt@mailinator.com", age: "36" },
  //   { firstName: "Gwendolyn", lastName: "Galloway", email: "weciz@mailinator.com", age: "76" },
  //   { firstName: "Astra", lastName: "Wyatt", email: "quvyn@mailinator.com", age: "57" },
  //   { firstName: "Jasmine", lastName: "Wong", email: "toxazoc@mailinator.com", age: "42" },
  //   { firstName: "Brooke", lastName: "Mcconnell", email: "vyry@mailinator.com", age: "56" },
  //   { firstName: "Christen", lastName: "Haney", email: "pagevolal@mailinator.com", age: "23" },
  //   { firstName: "Tate", lastName: "Vega", email: "dycubo@mailinator.com", age: "87" },
  //   { firstName: "Amber", lastName: "Brady", email: "vyconixy@mailinator.com", age: "78" },
  //   { firstName: "Philip", lastName: "Whitfield", email: "velyfi@mailinator.com", age: "22" },
  //   { firstName: "Kitra", lastName: "Hammond", email: "fiwiloqu@mailinator.com", age: "35" },
  //   { firstName: "Charity", lastName: "Mathews", email: "fubigonero@mailinator.com", age: "63" }
  // ];


  // const csvReport = {
  //   data: data,
  //   headers: headers,
  //   filename: 'Clue_Mediator_Report.csv'
  // };

  const objectToCsv = (data)=>{
    const csvRows =[]
    const headers = Object.keys(data[0]?data[0]:{})
    csvRows.push(headers.join(''));

    for(const row of data){
      const values = headers.map(header=>{
        const escaped = (''+row[header]).replace(/"/g,'\\"');
        return '"${escaped}"'
      })
      csvRows.push(values.join(','))
    }
    return csvRows.join('\n')

  }

  const getReport = () => {
    const data = excelData.map(row => ({
      name: row.Name,
      teamId: row.Team_ID,
      userId: row.User_ID,
      created_Date: row.Created_Date,
      age: row.Age,
      belt: row.belt,
      city: row.City,
      image: row.Image,
      practices: row.Practices,

    }));

    const csvData = objectToCsv(data)
    download(csvData)
  }

  const download = (data) => {
    
    const blob = new Blob([data],{type:'text/csv'});
    console.log('1')
    const url = window.URL.revokeObjectURL(blob)
    console.log('2')
    // const a1 = window.document.createElement('a');
    console.log(window.toString())
    let a = window.document.getElementById('element')
    a.setAttribute('hidden','')
    a.setAttribute('href',url)
    a.setAttribute('download','download.csv')
    window.document.body.appendChild('a')
    a.click()
    window.document.body.removeChild('a')
  }


  return (

    <View style={styles.container}>
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

      <Button style={styles.center} onPress={addData} title='Add Data' />
      <Text nativeID='element'/>
    {excelData && 

      <Button style={styles.center} onPress={getReport} title='Backup' />
    }

      {/* <CSVLink {...csvReport}>Export to CSV</CSVLink> */}
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
    // console.log('pathToWrite', pathToWrite);
    // // pathToWrite /storage/emulated/0/Download/data.csv
    // RNFetchBlob.fs
    //   .writeFile(pathToWrite, csvString, 'utf8')
    //   .then(() => {
    //     console.log(`wrote file ${pathToWrite}`);
    //     // wrote file /storage/emulated/0/Download/data.csv
    //   })
    //   .catch(error => console.error(error));

    // var wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb,ws,"Prova");
    // const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
    // var file = fs. + '/test.xlsx';
    // writeFile(file, wbout, 'ascii').then((r)=>{/* :) */}).catch((e)=>{/* :( */});


    // console.log('excelData  |'+JSON.stringify(excelData.length))
    // var ws = XLSX.utils.json_to_sheet(excelData);
    // var wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, "file");
    // const wbout = XLSX.write(wb, {
    //   type: 'base64',
    //   bookType: "xlsx"
    // });
    // const uri = FileSystem.cacheDirectory + 'file.xlsx';
    // console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
    // await FileSystem.writeAsStringAsync(uri, wbout, {
    //   encoding: FileSystem.EncodingType.Base64
    // });

    // await Sharing.shareAsync(uri, {
    //   mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   dialogTitle: 'MyWater data',
    //   UTI: 'com.microsoft.excel.xlsx'
    // });