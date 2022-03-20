import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput,ScrollView } from 'react-native';
import AddPracticeComponent from './AddPracticeComponent'
import EditPracticeComponent from './EditPracticeComponent'
import PracticeCardComponent from './PracticeCardComponent'
import PracticeDetailsComponent from './PracticeDetailsComponent'
import { Context } from '../../ContextAPI/Context';
import { IP } from '../../IP_Address';
import Overlay from 'react-native-modal-overlay';
import { Card, FAB, Searchbar } from 'react-native-paper'



export default function ViewPracticesComponent() {

  const [allPractices, setPractices] = React.useState(false);
  const [pickedPractice, setPickedPractice ] =React.useState({})
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [editVisible, setEditVisible] = React.useState(false);
  const [addVisible, setAddVisible] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const onChangeSearch = query => setSearchText(query)


  useEffect(async () => {

  }, [])

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
    //get all practices
    setEditVisible(false);
  }

  const closeAddModal = () => {
    //get all practices
    setAddVisible(false);
  }

  const practiceCardPress = (practice, btnType) => {
    setPickedPractice(practice)
    switch (btnType) {
        case 'detailsBtn': setDetailsVisible(true)
            break;
        case 'editBtn': setEditVisible(true)
            break;
        case 'removeBtn': //alert
          break;
    }
  }

  return (

    <View style={[styles.container]}>

      <Overlay visible={isVisible() ? true : false} onClose={onCloseModal} closeOnTouchOutside>
        {editVisible && <EditPracticeComponent onPracticeUpdate={closeEditModal} practice={pickedPractice ? pickedPractice : ''} />}
        {detailsVisible && <PracticeDetailsComponent practice={pickedPractice ? pickedPractice : ''} />}
        {addVisible && <AddPracticeComponent onAddPractice={closeAddModal} />}
      </Overlay>


      <Searchbar placeholder='Search' onChangeText={onChangeSearch} value={searchText} />
      <ScrollView>
        <View style={[styles.container]}>

          {allPractices.length > 0 ? allPractices.map((practice, index) => {
            return (
              <View key={index}>
                {
                  practice.Name.includes(searchText) &&
                  <TeamCardComoponent key={index} callBack={practiceCardPress} practice={practice} />
                }
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
    backgroundColor: '#ffffff'
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
