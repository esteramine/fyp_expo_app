import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';

export const getCurrentDate = () => {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const monthDateString = (month < 10 ? ('0' + month) : month) + '-' + (date < 10 ? ('0' + date) : date);
    return year + '-' + monthDateString;
}

export const generateRNFile = (uri, name) => {
    return uri ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || 'image',
        name,
    }) : null;
};

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};