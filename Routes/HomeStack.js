import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from '../Components/MainNavigation';



const Drawer = createDrawerNavigator();

export default function HomeStack({ navigation }) {


    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name='Home' header={false} options={{ unmountOnBlur: true, headerTitle: '' }} component={MainNavigation} />
            </Drawer.Navigator>

        </NavigationContainer>
    )



}

