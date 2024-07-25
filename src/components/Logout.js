import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Effacer le token du stockage local
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Rediriger vers la page de connexion
    navigate('/login');
  }, [navigate]);

  return (
    <div>
      <p>Déconnexion en cours...</p>
    </div>
  );
};

export default Logout;
