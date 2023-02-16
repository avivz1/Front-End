




import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';




export default function SecurityQuestionPicker(props) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(props.data ? props.data : null);
    const [items, setItems] = useState([
        { label: 'What is your first School?', value: 'What is your first School?' },
        { label: 'What is your first dog name?', value: 'What is your first dog name?' },
        { label: 'What the name of street you grow up?', value: 'What the name of street you grow up?' },
    ]);
    useEffect(() => {
        if(props.data){
            setValue(props.data)
        }
    }, [props])

    const setSecurity = (question) => {
        props.callback(question)
    }

    return (
        <View>

            <DropDownPicker
                placeholder='Select Security Question'
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                onChangeValue={setSecurity}

            />

        </View>
    )
}
