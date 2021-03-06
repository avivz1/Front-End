import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Alert, ScrollView, BackHandler, Image, TouchableOpacity } from 'react-native';
import AddPracticeComponent from './AddPracticeComponent'
import EditPracticeComponent from './EditPracticeComponent'
import PracticeCardComponent from './PracticeCardComponent'
import PracticeDetailsComponent from './PracticeDetailsComponent'
import { Context } from '../../ContextAPI/Context';
import { IP } from '../../IP_Address';
import Overlay from 'react-native-modal-overlay';
import { Card, FAB, Searchbar, RadioButton } from 'react-native-paper'
import { useDispatch } from 'react-redux'



export default function ViewPracticesComponent() {

  const { userId, teamsMap } = useContext(Context);
  const [userIdValue] = userId;
  const [teamsNameMap, setMap] = teamsMap


  const [studentsArr, setStudents] = useState([]);
  const [allTeams, setTeams] = useState([]);
  const [allPractices, setPractices] = useState(false);
  const [pickedPractice, setPickedPractice] = useState({});
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isRadioBtnShow, setIsRadioBtnShow] = useState(false);
  const [isRadioBtnON, setIsRadioBtnON] = useState(false);
  const [isUserPressRemoveAll, setIsUserPressRemoveAll] = useState(false);
  const [practicesCheckedStatus, setPracticesCheckedStatus] = useState([]);

  const onChangeSearch = query => setSearchText(query)


  useEffect(() => {
    getAllPractices()
    getAllStudents()
    getAllTeams()
  }, [])

  useEffect(() => {
    if (practicesCheckedStatus.length == allPractices.length && !isUserPressRemoveAll) {
      setIsRadioBtnON(true);
    }
  }, [practicesCheckedStatus])

  const getAllStudents = () => {
    axios.post('http://' + IP + '/students/getallstudentsbyuserid', { userid: userIdValue }).then(res => {
      if (res.data) {
        setStudents(res.data)
      } else {
        //Toast there was a problem
      }
    })

  }

  const getAllTeams = () => {
    axios.post('http://' + IP + '/teams/getalluserteams', { userID: userIdValue }).then(res => {
      if (res.data) {
        setTeams(res.data)
        res.data.forEach(team => {
          setMap(teamsNameMap.set(team._id, team.Name))
        });
      } else {
        //Toast there was a problem

      }
    })
  }

  const getAllPractices = () => {
    axios.post('http://' + IP + '/practices/getallpractices', { userID: userIdValue }).then(res => {
        setPractices(res.data)
    })
  }

  const isVisible = () => {
    if (editVisible || detailsVisible || addVisible) {
      return true;
    } else {
      return false;
    }
  }

  const openAddModal = () => {
    setAddVisible(true);
  }

  const onCloseModal = () => {
    if (detailsVisible) {
      setDetailsVisible(false)
    }
    if (editVisible) {
      setEditVisible(false);
    }
    if (addVisible) {
      setAddVisible(false)
    }

  }

  const closeEditModal = () => {
    getAllPractices()
    setEditVisible(false);
  }

  const closeAddModal = () => {
    getAllPractices()
    setAddVisible(false);
  }

  const practiceCardPress = (practiceObj, btnType) => {
    setPickedPractice(practiceObj)
    switch (btnType) {
      case 'detailsBtn': setDetailsVisible(true)
        break;
      case 'editBtn': setEditVisible(true)
        break;
      case 'removeBtn': Alert.alert('Warning', 'Are you sure you want to delete this practice? ' + '\n' + practiceObj.Name + '\n', [
        { text: 'Cancel' },
        {
          text: 'Yes', onPress: () => {
            axios.post('http://' + IP + '/practices/deletepractice', { practice: practiceObj }).then((res => {
              if (res.data) {
                getAllPractices()
                Alert.alert('Practice has been deleted');
              } else {
                Alert.alert('There was a problem. try again')
              }
            }))
          }
        }
      ])
        break;
    }
  }

  BackHandler.addEventListener('hardwareBackPress', () => {
    console.log('index')
    if (isRadioBtnShow == true) {
      setIsRadioBtnShow(false)
      setIsRadioBtnON(false)
      setIsUserPressRemoveAll(true);
      return true;
    } else if (isRadioBtnShow == false) {
      BackHandler.exitApp();
      // return false;
    }
  })

  const onChildCardLongPress = () => {
    setIsRadioBtnShow(true)
  }


  const checkOrUncheckPractice = (status, id) => {

    setIsUserPressRemoveAll(false);
    if (!status) {
      setIsRadioBtnON(false);
      let state = practicesCheckedStatus.filter(x => x != id)
      setPracticesCheckedStatus(state)
    } else {

      if (!practicesCheckedStatus.includes(id)) {
        setPracticesCheckedStatus(practicesCheckedStatus => [...practicesCheckedStatus, id]);
      }


    }

  }

  const onRadionBtnPresses = () => {

    if (isRadioBtnON) {
      let arr = allPractices.map(practice => practice._id);
      setPracticesCheckedStatus(arr);
    } else {
      let arr2 = []
      setPracticesCheckedStatus(arr2);
    }

    setIsRadioBtnON(!isRadioBtnON)
    setIsUserPressRemoveAll(true)
  }

  const removeFewPractices = () => {

    axios.post('http://' + IP + '/practices/removeFewPractices', { userID: userIdValue, practices: practicesCheckedStatus }).then(res => {
      if (res.data==true) {
        axios.post('http://' + IP + '/practices/getallpractices', { userID: userIdValue }).then(res1 => {
            setPractices(res1.data)
            setIsRadioBtnShow(false)
            setIsRadioBtnON(false)
            setIsUserPressRemoveAll(false);
            setPracticesCheckedStatus([])
        })
      }

    })
  }

  return (
    <View style={[styles.container]}>

      <Overlay visible={isVisible() ? true : false} onClose={onCloseModal} closeOnTouchOutside>
        {editVisible && <EditPracticeComponent onPracticeUpdate={closeEditModal} allTeams={allTeams} allStudents={studentsArr} practice={pickedPractice ? pickedPractice : ''} />}
        {detailsVisible && <PracticeDetailsComponent practice={pickedPractice ? pickedPractice : ''} />}
        {addVisible && <AddPracticeComponent teams={allTeams} students={studentsArr} onAddPractice={closeAddModal} />}
      </Overlay>


      <Searchbar placeholder='Search' onChangeText={onChangeSearch} value={searchText} />
      {isRadioBtnShow &&
        <RadioButton
          value="mainRadioBtn"
          status={isRadioBtnON ? 'checked' : 'unchecked'}
          onPress={() => onRadionBtnPresses()}
        />
      }
      {isRadioBtnShow && <TouchableOpacity onPress={removeFewPractices}><Image style={{ width: 20, height: 30, margin: 7 }}  source={require('../../assets/garbageIcon.png')} ></Image></TouchableOpacity>}

      <ScrollView>
        <View style={[styles.container]}>
          {allPractices.length > 0 ? allPractices.map((practice, index) => {
            return (
              <View key={index}>
                {
                  practice.Name.includes(searchText) &&
                  <PracticeCardComponent checkUnCheckPractice={checkOrUncheckPractice} isUserRemoveAll={isUserPressRemoveAll} isRadioBtnON={isRadioBtnON} isRadioBtnShow={isRadioBtnShow} key={index} onLongPress={onChildCardLongPress} callBack={practiceCardPress} practice={practice} />
                }
                {/* {deleteAllFlag ?
                  practice.Name.includes(searchText) && <PracticeCardComponent isRemoveAll={deleteAllFlag} key={index} onLongPress={onChildCardLongPress} callBack={practiceCardPress} practice={practice} />
                  :
                  <PracticeCardComponent isRemoveAll={deleteAllFlag} key={index} onLongPress={onChildCardLongPress} callBack={practiceCardPress} practice={practice} />
                } */}

              </View>
            )
          }) : <Text>No Practices</Text>}
        </View>

      </ScrollView>

      <FAB
        style={{ margin: 16, position: 'absolute', right: 0, bottom: 0 }}
        big
        icon='plus'
        onPress={openAddModal}
      />

    </View>
  )


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    justifyContent: "center",

  },
  HeadStyle: {
    height: 50,
    alignContent: "center",
    backgroundColor: '#CE39FE'
  },
  TableText: {
    margin: 8,
    height: 49,
    alignContent: "center",
    alignItems: 'center',
  }
})
