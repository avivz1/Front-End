import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image,Text } from 'react-native';




export default function AboutUsComponent() {




    return (
        <View style={{margin:30}}>
            <Text>
                Thank you for download and use our app.
                to contact us send mail to - bla@gmail.com
            </Text>

        </View>
    )
}

const styles = StyleSheet.create({
    iconStyle: {
        height: 50,
        width: 50,
    }
});