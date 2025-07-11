import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('chatly-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (data) => {
    setUser(data.user);
    localStorage.setItem('chatly-user', JSON.stringify(data.user));
    localStorage.setItem('chatly-token', data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatly-user');
    localStorage.removeItem('chatly-token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
