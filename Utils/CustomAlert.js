import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Overlay from 'react-native-modal-overlay';
import { Button } from 'react-native-paper';




export default CustomAlert = forwardRef((props, ref) => {


    const [isVisible, setIsVisible] = useState(false);
    const [msg, setMsg] = useState(' ')

    useImperativeHandle(ref, () => ({
        focus: () => {
            setIsVisible(true)
        },
        close: () => {
            setIsVisible(false)
        },
        setMsg: (m) => {
            setMsg(m)
        },

    }))




    return (
        <View>
            {props.oneBtn == true ?
                <Overlay style={[styles.container]} visible={isVisible} onClose={() => setIsVisible(false)} >
                    <Image source={require('../assets/info1.png')} style={[styles.iconStyle]} />
                    <Text style={[styles.text]}>{msg}</Text>
                    {props.selfHandle ?
                        <Button color={'green'} onPress={() => setIsVisible(false)}>Ok</Button>
                        :
                        <Button color={'green'} onPress={() => props.callback()}>Ok</Button>
                    }

                </Overlay>
                :
                <Overlay style={[styles.container]} visible={isVisible} onClose={() => setIsVisible(false)} >
                    <Image source={require('../assets/warningIconAlert.png')} style={[styles.iconStyle]} />
                    <Text style={[styles.text]}>{msg}</Text>
                    {props.selfHandle ?
                        <View style={styles.btnsContainer}>
                            <Button color={'red'} onPress={() => setIsVisible(false)}>Cancle</Button>
                            <Button color={'green'} onPress={() => setIsVisible(false)}>Ok</Button>
                        </View>
                        :
                        <View style={styles.btnsContainer}>
                            <Button color={'red'} onPress={() => setIsVisible(false)}>Cancle</Button>
                            <Button color={'green'} onPress={() => props.callback()}>Ok</Button>
                        </View>
                    }
                </Overlay>
            }

        </View>
    )
})


const styles = StyleSheet.create({
    container: {
        margin: 0,
    },
    iconStyle: {
        height: 50,
        width: 50,
        margin: 10
    },
    text: {
        fontSize: 20,
    },
    btnsContainer: {
        flexDirection: 'row'
    }

});