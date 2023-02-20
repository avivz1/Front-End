import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Keyboard } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';




export default function BeltsPickerComponent(props) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(props.data ? props.data : null);
    const [items, setItems] = useState([
        { label: 'White', value: 'white', icon: () => <Image source={require('../assets/white.png')} style={[styles.iconStyle]} /> },
        { label: 'Yellow', value: 'yellow', icon: () => <Image source={require('../assets/yellow.png')} style={[styles.iconStyle]} /> },
        { label: 'Orange', value: 'orange', icon: () => <Image source={require('../assets/orange.png')} style={[styles.iconStyle]} /> },
        { label: 'Green', value: 'green', icon: () => <Image source={require('../assets/green.png')} style={[styles.iconStyle]} /> },
        { label: 'Blue', value: 'blue', icon: () => <Image source={require('../assets/blue.png')} style={[styles.iconStyle]} /> },
        { label: 'Brown', value: 'brown', icon: () => <Image source={require('../assets/brown.png')} style={[styles.iconStyle]} /> },
        { label: 'Black', value: 'black', icon: () => <Image source={require('../assets/black.png')} style={[styles.iconStyle]} /> },
    ]);

    const setBelt = (beltColor) => {
        props.callback(beltColor)
    }

    const setOpenDropDown = (x) => {
        Keyboard.dismiss()
        setOpen(x)
    }



    return (
        <View>

            <DropDownPicker
                placeholder='Select Belt'
                open={open}
                value={value}
                items={items}
                setOpen={(x) => setOpenDropDown(x)}
                setValue={setValue}
                setItems={setItems}
                onChangeValue={setBelt}

            />

        </View>
    )
}

const styles = StyleSheet.create({
    iconStyle: {
        height: 50,
        width: 50,
    }
});