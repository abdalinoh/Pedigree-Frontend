import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      document.body.classList.add('fade-out');
      setTimeout(() => navigate('/home'), 3000);
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

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
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('idUtilisateur', response.data.idUtilisateur);
      localStorage.setItem('familyId', response.data.idFamille);
      localStorage.setItem('isFamOwner', response.data.fam_owner);
      localStorage.setItem('userRole', response.data.role);

      setMessage('Connexion réussie ! Veuillez patienter pendant que nous vous connectons.');
      setMessageType('success');
      setIsLoggedIn(true);

      if (onLogin) {
        onLogin();
      }

      toast.success('Connexion réussie ! Vous serez redirigé vers la page d\'acceuil.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
      setMessage(errorMessage);
      setMessageType('error');
      console.log(error);
      toast.error(errorMessage);
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
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" />
          <p>Connexion en cours, veuillez patienter...</p>
        </div>
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
      <ToastContainer />
    </div>
  );
};

export default Login;