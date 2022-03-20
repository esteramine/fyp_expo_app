import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Calendar from '../components/Calendar';
import TotalPosts from '../components/TotalPosts';

function DiaryScreen({ route, navigation }) {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TotalPosts/>
      <Calendar />
    </SafeAreaView>
  );
};

export default DiaryScreen;