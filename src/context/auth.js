import React, { useReducer, createContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import UserStorage from '../utils/UserStorage';
import { KeyNotExistError, TOKEN } from '../utils/Constants';

const initialState = {
    user: null
};

const storage = new UserStorage();

// Fetch the token from storage then navigate to our appropriate place
const bootstrapAsync = async () => {
    let token;

    try {
        token = await storage.retrieveData(TOKEN);
        if (token != KeyNotExistError) {
            const decodedToken = jwtDecode(token);

            initialState.user = decodedToken;
        }
    } catch (e) {
        // Restoring token failed
    }
};

bootstrapAsync();

const AuthContext = createContext({
    user: null,
    login: (userData) => { },
    logout: () => { }
});

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        case 'RESTORE_TOKEN':
            return {
                ...state,
                user: action.payload
            }
        default:
            return state;
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    function login(userData) {
        storage.storeData(TOKEN, userData.token);
        dispatch({
            type: 'LOGIN',
            payload: userData
        });
    }

    function logout() {
        storage.removeData(TOKEN);
        dispatch({ type: 'LOGOUT' });
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props} />
    );
}

export { AuthContext, AuthProvider };