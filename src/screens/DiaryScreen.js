import React from 'react';
import { View, Text } from 'react-native';

import Calendar from '../components/Calendar';
import TotalPosts from '../components/TotalPosts';

function DiaryScreen({ route, navigation }) {

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <TotalPosts/>
      <Calendar />
    </View>
  );
};

export default DiaryScreen;