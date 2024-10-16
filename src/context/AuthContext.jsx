import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

const dummyUsers = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const login = (email, password) => {
    const foundUser = dummyUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      setUser(foundUser.email);
      setError('');
    } else {
      setError('Invalid email or password');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
