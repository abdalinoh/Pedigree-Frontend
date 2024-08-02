import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [messageType, setMessageType] = useState(''); // 'error' ou 'success'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État pour contrôler l'affichage du formulaire
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://192.168.86.129:5000/api/utilisateurs/connexion', {
        email,
        mot_de_passe: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Réponse du serveur:', response);

      // Stocker le token et l'ID utilisateur dans localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('idUtilisateur', response.data.idUtilisateur);
      localStorage.setItem('familyId', response.data.idFamille);
      localStorage.setItem('isFamOwner', response.data.fam_owner);
      localStorage.setItem('userRole', response.data.role);

      setMessage('Connexion réussie ! Veuillez patienter pendant que nous vous connectons.');
      setMessageType('success');
      setIsLoggedIn(true); // Met à jour l'état pour cacher le formulaire

      if (onLogin) {
        onLogin(); // Appel du callback pour indiquer que la connexion est réussie
      }

      // Redirection basée sur le rôle
      const redirectPath = response.data.role === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard';
      setTimeout(() => navigate(redirectPath), 3000); // Redirige vers la page basée sur le rôle après 3 secondes
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
      setMessage(errorMessage);
      setMessageType('error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {message && (
        <p className={messageType === 'success' ? 'success-message' : 'error-message'}>
          {message}
        </p>
      )}
      {!isLoggedIn && (
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email :</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder='ex: nom@gmail.com'
            />
          </div>
          <div className="input-group password-group">
            <label htmlFor="password">Mot de passe :</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          <p>
            <a href="/forgot-password">Mot de passe oublié ?</a>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;