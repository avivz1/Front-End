
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../ContextAPI/Context';
import { useEffect, useState, useContext, useRef } from 'react';

const jwtService = () => {

    const { userId, teamsMap, token, route } = useContext(Context);
    const [contextToken, setToken] = token


    const getToken = async () => {
        let token;
        try {
            token = await AsyncStorage.getItem('jwt')
            return token;
        } catch (e) {
            return Promise.reject('error')
        }
    }

    const saveToken = async (_token) => {
        try {
             AsyncStorage.setItem('jwt', _token).then(()=>setToken(_token))
        } catch (e) {
            return Promise.reject('error')
        }
    }

    const deleteToken = async () => {
        try {
            await AsyncStorage.removeItem('jwt')
            await setToken(null)
            return ;
        } catch (e) {
            return Promise.reject('error')
        }
    }
    return { getToken, saveToken, deleteToken }
}

export default jwtService
