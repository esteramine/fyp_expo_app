import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppName, KeyNotExistError, LocalUploads, Progressbar } from './Constants';

export default class UserStorage {
    async storeData(key, data) {
        try {
            await AsyncStorage.setItem(
                '@' + AppName + ':' + key,
                data
            );
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    };

    async retrieveData(key) {
        try {
            const value = await AsyncStorage.getItem('@' + AppName + ':' + key);
            if (value !== null) {
                // console.log(value);
                return value;
            }
            else {
                return KeyNotExistError;
            }
        } catch (error) {
            // Error retrieving data
            console.log('Fetch data failed!');
            return 'error';
        }
    };

    async removeData(key) {
        try {
            await AsyncStorage.removeItem('@' + AppName + ':' + key);
            return true;
        }
        catch(exception) {
            return false;
        }
    };

    async appendEntry(key, object) { // data is not stringified
        const response = await this.retrieveData(key);
        if (response != KeyNotExistError) {
            const newList = JSON.parse(response)
            newList.push(object);
            try {
                await AsyncStorage.setItem(
                    '@' + AppName + ':' + key,
                    JSON.stringify(newList)
                );
            } catch (error) {
                // Error saving data
                console.log(error);
            }
        }
        else {
            this.storeData(key, JSON.stringify([object]));
        }


    };

    async addProgress() {
        const response = await this.retrieveData(Progressbar.key);
        if (response == KeyNotExistError) {
            this.storeData(Progressbar.key, JSON.stringify(Progressbar.startValue + Progressbar.increment));
        }
        else {
            console.log('add progress')
            const progress = JSON.parse(response);
            this.storeData(Progressbar.key, JSON.stringify(progress + Progressbar.increment));
        }

    }

    async clearProgress() {
        this.storeData(Progressbar.key, JSON.stringify(Progressbar.startValue));
    }

    async retrieveOneDayData(year, month, date) {
        try {
            const keyString = year + '-' + month + '-' + date;
            const result = await this.retrieveData(keyString);
            return result == KeyNotExistError? KeyNotExistError: JSON.parse(result);
            
            // let keyArray = [];
            // const keys = await AsyncStorage.getAllKeys();
            // for (key in keys) {
            //     const dateArray = key.split(':')[1].split('-');
            //     const getYear = dateArray[0]
            //     const getMonth = dateArray[1];
            //     if (getYear == year && getMonth == month) {
            //         keyArray.push(key);
            //     }
            // }
            // const result = await AsyncStorage.multiGet(keyArray);

            // return result.map(req => JSON.parse(req)).forEach(console.log);
        } catch (error) {
            console.error(error)
        }
    };

    async clearLocalStorage() {
        AsyncStorage.clear();
    }

    async addLocalUpload() {
        // users can upload records without login before retrieve a reward
        // if users want to write review, then directly go to register/login
        const retrievedData = await this.retrieveData(LocalUploads);
        if (retrievedData == KeyNotExistError) {
            await this.storeData(LocalUploads, toString(1));
        }
        else {
            await this.storeData(LocalUploads, toString(parseInt(retrievedData)+1));
        }
    };
}