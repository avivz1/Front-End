import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import LoginComponent from '../Components/LoginComponent'
import SignUpComponent from '../Components/SignUpComponent'
import HomeStack from './HomeStack';




const screens = {
   Login : {
       screen: LoginComponent
   },
   SignUp : {
    screen : SignUpComponent
    },
    Home : {
        screen : HomeStack,
        navigationOptions:{
            headerShown: false,
        }
   }
}

const LoginStack = createStackNavigator(screens);

export default createAppContainer(LoginStack);


