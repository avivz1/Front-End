import { BottomNavigation } from 'react-native-paper'
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { Context } from '../ContextAPI/Context';
import { IP } from '../IP_Address';
import HomeComponent from './HomeComponent'
import StudentsComponent from './StudentsComponent/ViewStudentsComponent'
import TeamsComponent from './TeamsComponents/ViewTeamsComponent'
import PracticesComponent from './PracticesComponents/ViewPracticesComponent'

export default function MainNavigation() {

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'Home', title: 'Home', icon: 'home' },
        { key: 'Students', title: 'Students', icon: { uri: 'https://icon-library.com/images/883925-200.png' } },
        { key: 'Teams', title: 'Teams', icon: { uri: 'https://cdn-icons-png.flaticon.com/512/75/75781.png' } },
        { key: 'Practices', title: 'Practices', icon: { uri: 'https://icon-library.com/images/judo-icon/judo-icon-5.jpg' } },
    ])

    const HomeRoute = () => <HomeComponent />
    const StudentsRoute = () => <StudentsComponent />
    const TeamsRoute = () => <TeamsComponent />
    const PracticesRoute = () => <PracticesComponent />

    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'Home': return <HomeRoute jumpTo={jumpTo} />;
            case 'Students': return <StudentsRoute jumpTo={jumpTo} />;
            case 'Teams': return <TeamsRoute jumpTo={jumpTo} />;
            case 'Practices': return <PracticesRoute jumpTo={jumpTo} />;
        }
    }


    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene} />

    )

}