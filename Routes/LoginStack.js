import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import LoginComponent from '../Components/LoginComponent'
import SignUpComponent from '../Components/SignUpComponent'
import HomeStack from './HomeStack';
import ForgotPasswordComponent from '../Components/ForgotPasswordComponent'




const screens = {
    Login: {
        screen: LoginComponent
    },
    SignUp: {
        screen: SignUpComponent,

    },
    ForgotPassword: {
        screen: ForgotPasswordComponent
    },
    Home: {
        screen: HomeStack,
        navigationOptions: {
            headerShown: false,
            gestureEnabled: true,
        }
    }
}

const LoginStack = createStackNavigator(screens);

export default createAppContainer(LoginStack);


