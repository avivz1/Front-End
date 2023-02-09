import { useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';
import XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { IP } from '../IP_Address';
import * as IntentLauncher from 'expo-intent-launcher';


const isInputOk = (arr) => {
    let response = {data:[],status:false}
    

    arr.forEach(input => {
        if (Object.values(input)[0] == '' || Object.values(input)[0] == undefined || Object.values(input)[0] == null) {
            response.data.push(Object.keys(input)[0])
        }
    });
    if(response.data.length>0){
        response.status=false;
    }else{
        response.status=true;
    }
    return response;
}


module.exports = { isInputOk }