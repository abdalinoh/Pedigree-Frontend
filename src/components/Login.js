// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Home from './Home';

const Login = () => {
  const { login, loginError, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn || user) {
      document.body.classList.add('fade-out');
      setTimeout(() => navigate('/Home'), 3000);
    }
  }, [isLoggedIn, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, mot_de_passe: password });
      setIsLoggedIn(true);
      toast.success('Connexion réussie ! Vous serez redirigé vers la page d\'accueil.');
    } catch (error) {
      toast.error(loginError || 'Une erreur est survenue');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) return <Spinner animation="border" />;

  if (isLoggedIn || user) return null;

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {loginError && (
        <p className="error-message">
          {loginError}
        </p>
      )}
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
      <ToastContainer />
    </div>
  );
};

export default Login;