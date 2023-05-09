import React, { useEffect } from 'react';

export const AuthContext = React.createContext({
  id: '',
  name: '',
  lastname: '',
  email: ''
});

const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = React.useState({
    id: '',
    name: '',
    lastname: '',
    email: ''
  });
  const [token, setToken] = React.useState(null);

  const register = async userValues => {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: userValues.name,
        lastname: userValues.lastname,
        email: userValues.email,
        password: userValues.password
      })
    });
    if (response.status === 409) {
      return response.json();
    }
    if (response.status === 200) {
      response.json().then(data => {
        setUserInfo({
          id: data.id,
          name: data.name,
          lastname: data.lastname,
          email: data.email
        });
      });
    }
    return null;
  };

  const login = async (email, password) => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password
      })
    });
    if (response.status === 401) {
      return response.json();
    }
    if (response.status === 200) {
      response.json().then(data => {
        setUserInfo({
          id: data.id,
          name: data.name,
          lastname: data.lastname,
          email: data.email
        });
      });
      return null;
    }
    return null;
  };

  const checkProfile = async () => {
    const response = await fetch('http://localhost:3000/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (response.status === 401) {
      return response.json();
    }
    if (response.status === 200) {
      response.json().then(data => {
        setUserInfo({
          id: data.id,
          name: data.name,
          lastname: data.lastname,
          email: data.email
        });
      });
      return null;
    }
    return null;
  };

  const logout = async () => {
    await fetch('http://localhost:3000/logout', {
      credentials: 'include',
      method: 'POST'
    })
      .then(res => res.json())
      .then(() => {
        setUserInfo(null);
      });
  };

  useEffect(() => {
    checkProfile();
  }, []);

  return (
    <AuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        userInfo,
        setUserInfo,
        token,
        setToken,
        register,
        login,
        logout,
        checkProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
