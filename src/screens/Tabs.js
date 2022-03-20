import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DiaryScreen from './DiaryScreen';
import SettingsScreen from './SettingsScreen';
// import CaptureScreen from './CaptureScreen';
import { Color } from '../utils/Constants';
import HomeStack from '../stacks/HomeStack';
import RegisterScreen from './RegisterScreen';
import ExpoCaptureScreen from './ExpoCaptureScreen';

const Tab = createBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused? 'home' : 'home-outline';
                    }
                    else if (route.name === 'Diary') {
                        iconName = focused ? 'book' : 'book-outline';
                    }
                    else if (route.name === 'Capture') {
                        iconName = focused ? 'add' : 'add-outline';
                    }
                    else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: Color.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarShowLabel: false,
                headerShown: false
            })}
        >
            {/* <Tab.Screen name="Home" component={HomeStack} options={{unmountOnBlur: true}} />
            <Tab.Screen name="Diary" component={DiaryScreen} />
            <Tab.Screen name="Capture" component={CaptureScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} /> */}
            <Tab.Screen name="Home" component={HomeStack} options={{unmountOnBlur: true}} />
            <Tab.Screen name="Diary" component={DiaryScreen} />
            <Tab.Screen name="Capture" component={ExpoCaptureScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

export default Tabs;