// src/components/NotFound.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="display-1">404</h1>
          <h2 className="display-4">Page Non Trouvée</h2>
          <p className="lead">Désolé, la page que vous recherchez n'existe pas.</p>
          <Link to="/home">
            <Button variant="primary">Quitter</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;