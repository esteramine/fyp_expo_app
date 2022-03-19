import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import Calendar from '../components/Calendar';
import EntryList from '../components/EntryList';
import FloatingButton from '../components/FloatingButton';
import TotalPosts from '../components/TotalPosts';

function DiaryScreen({ route, navigation }) {

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <TotalPosts/>
      <Calendar />
      {/* <FloatingButton onAddEntry={() => navigation.navigate('Capture', { next:'AddEntry' })}/> */}
    </View>
  );
};

export default DiaryScreen;