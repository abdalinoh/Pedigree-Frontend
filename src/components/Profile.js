// src/components/Profile.js

import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Alert, Card, Form } from 'react-bootstrap';
import axiosInstance from '../services/axiosSetup';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axiosInstance.get('/utilisateurs/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(userResponse.data);
        setFormData({
          email: userResponse.data.user?.email || '',
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.response?.data || error.message);
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => setEditMode(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(`/utilisateurs/modifier/${userData.user?.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(prevState => ({
        ...prevState,
        user: {
          ...prevState.user,
          email: formData.email
        }
      }));
      setEditMode(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données utilisateur:', error.response?.data || error.message);
      setError('Erreur lors de la mise à jour des données utilisateur.');
    }
  };

  const handleBack = () => navigate('/home');

  if (loading) return <p>Chargement des données du profil...</p>;

  return (
    <Container className="my-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header as="h2">Profil de l'Utilisateur</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {editMode ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email :</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Enregistrer
                  </Button>
                  <Button variant="secondary" onClick={handleCancel} className="ms-2">
                    Annuler
                  </Button>
                </Form>
              ) : (
                <>
                  <p><strong>Nom:</strong> {userData.user?.nom}</p>
                  <p><strong>Prénom:</strong> {userData.user?.prenom}</p>
                  <p><strong>Email:</strong> {userData.user?.email}</p>
                  <p><strong>Rôle:</strong> {userData.role}</p>
                  {userData.role === 'ADMIN' && (
                    <Button variant="primary" onClick={handleEdit}>
                      Modifier Email
                    </Button>
                  )}
                  <Button variant="secondary" onClick={handleBack} className="ms-2">
                    Retour
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;