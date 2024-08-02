import React, { useState } from 'react';
import axiosInstance from '../services/axiosSetup';
import { Form, Button, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        try {
            await axiosInstance.post('/auth/reset-password', { token, password });
            setMessage('Votre mot de passe a été réinitialisé avec succès.');
        } catch (err) {
            setError('Une erreur est survenue lors de la réinitialisation de votre mot de passe.');
        }
    };

    return (
        <Container>
            <h2>Réinitialiser le mot de passe</h2>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="password">
                    <Form.Label>Nouveau mot de passe</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirmer le mot de passe</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Réinitialiser</Button>
            </Form>
        </Container>
    );
};

export default ResetPassword;