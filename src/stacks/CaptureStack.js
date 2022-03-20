import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Camera from '../components/Camera';
import CameraPreview from '../components/CameraPreview';

const Stack = createStackNavigator();

export default function ExpoCaptureScreen() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name="CameraPreview" component={CameraPreview} />
            
        </Stack.Navigator>
    );
}