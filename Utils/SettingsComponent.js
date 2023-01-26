import { useState, useEffect } from 'react';
import { StyleSheet, View, Image,Text } from 'react-native';




export default function SettingsComponent(props) {

    const [value, setValue] = useState('')
  

    return (
        <View style={{margin:20}}>

            <Text style={{fontWeight:'bold',fontSize:22}}>Profile</Text>

        </View>
    )
}

const styles = StyleSheet.create({
});