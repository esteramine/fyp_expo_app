import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Styles from '../styles/Styles';

function SearchSettings() {
  return (
    <SafeAreaView style={{ padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>SORTED BY</Text>
    </SafeAreaView>
  );
};

export default SearchSettings;