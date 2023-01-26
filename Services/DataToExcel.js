import { useEffect,useState } from 'react';
import { PermissionsAndroid } from 'react-native';
import XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { IP } from '../IP_Address';
import * as IntentLauncher from 'expo-intent-launcher';



let data=[]

const excelProcess = async (userId) => {
    await dataForBackup(userId)
    if (Platform.OS === 'ios') {
        tryExcel();
    } else {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message:
                        'Application needs access to your storage to download File',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Start downloading
                console.log('Storage Permission Granted.');
                tryExcel();
            } else {
                // If permission denied then show alert
                Alert.alert('Error', 'Storage Permission Not Granted');
            }
        } catch (err) {
            // To handle permission related exception
            console.log("++++" + err);
        }
    }
};

const dataForBackup = async(userIdValue) => {
    axios.post('http://' + IP + '/login/backupdb', { userId: userIdValue }).then(res => {
        if (res.data != false) {
            data=res.data;
        }
    })
}

const tryExcel = async () => {
    let dataSheet1 = data[0].map(practice => {
        let obj = {
            'Name': practice.Name,
            'Date': practice.Date,
            'Team': practice.Team.Name ? practice.Team.Name : practice.Team.Team_ID,
            'Students': () => {
                let arr = []
                practice.Students.forEach(stu => {
                    arr.push(stu.Name ? stu.Name : stu.Student_ID)
                });
                return arr.toString()
            },

        }
        return obj;
    })
    let dataSheet2 = data[1].map(team => {
        let obj = {
            'Name': team.Name,
            'City': team.City,
            'Created_Date': team.CreatedDate,
            'Type': team.Type,
        }
        return obj;
    })
    let dataSheet3 = data[2].map(stu => {
        let obj = {
            'Name': stu.Name,
            'Age': stu.Age,
            'Belt': stu.Belt,
            'City': stu.City,
            'Created_Date': stu.CreatedDate,
            'Image': stu.Image,
            'Team': stu.Team_ID,
            'Practices': stu.Practices.toString
        }
        return obj;
    })

    var ws = XLSX.utils.json_to_sheet(dataSheet1);
    var ws1 = XLSX.utils.json_to_sheet(dataSheet2);
    var ws2 = XLSX.utils.json_to_sheet(dataSheet3);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Practices");
    XLSX.utils.book_append_sheet(wb, ws1, "Teams");
    XLSX.utils.book_append_sheet(wb, ws2, "Students");
    const wbout = XLSX.write(wb, {
        type: 'base64',
        bookType: "xlsx"
    });
    const uri = FileSystem.cacheDirectory + 'file.xlsx'
    await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64
    });



    await FileSystem.getContentUriAsync(uri).then(cUri => {
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: cUri,
            flags: 1,
        });
    });


}

module.exports = {excelProcess}