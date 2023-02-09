import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image,Text,Linking,TouchableOpacity } from 'react-native';




export default function AboutUsComponent() {

    const to ='bla@gmail.com'
    const subject ='Help Request '
    const body = 'Hello, i have problem with '
    const emailUrl = `mailto:${to}?subject=${subject}&body=${body}`;

    const handelMail = ()=>{
        Linking.openURL(emailUrl)
          .catch(error => console.error('An error occurred', error));
    }

    return (
        <View style={{margin:30}}>
            <Text>
                Thank you for download and use our app.
                to contact us send mail to </Text>
                <TouchableOpacity  onPress={handelMail}>
                <Text style={{color:'blue'}}>bla@gmail.com</Text>
                </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    iconStyle: {
        height: 50,
        width: 50,
    }
});