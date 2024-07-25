import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Alert, Card, Form } from 'react-bootstrap';
import axiosInstance from '../services/axiosSetup';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '' });
  const navigate = useNavigate();

  // Fonction pour récupérer les données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/utilisateurs/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        setFormData({
          nom: response.data.user?.nom || '',
          prenom: response.data.user?.prenom || '',
          email: response.data.user?.email || ''
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error.response?.data || error.message);
        setError('Erreur lors de la récupération des données utilisateur.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fonction pour gérer la modification du profil
  const handleEdit = () => {
    setEditMode(true);
  };

  // Fonction pour annuler les modifications
  const handleCancel = () => {
    setEditMode(false);
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fonction pour soumettre les modifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = formData.email;
      const response = await axiosInstance.put(`/utilisateurs/modifier/${email}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Réponse après mise à jour:', response.data); // Vérifiez la réponse
      setUserData(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données utilisateur:', error.response?.data || error.message);
      setError('Erreur lors de la mise à jour des données utilisateur.');
    }
  };

  // Fonction pour revenir à l'accueil
  const handleBack = () => {
    navigate('/home');
  };

  if (loading) {
    return <p>Chargement des données du profil...</p>;
  }

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
                  <Form.Group controlId="formNom">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formPrenom">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">Enregistrer</Button>
                  <Button variant="secondary" onClick={handleCancel} className="ml-2">Annuler</Button>
                </Form>
              ) : userData ? (
                <div>
                  <p><strong>Nom :</strong> {userData.user?.nom || 'Non disponible'}</p>
                  <p><strong>Prénom :</strong> {userData.user?.prenom || 'Non disponible'}</p>
                  <p><strong>Email :</strong> {userData.user?.email || 'Non disponible'}</p>
                  <Button variant="primary" onClick={handleEdit}>Modifier</Button>
                </div>
              ) : (
                <p>Aucune donnée utilisateur disponible.</p>
              )}
              <Button variant="primary" onClick={handleBack} className="mt-3">Retour à l'Accueil</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;