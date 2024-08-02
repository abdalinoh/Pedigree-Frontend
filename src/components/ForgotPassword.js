import React, { useState } from 'react';
import axiosInstance from '../services/axiosSetup';
import { Form, Button, Container } from 'react-bootstrap';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/auth/forgot-password', { email });
            setMessage('Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
        } catch (err) {
            setError('Une erreur est survenue. Veuillez vérifier votre adresse e-mail.');
        }
    };

    return (
        <Container>
            <h2>Réinitialiser le mot de passe</h2>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Adresse e-mail</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Envoyer</Button>
            </Form>
        </Container>
    );
};

export default ForgotPassword;