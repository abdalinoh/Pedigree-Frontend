import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Alert, Card, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import { useFamily } from '../context/FamilyContext';

const Profile = () => {
  const { familyData } = useFamily(); // Utilisation du contexte Family (assurez-vous qu'il est utilisé)
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
        const userResponse = await axiosInstance.get('/utils/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(userResponse.data.user);        
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

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Chargement des données du profil...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header as="h2">Profil de l'Utilisateur</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {userData && (
                <>
                  <p><strong>Nom :</strong> {userData?.nom || 'Non spécifié'}</p> {/* Nom non modifiable */}
                  <p><strong>Prénom :</strong> {userData?.prenom}</p>
                  <p><strong>Email :</strong> {userData?.email}</p>
                  <p><strong>Rôle :</strong> {userData.role}</p>
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
                      {userData.role === 'ADMIN' && (
                        <>
                          <Link as={Link} to={`/user-member`}>Cliquez sur ce lien pour completer ou modifier votre profile</Link>
                          <Button variant="primary" onClick={handleEdit}>
                            Modifier Email
                          </Button>
                        </>
                      )}
                      <Button variant="secondary" onClick={handleBack} className="ms-2">
                        Retour
                      </Button>
                    </>
                  )}
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
