import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import GalleryScreen from '../screens/GalleryScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import EditPostScreen from '../screens/EditPostScreen';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import CaptureScreen from '../screens/CaptureScreen';

const Stack = createStackNavigator();

function HomeStack({ route, navigation }) {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Capture" component={CaptureScreen} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} />
        <Stack.Screen name="EditPost" component={EditPostScreen} />
        <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;