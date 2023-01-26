import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from '../Components/MainNavigation';
import SettingsComp from '../Utils/SettingsComponent'
import LogoutComp from '../Utils/LogoutComponent'

const Drawer = createDrawerNavigator();

export default function HomeStack({ navigation }) {


    return (
        <NavigationContainer>
            <Drawer.Navigator>
            <Drawer.Screen name='Home' header={false} options={{ unmountOnBlur: true, headerTitle: "'"+'App Name'+"'" }} component={MainNavigation} />
            <Drawer.Screen name='Settings' header={false} options={{ unmountOnBlur: true, headerTitle: "'"+'App Name'+"'" }} component={SettingsComp} />
            <Drawer.Screen name='Log Out' header={false} options={{ unmountOnBlur: true, headerTitle: "'"+'App Name'+"'" }} component={LogoutComp} />
            </Drawer.Navigator>

        </NavigationContainer>
    )



}

