import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Home.css';

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <Navbar bg="dark" variant="dark" sticky="top" expand="lg">
        <Container>
          <Navbar.Brand href="#">Gestion des Membres de la Famille</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" onClick={toggleMenu} />
          <Navbar.Collapse id="navbar-nav" in={menuOpen}>
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/settings">Paramètres</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profil</Nav.Link>
              <Nav.Link as="button" onClick={handleLogout}>Déconnexion</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="home-main">
        <Container>
          <section className="home-section">  
            <h1>Bienvenue sur Pedigree !</h1>
            <p>Une application pour gérer les membres de votre famille et vos amis proches.</p>
            <div className="home-buttons">
              <Button as={Link} to="/add-member" className="home-button" variant="primary">Ajouter un Membre de la Famille</Button>
              <Button as={Link} to="/add-friend" className="home-button" variant="primary">Ajouter un Ami Proche</Button>
              <Button as={Link} to="/members-list" className="home-button" variant="primary">Liste des Membres</Button>
              <Button as={Link} to="/family-diagram" className="home-button" variant="primary">Arbres Générés</Button>
              <Button onClick={handleLogout} className="home-button" variant="danger">Quitter</Button>
            </div>
          </section>
        </Container>
      </main>
      <footer className="home-footer">
        <Container>
          <p>&copy; 2024 Gestion de la Famille. Tous droits réservés.</p>
        </Container>
      </footer>
    </div>
  );
};

export default Home;