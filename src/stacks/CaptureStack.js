import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Camera from '../components/Camera';
import CameraPreview from '../components/CameraPreview';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import AddEntryScreen from '../screens/AddEntryScreen';

const Stack = createStackNavigator();

export default function CaptureStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name="CameraPreview" component={CameraPreview} />
            <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
            <Stack.Screen name="AddEntry" component={AddEntryScreen} />
        </Stack.Navigator>
    );
}