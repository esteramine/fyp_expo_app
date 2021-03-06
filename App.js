import * as React from 'react';
import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import UserStorage from './src/utils/UserStorage';
import { KeyNotExistError, TOKEN } from './src/utils/Constants';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider } from './src/context/auth';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import Tabs from './src/screens/Tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { createUploadLink } from 'apollo-upload-client';

// const uri = 'https://huatm1fypserver.herokuapp.com/';
// const uri = 'http://10.89.6.175:5000/graphql';
const uri = 'http://3.80.188.56:5000/graphql';

const httpLink = createHttpLink({
  uri,
  // uri: 'http://10.89.6.175:5000'
});

const authLink = setContext(async () => {
  const storage = new UserStorage();
  const token = await storage.retrieveData(TOKEN);
  return {
    headers: {
      Authorization: token === KeyNotExistError ? '' : `Bearer ${token}`
      // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjUwNzQyOTNkZjVmMWY1YmRiYjBlNyIsInVzZXJuYW1lIjoicXdlcnQiLCJpYXQiOjE2NDQzNzg3MTB9.iaqJyiM39TISpVvjowiv9l0_R20O1ArcPX9SDW_9oio`
    }
  }
})

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    createUploadLink({ uri: uri }),
  ]),
  
  cache: new InMemoryCache()
});

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <ActionSheetProvider>
              <AuthContext.Consumer>
                {({ user }) => {
                  console.log(user)
                  return (
                    <>
                      {user ? (
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                          <Stack.Screen name="Tabs" component={Tabs} />
                          {/* <Stack.Screen name="AddEntry" component={} />
                          <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} /> */}
                          {/* <Stack.Screen name="PostDetail" component={PostDetailScreen} />
                          <Stack.Screen name="EditPost" component={EditPostScreen} /> */}
                        </Stack.Navigator>
                      ) : (
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                          <Stack.Screen name='Login' component={LoginScreen} />
                          <Stack.Screen name="Register" component={RegisterScreen} />
                        </Stack.Navigator>
                      )}
                    </>
                  )
                }}
              </AuthContext.Consumer>
            </ActionSheetProvider>

          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
