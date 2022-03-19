import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Color } from '../utils/Constants';

function CircularProgress() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={"large"} color={Color.green900} />
        </View>
    )
}

export default CircularProgress;