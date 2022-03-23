import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/auth';
import { Color } from '../utils/Constants';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import TotalPosts from '../components/TotalPosts';

function SettingsScreen() {
  const context = useContext(AuthContext);
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: 'whitesmoke' }}>
      <View style={{ width: '100%', backgroundColor: 'white' }}>
        <TotalPosts />
        <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: Color.gray300, borderTopWidth: 1, borderBottomWidth: 1, padding: 20 }}>
          <EvilIcons name='user' size={100} color={Color.gray900} />
          <Text style={{ color: Color.gray900, fontSize: 25, marginLeft: 10 }}>{context.user.username}</Text>
        </View>
        <Button mode="contained" onPress={context.logout} color={Color.green300} style={{ padding: 5 }}>
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;