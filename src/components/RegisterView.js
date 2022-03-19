import { gql, useMutation } from '@apollo/client';
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

function RegisterView() {
    const navigation = useNavigation();

    const context = useContext(AuthContext);
    
    const [usernameText, setUsernameText] = useState("");
    const [passwordText, setPasswordText] = useState("");
    const [confirmText, setConfirmText] = useState("");

    const [errors, setErrors] = useState({});

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, result) {
            context.login(result.data.register);
            navigation.navigate('Tabs');
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.errors)
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: {
            username: usernameText,
            password: passwordText,
            confirmedPassword: confirmText
        }
    });

    return (
        <View style={{justifyContent: 'center', flex: 1}}>
            <Text style={styles.text}>
                Sign up.
            </Text>
            <TextInput
                mode='outlined'
                activeOutlineColor={Color.primary}
                style = {styles.box}
                placeholder='Username'
                value={usernameText}
                onChangeText={usernameText => setUsernameText(usernameText)}
                left={<TextInput.Icon name="account"/>}
            />
            <TextInput
                mode='outlined'
                activeOutlineColor={Color.primary}
                style = {styles.box}
                placeholder='Password'
                secureTextEntry
                onChangeText={passwordText => setPasswordText(passwordText)}
                left={<TextInput.Icon name="lock"/>}
            />
            <TextInput
                mode='outlined'
                activeOutlineColor={Color.primary}
                style = {styles.box}
                placeholder='Confirmed Password'
                secureTextEntry
                onChangeText={confirmText => setConfirmText(confirmText)}
                left={<TextInput.Icon name="lock"/>}
            />
            <View style={{marginBottom: 10}}/>
            <Button 
                mode='contained'
                color={Color.primary}
                style = {[styles.box, styles.button]}
                labelStyle = {{color: 'white'}}
                onPress={addUser}
            >
                sign up
            </Button>
            <Button
                mode='outlined'
                color={Color.primary}
                style={[styles.box, styles.button]}
                onPress={() => navigation.navigate('Login')}
            >
                login
            </Button>
            {Object.keys(errors).length > 0 && (
                <View style={styles.errorBox}>
                    {Object.values(errors).map(error => (
                        <Text key={error}>{error}</Text>
                    ))}
                </View>
            )}
            <View style={{marginBottom: 100}}/>
        </View>
    );
};

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $password: String!
        $confirmedPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                password: $password
                confirmedPassword: $confirmedPassword
            }
        ) {
            id
            username
            createdAt
            token
        }
    }
`

export default RegisterView;