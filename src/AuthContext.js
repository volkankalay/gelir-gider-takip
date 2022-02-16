import React from 'react';

const AuthContext = React.createContext({
    authenticated: false,
    userToken: sessionStorage.getItem('userToken'),
    login: (token) => { authenticated = true, userToken = token },
    register: (token) => { authenticated = true, userToken = token },
    logout: (token) => { authenticated = false, userToken = token },
});

export default AuthContext;