import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/auth';
import { Color } from '../utils/Constants';

function SettingsScreen() {
  const context = useContext(AuthContext);
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'whitesmoke' }}>
      <Button mode="contained" onPress={context.logout} color={Color.green500}>
        Logout
      </Button>
    </SafeAreaView>
  );
};

export default SettingsScreen;