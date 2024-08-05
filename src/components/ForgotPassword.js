import React, { useState } from 'react';
import axiosInstance from '../services/axiosSetup';
import { Form, Button, Container, Alert, Row, Col, Card } from 'react-bootstrap';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            await axiosInstance.post('/auth/forgot-password', { email });
            setMessage('Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
        } catch (err) {
            setError('Une erreur est survenue. Veuillez vérifier votre adresse e-mail.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="text-center mb-4">
                                <h2>Réinitialiser le mot de passe</h2>
                            </div>
                            {message && <Alert variant="success">{message}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="email">
                                    <Form.Label>Adresse e-mail</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Entrez votre adresse e-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 mt-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Envoi en cours...' : 'Envoyer'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;