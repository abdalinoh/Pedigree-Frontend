// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);

  const HOST = "http://192.168.86.129:5000"; // Adresse de votre backend

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${HOST}/api/UserRoles/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const { user, fam_owner } = response.data;
          setUser(user);
          setRole(fam_owner ? 'ADMIN' : 'USER');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${HOST}/api/utilisateurs/connexion`, credentials);
      const { token, user, fam_owner } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setRole(fam_owner ? 'ADMIN' : 'USER');
      setLoginError(null); // Clear any previous errors
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      setLoginError('Échec de la connexion. Veuillez réessayer.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, loginError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};