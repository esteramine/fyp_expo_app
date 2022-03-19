import gql from "graphql-tag";
import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { AuthContext } from '../context/auth';
import { Color } from '../utils/Constants';

const styles = StyleSheet.create({
    text: {
        // color: Color.primary,
        fontWeight: 'bold',
        fontSize: 30,
        alignSelf: 'center',
        marginBottom: 20,
    },
    box: {
        marginHorizontal: 50,
        marginVertical: 4,
        height: 50,
        justifyContent: 'center',
    },
    button: {
        marginVertical: 6,
        borderWidth: 1,
        borderColor: Color.primary
    },
    errorBox: {
        marginHorizontal: 50,
        marginVertical: 20,
        padding: 10,
        backgroundColor: Color.errorBg,
        borderColor: Color.errorText,
        borderWidth: 1,
        borderRadius: 10,
        color: Color.errorText,
    }
});

function LoginView() {
    const navigation = useNavigation();
    const context = useContext(AuthContext);

    const [usernameText, setUsernameText] = useState("");
    const [passwordText, setPasswordText] = useState("");

    const [errors, setErrors] = useState({});

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, result) {
            context.login(result.data.login);
            navigation.navigate('Tabs')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: {
            username: usernameText,
            password: passwordText
        }
    })

    return (
        <View style={{ justifyContent: 'center', flex: 1 }}>
            <Text style={styles.text}>
                Hi there.
            </Text>
            <TextInput
                mode='outlined'
                activeOutlineColor={Color.primary}
                style={styles.box}
                placeholder='Username'
                value={usernameText}
                onChangeText={usernameText => setUsernameText(usernameText)}
                left={<TextInput.Icon name="account" />}
            />
            <TextInput
                mode='outlined'
                activeOutlineColor={Color.primary}
                style={styles.box}
                placeholder='Password'
                secureTextEntry
                onChangeText={passwordText => setPasswordText(passwordText)}
                left={<TextInput.Icon name="lock" />}
            />
            <View style={{ marginBottom: 10 }} />
            <Button
                mode='contained'
                color={Color.primary}
                style={[styles.box, styles.button]}
                labelStyle={{ color: 'white' }}
                onPress={loginUser}
            >
                login
            </Button>
            <Button
                mode='outlined'
                color={Color.primary}
                style={[styles.box, styles.button]}
                onPress={() => navigation.navigate('Register')}
            >
                sign up
            </Button>
            {Object.keys(errors).length > 0 && (
                <View style={styles.errorBox}>
                    {Object.values(errors).map(error => (
                        <Text key={error}>{error}</Text>
                    ))}
                </View>
            )}
            <View style={{ marginBottom: 100 }} />
        </View>
    );
};

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
            loginInput: {
                username: $username
                password: $password
            }
        ) {
            id
            username
            createdAt
            token
        }
    }
`;

export default LoginView;