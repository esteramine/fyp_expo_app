import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DiaryScreen from '../screens/DiaryScreen';
import EditPostScreen from '../screens/EditPostScreen';
import PostDetailScreen from '../screens/YNPostDetailScreen';

const Stack = createStackNavigator();

export default function DiaryStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={DiaryScreen} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} />
            <Stack.Screen name="EditPost" component={EditPostScreen} />
        </Stack.Navigator>
    );
}