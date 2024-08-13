import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isMember, setIsMember] = useState(false); // Ajouté pour vérifier si l'utilisateur est membre
  const [loading, setLoading] = useState(true);

  const HOST = "http://192.168.86.55:5000"; // Adresse de votre backend

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${HOST}/api/utils/All-Permision`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const { user, fam_owner } = response.data;
          setUser(user);
          setRole(fam_owner ? 'ADMIN' : 'USER');

          // Vérifier si l'utilisateur est ajouté en tant que membre
          // const memberResponse = await axios.get(`${HOST}/api/user/member/`, {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
          // setIsMember(memberResponse.data.isMember);
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
      const response = await axios.post(`${HOST}/api/auth/connexion`, credentials);
      const token = response.data?.data?.token;
      const user = response.data?.utilisateur;
      const fam_owner = response.data?.fam_owner;
      localStorage.setItem('token', token);
      setUser(user);
      setRole(user?.role);

      // Vérifier si l'utilisateur est ajouté en tant que membre
      /*const memberResponse = await axios.get(`${HOST}/api/user/member/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsMember(memberResponse.data.isMember);*/
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
    setIsMember(false); // Réinitialiser l'état de membre lors de la déconnexion
  };

  return (
    <AuthContext.Provider value={{ user, role, isMember, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};