import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import useLinkTypes from '../hooks/useLinkTypes';

const MemberDetail = () => {
    const { id } = useParams();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { linkTypes, loading: linkTypesLoading, error: linkTypesError } = useLinkTypes();

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/admin/member/details/${id}`);
                setMember(response.data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du membre', error);
                setError('Erreur lors de la récupération des détails du membre.');
            } finally {
                setLoading(false);
            }
        };

        fetchMemberDetails();
    }, [id]);

    if (loading) {
        return <div>Chargement des détails du membre...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!member) {
        return <div>Membre non trouvé.</div>;
    }

    if (linkTypesLoading) {
        return <div>Chargement des types de lien...</div>;
    }

    if (linkTypesError) {
        return <div>{linkTypesError}</div>;
    }

    const getLinkTypeDescription = (type) => {
        const typeObj = linkTypes.find(linkType => linkType.id === type);
        return typeObj ? typeObj.description : 'Non spécifié';
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h2>Détails du membre</h2>
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <th>Nom</th>
                                <td>{member?.nom || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Prénom</th>
                                <td>{member?.prenom || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Date de naissance</th>
                                <td>{member?.date_de_naissance ? moment(member?.date_de_naissance).format('DD/MM/YYYY') : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Sexe</th>
                                <td>{member?.sexe || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>État matrimonial</th>
                                <td>{member?.statut_matrimonial || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Père</th>
                                <td>{member?.père ? `${member?.père?.prenom} ${member?.père?.nom}` : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Mère</th>
                                <td>{member?.mère ? `${member?.mère?.prenom} ${member?.mère?.nom}` : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Conjoint</th>
                                <td>{member?.conjoint ? `${member?.conjoint?.prenom} ${member?.conjoint?.nom}` : 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Profession</th>
                                <td>{member?.profession || 'Non spécifié'}</td>
                            </tr>
                            <tr>
                                <th>Religion</th>
                                <td>{member?.religion || 'Non spécifié'}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button variant="primary" onClick={() => window.history.back()}>Retour</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default MemberDetail;