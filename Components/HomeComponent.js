import { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, ScrollView } from 'react-native';
import { Context } from '../ContextAPI/Context';
import { IP } from '../IP_Address';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { ActivityIndicator, Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../Utils/CustomAlert'
import jwtService from '../Services/JwtAuth'


export default function HomeComponent(navigation) {


  const { userId, teamsMap, token, route } = useContext(Context);
  const [getRoute, setRoute] = route;
  const [contextToken, setToken] = token
  const [userIdValue] = userId;
  const { getToken, saveToken, deleteToken } = jwtService()
  const [teamsPieData, setTeamsPieData] = useState([])
  const [practicePieData, setPracticePieData] = useState([])
  const [barChartData, setBarChartData] = useState([])
  const [beltsPieData, setBeltsPieData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAlertSelfHandle, setIsAlertSelfHandle] = useState(false)

  const redColors = ['rgb(179, 0, 0)', 'rgb(230, 0, 0)', 'rgb(255, 0, 0)', 'rgb(255, 51, 51)', 'rgb(255, 102, 102)', 'rgb(255, 153, 153)']
  const blueColors = ['rgb(0, 0, 80)', 'rgb(0, 0, 153)', 'rgb(0, 0, 255)', 'rgb(128, 128, 255)', 'rgb(204, 204, 255)']
  const screenWidth = Dimensions.get("window").width;
  const alertRef = useRef();


  useEffect(() => {
    // console.log(contextToken,getToken())
    // getDistributionByTeam().then(() => getTotalDivision().then(() => getBeltsAverage().then(() => getTotalDivisionByMonth())))
    if(contextToken){
      getDistributionByTeam().then(()=>getTotalDivision())
    }
  }, [contextToken])

  useEffect(() => {
    if ((getRoute != undefined && getRoute != null) && contextToken == undefined) {
      getRoute?.replace('Login')
    }

  }, [getRoute])

  useEffect(() => {
    if (barChartData.length > 0 && teamsPieData && practicePieData && beltsPieData) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [barChartData, teamsPieData, practicePieData, beltsPieData])


  const dataBarPie = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: barChartData,
        color: (opacity = 1) => `rgba(200, 0, 0, ${opacity})`, // optional
      }
    ],
  };

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

  const getBeltsAverage = async () => {

    AsyncStorage.getItem('jwt').then((token => {

      axios.post('http://' + IP + '/students/getBeltsAverage', { userId: userIdValue }, { headers: { Authorization: `Bearer ${token}` } }).then(response => {
        if (response.data.success == true) {

          if (response.data.data.length > 0) {
            let arr = []
            response.data.data.forEach((colorObj, i) => {
              if (colorObj[1] != 0) {
                let obj = {
                  name: '% ' + colorObj[0],
                  population: Math.trunc(colorObj[1]),
                  color: colorObj[0],
                  legendFontSize: 15,
                  legendFontColor: "#7F7F7F",
                }
                arr.push(obj)
              }
            });
            setBeltsPieData(arr)
          }
        } else {
          alertRef.current.setMsg('error fetch data - beltsAvg')
          setIsAlertSelfHandle(true)
          alertRef.current.focus()
        }

      }).catch((e) => {
        alertRef.current.setMsg('error fetch data - beltsAvg')
        setIsAlertSelfHandle(true)
        alertRef.current.focus()
      })
    }))
  }

  const getTotalDivisionByMonth = async () => {
    if (contextToken) {
      let res = await axios.post('http://' + IP + '/practices/getTotalDivisionByMonth', { userId: userIdValue }, { headers: { Authorization: `Bearer ${token}` } })
        .catch((error) => {
          // console.log(error.response)
        })


      //if there is not token 
    } else {
      getRoute?.replace('Login')

    }

    AsyncStorage.getItem('jwt').then((token => {
      axios.post('http://' + IP + '/practices/getTotalDivisionByMonth', { userId: userIdValue }, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
        if (res.data.success == true) {
          setBarChartData(res.data.data)
        } else {
          alertRef.current.setMsg('error fetch data - divisionByMonth')
          alertRef.current.focus()
        }
      }).catch((e) => {
        alertRef.current.setMsg('error fetch data - divisionByMonth')
        alertRef.current.focus()
      })
    }))
  }


  const getDistributionByTeam = async () => {
      let res = await axios.get('http://' + IP + '/teams/getdistributionbyTeam', { headers: { Authorization: `Bearer ${contextToken}` } })
        .catch(async (error) => {
          if (error.response.status == 401 || error.response.status == 403) {
            handleDeleteTokenLogOut()
          }
          if (error.response.status == 500) {
              handleErrorFromRequest()
          }
        })

      if (res != undefined && res!=null) {
        if (res.data.success == true) {
          let data = res.data.data
          let isOnlyOneTeamWithoutStudents = data.length == 1 && data[0].studQuantity == 0;
          let arr = [];
          if (isOnlyOneTeamWithoutStudents) {
            setTeamsPieData([])
          } else {
            if (data.length > 0) {
              data.forEach((data, i) => {
                let obj = {
                  name: "%  " + data.name,
                  population: Math.trunc(data.studQuantity),
                  color: blueColors[i],
                  legendFontSize: 15,
                  legendFontColor: "#7F7F7F",
                }
                arr.push(obj)
              });
              setTeamsPieData(arr)
            }
          }
        }
      }
  }

  const getTotalDivision = async () => {
      let res = await axios.post('http://' + IP + '/practices/getTotalDivision', { userId: userIdValue }, { headers: { Authorization: `Bearer ${contextToken}` } })
        .catch((error) => {
          if (error.response.status == 401 || error.response.status == 403) {
            handleDeleteTokenLogOut()
          }
          if (error.response.status == 500) {
              handleErrorFromRequest()
          }
        })
        if(res!=undefined && res!=null){
        let arr1 = [];

      if (res.data.success == true) {
        if (res.data.data.present == 0 && res.data.data.notPresent == 0 && res.data.data.total == 0) {
          setPracticePieData(arr1);
        } else {

          let obj = {
            name: '%  Present',
            population: Math.trunc((res.data.data.present / res.data.data.total) * 100),
            color: 'rgb(0, 150, 0)',
            legendFontSize: 15,
            legendFontColor: "#7F7F7F",
          }
          let obj1 = {
            name: '%  Not Present',
            population: Math.trunc((res.data.data.notPresent / res.data.data.total) * 100),
            color: 'rgb(180, 0, 0)',
            legendFontSize: 15,
            legendFontColor: "#7F7F7F",
          }
          arr1.push(obj)
          arr1.push(obj1)
          setPracticePieData(arr1)
        }

      } else {
        alertRef.current.setMsg(res.data.message)
        setIsAlertSelfHandle(true)
        alertRef.current.focus()
      }
    }


  }

  const handleErrorFromRequest = ()=>{
    if (alertRef.current != null && alertRef.current != undefined) {
      alertRef.current.setMsg('error fetch data - try refresh')
      setIsAlertSelfHandle(true)
      alertRef.current.focus()
    }
  }

  const handleDeleteTokenLogOut = () => {
    deleteToken().then(() => getRoute?.replace('Login'))
      //if problem try to delete again
      .catch(async () => {
        await AsyncStorage.removeItem('jwt')
        await setToken(null)
        getRoute?.replace('Login')
      })

  }

  const eventFromAlert = () => {
    getRoute?.replace('Login')

  }


  return (

    <View style={styles.container}>
      <CustomAlert oneBtn={true} selfHandle={isAlertSelfHandle} ref={alertRef} callback={eventFromAlert} />

      {isLoading ? <ActivityIndicator type={'large'} animating={true} color={Colors.red800} />
        :
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


        </ScrollView>
      }

    </View>

  )



}


const styles = StyleSheet.create({
  container: {
    // alignSelf: 'center',
    // flex: 0,
    backgroundColor: '#fff',
    // alignItems: 'center',
    fontSize: 10,
  }
})







            // deleteToken().then(() => getRoute?.replace('Login'))
            //   .catch(async () => {
            //     await AsyncStorage.removeItem('jwt')
            //     getRoute?.replace('Login')
            //   })













            

    // AsyncStorage.getItem('jwt').then((token => {
    //   axios.post('http://' + IP + '/practices/getTotalDivision', { userId: userIdValue }, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
        // let arr1 = [];
    //     if (res.data.success == true) {
    //       if (res.data.data.present == 0 && res.data.data.notPresent == 0 && res.data.data.total == 0) {
    //         setPracticePieData(arr1);
    //       } else {

    //         let obj = {
    //           name: '%  Present',
    //           population: Math.trunc((res.data.data.present / res.data.data.total) * 100),
    //           color: 'rgb(0, 150, 0)',
    //           legendFontSize: 15,
    //           legendFontColor: "#7F7F7F",
    //         }
    //         let obj1 = {
    //           name: '%  Not Present',
    //           population: Math.trunc((res.data.data.notPresent / res.data.data.total) * 100),
    //           color: 'rgb(180, 0, 0)',
    //           legendFontSize: 15,
    //           legendFontColor: "#7F7F7F",
    //         }
    //         arr1.push(obj)
    //         arr1.push(obj1)
    //         setPracticePieData(arr1)
    //       }
    //     } else {
    //       alertRef.current.setMsg(res.data.message)
    //       alertRef.current.focus()
    //     }
    //   }).catch((e) => {
    //     alertRef.current.setMsg('error fetch data - totalDevision')
    //     alertRef.current.focus()

    //   })
    // }))