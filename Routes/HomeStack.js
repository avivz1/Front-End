import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from '../Components/MainNavigation';
import SettingsComp from '../Components/SettingsComponent'
import AboutUsComp from '../Components/AboutUsComponent'
import { useEffect, useState } from 'react'

const Drawer = createDrawerNavigator();

export default function HomeStack({ navigation }) {



  function CustomDrawerLogOut(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          onPress={() => { navigation.replace('Login') }}
        />
      </DrawerContentScrollView>
    );
  }
  // initialParams={{ replace: navigation.actions.replace }}
  // initialParams={navigation!=null && navigation!=undefined?navigation:null}
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <CustomDrawerLogOut {...props} />}>
        {/* <Drawer.Screen name='Home' header={false} options={{ unmountOnBlur: true, headerTitle: 'Teams Management' }} component={MainNavigation} /> */}
        <Drawer.Screen name='Home' header={false} options={{ unmountOnBlur: true, headerTitle: 'Teams Management' }}>
          
          {(props) => <MainNavigation {...props} nav={{ navigation }} />}
        
        </Drawer.Screen>
        <Drawer.Screen name='Settings' header={false} options={{ unmountOnBlur: true, headerTitle: 'Settings' }} component={SettingsComp} />
        <Drawer.Screen name='About Us' header={false} options={{ unmountOnBlur: true, headerTitle: 'About Us' }} component={AboutUsComp} />
      </Drawer.Navigator>

    </NavigationContainer>
  )


}

