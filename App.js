import * as React from 'react';
import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import UserStorage from './src/utils/UserStorage';
import { KeyNotExistError, TOKEN } from './src/utils/Constants';

const httpLink = createHttpLink({
    uri: 'https://huatm1fypserver.herokuapp.com/',
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
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default function App() {
    return (
        <ApolloProvider client={client}>
            <Text>Hi</Text>
        </ApolloProvider>
    );
}
