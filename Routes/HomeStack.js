import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList,DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from '../Components/MainNavigation';
import SettingsComp from '../Components/SettingsComponent'
import LogoutComp from '../Components/LogoutComponent'
import AboutUsComp from '../Components/AboutUsComponent'

const Drawer = createDrawerNavigator();

export default function HomeStack({ navigation }) {

  function CustomDrawerLogOut(props) {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Logout"
            onPress={() => {navigation.replace('Login')}}
          />
        </DrawerContentScrollView>
      );
    }

    return (
        <NavigationContainer>
            <Drawer.Navigator drawerContent={props=> <CustomDrawerLogOut {...props}/>}>
            <Drawer.Screen name='Home' header={false} options={{ unmountOnBlur: true, headerTitle: "'"+'App Name'+"'" }} component={MainNavigation} />
            <Drawer.Screen name='Settings' header={false} options={{ unmountOnBlur: true, headerTitle: "'"+'App Name'+"'" }} component={SettingsComp} />
            <Drawer.Screen name='About Us' header={false} options={{ unmountOnBlur: true, headerTitle: "'"+'App Name'+"'" }} component={AboutUsComp} />
            {/* <Drawer.Screen name='Log Out' header={false} options={{ unmountOnBlur: true, headerTitle: "'"+'App Name'+"'" }} component={LogoutComp} /> */}
            </Drawer.Navigator>

        </NavigationContainer>
    )


}

