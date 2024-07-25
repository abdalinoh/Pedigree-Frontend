import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
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
      const response = await axios.post('http://192.168.86.55:5000/api/utilisateurs/connexion', {
        email,
        mot_de_passe: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Réponse du serveur:', response);

      // Stocker le token et l'ID utilisateur dans localStorage
      localStorage.setItem('token', response.data.date.token);
      localStorage.setItem('idUtilisateur', response.data.date.idUtilisateur); // Ajoutez userId si nécessaire

      setMessage('Connexion réussie ! Veuillez patienter pendant que nous vous connectons.');
      setMessageType('success');
      setIsLoggedIn(true); // Met à jour l'état pour cacher le formulaire
      setTimeout(() => navigate('/home'), 2000); // Redirige vers la page d'accueil après 2 secondes
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
            <label>Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder='ex: nom@gmail.com'
            />
          </div>
          <div className="input-group password-group">
            <label>Mot de passe :</label>
            <div className="password-wrapper">
              <input
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
        </form>
      )}
      {!isLoggedIn && (
        <p>Pas encore inscrit ? <Link to="/register">S'inscrire</Link></p>
      )}
    </div>
  );
};

export default Login;
