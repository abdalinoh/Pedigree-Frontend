import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { useFamily } from '../context/FamilyContext';

const EditMember = () => {
    const { id } = useParams();
    const [member, setMember] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [pereName, setPereName] = useState('');
    const [mereName, setMereName] = useState('');
    const [isMarried, setIsMarried] = useState('');
    const [gender, setGender] = useState('');
    const [religion, setReligion] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [electrophoresis, setElectrophoresis] = useState('');
    const [signFa, setSignFA] = useState('');
    const [message, setMessage] = useState('');
    const [conjointName, setConjointName] = useState('');
    const [metier, setMetier] = useState('');
    const [members, setMembers] = useState([]);
    const [linkTypes, setLinkTypes] = useState([]);
    const [selectedLinkType, setSelectedLinkType] = useState('');
    const { familyData } = useFamily();
    const navigate = useNavigate(); 

    useEffect(() => {
        let isMounted = true; // suivi si le composant est monté
    
        const fetchData = async () => {
            try {
                const [memberResponse, linkTypesResponse, membersResponse] = await Promise.all([
                    axiosInstance.get(`/membres/afficher/${id}`),
                    axiosInstance.get('/utils/typesDeLien'),
                    axiosInstance.get('/user/member/tous')
                ]);
    
                if (isMounted) {
                    const memberData = memberResponse.data.data;
                    const formattedDate = moment(memberData.date_de_naissance).format('YYYY-MM-DD');
    
                    setMember(memberData);
                    setFirstName(memberData.prenom);
                    setDateNaissance(formattedDate);
                    setPereName(memberData.id_pere || '');
                    setMereName(memberData.id_mere || '');
                    setIsMarried(memberData.statut_matrimonial || '');
                    setGender(memberData.sexe || '');
                    setReligion(memberData.religion || '');
                    setBloodGroup(memberData.groupe_sanguin || '');
                    setElectrophoresis(memberData.electrophorese || '');
                    setSignFA(memberData.signe_du_fa || '');
                    setConjointName(memberData.conjoint || '');
                    setMetier(memberData.profession || '');
                    setSelectedLinkType(memberData.type_de_lien || '');
    
                    setLinkTypes(linkTypesResponse.data);
                    setMembers(membersResponse.data);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Erreur lors de la récupération des données:', error);
                    setMessage('Erreur lors de la récupération des données.');
                }
            }
        };
    
        fetchData();
    
        return () => {
            isMounted = false; // fonction de nettoyage
        };
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`admin/member/modifier/${id}`, {
                prenom: firstName,
                nom: familyData.family_name || '',
                date_de_naissance: moment(dateNaissance).format('DD/MM/YYYY'),
                id_pere: pereName,
                id_mere: mereName,
                statut_matrimonial: isMarried,
                type_de_lien: selectedLinkType,
                sexe: gender,
                religion,
                groupe_sanguin: bloodGroup,
                electrophorese: electrophoresis,
                signe_du_fa: signFa,
                conjoint: conjointName,
                profession: metier
            });
            setMessage('Membre modifié avec succès!');
            navigate('/members-list');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
            setMessage(errorMessage);
            console.error('Erreur lors de la mise à jour:', error);
        }
    };
    const handleCancel = () => {
        navigate('/members-list'); // Rediriger vers la liste des membres sans modifier
    };

    return (
        <Container>
            <h2>Modifier un membre</h2>
            {message && <p>{message}</p>}
            {member ? (
                <Form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Informations générales</legend>
                        <Row>
                            <Col>
                                <Form.Group controlId="lastName">
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={familyData.family_name || ''}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="firstName">
                                    <Form.Label>Prénom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="gender">
                                    <Form.Label>Sexe</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="Masculin">Masculin</option>
                                        <option value="Feminin">Feminin</option>
                                        <option value="Autre">Autre</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="dateNaissance">
                                    <Form.Label>Date de naissance</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dateNaissance}
                                        onChange={(e) => setDateNaissance(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </fieldset>
                    <fieldset>
                        <legend>Informations des parents</legend>
                        <Row>
                            <Col>
                                <Form.Group controlId="pereName">
                                    <Form.Label>Père</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={pereName}
                                        onChange={(e) => setPereName(e.target.value)}
                                    >
                                        <option value="">Sélectionner un membre...</option>
                                        {members.map((member) => (
                                            <option key={member._id} value={member._id}>
                                                {member.prenom} {member.nom}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="mereName">
                                    <Form.Label>Mère</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={mereName}
                                        onChange={(e) => setMereName(e.target.value)}
                                    >
                                        <option value="">Sélectionner un membre...</option>
                                        {members.map((member) => (
                                            <option key={member._id} value={member._id}>
                                                {member.prenom} {member.nom}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="selectedLinkType">
                                    <Form.Label>Type de lien</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedLinkType}
                                        onChange={(e) => setSelectedLinkType(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner un type de lien...</option>
                                        {linkTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </fieldset>
                    <fieldset>
                       
                        <legend>Autres informations</legend>
                        <Form.Group controlId="isMarried">
                            <Form.Label>État matrimonial</Form.Label>
                            <Form.Control
                                as="select"
                                value={isMarried}
                                onChange={(e) => setIsMarried(e.target.value)}
                                required
                            >
                                <option value="">Sélectionner...</option>
                                <option value="Marie(e)">Marie(e)</option>
                                <option value="Celibataire">Celibataire</option>
                                <option value="Divorce(e)">Divorce(e)</option>
                                <option value="Veuf(ve)">Veuf(ve)</option>
                            </Form.Control>
                        </Form.Group>
                        {isMarried === 'Marie(e)' && (
                            <Form.Group controlId="conjointName">
                                <Form.Label>Nom du conjoint</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={conjointName}
                                    onChange={(e) => setConjointName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        )}
                        <Form.Group controlId="metier">
                            <Form.Label>Profession</Form.Label>
                            <Form.Control
                                type="text"


                                value={metier}
                                onChange={(e) => setMetier(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="religion">
                            <Form.Label>Religion</Form.Label>
                            <Form.Control
                                as="select"
                                value={religion}
                                onChange={(e) => setReligion(e.target.value)}
                            >
                                <option value="">Sélectionner...</option>
                                <option value="Christianisme">Christianisme</option>
                                <option value="Islam">Islam</option>
                                <option value="Hindouisme">Hindouisme</option>
                                <option value="Bouddhisme">Bouddhisme</option>
                                <option value="Judaisme">Judaïsme</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="bloodGroup">
                            <Form.Label>Groupe sanguin</Form.Label>
                            <Form.Control
                                as="select"
                                value={bloodGroup}
                                onChange={(e) => setBloodGroup(e.target.value)}
                            >
                                <option value="">Sélectionner...</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="Autre">Autre</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="signFa">
                            <Form.Label>Signe du Fâ</Form.Label>
                            <Form.Control
                                type="text"
                                value={signFa}
                                onChange={(e) => setSignFA(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="electrophoresis">
                            <Form.Label>Électrophorèse</Form.Label>
                            <Form.Control
                                type="text"
                                value={electrophoresis}
                                onChange={(e) => setElectrophoresis(e.target.value)}
                            />
                        </Form.Group>
                    </fieldset>
                    <Button variant="primary" type="submit">Modifier</Button>
                    <Button variant="secondary" onClick={handleCancel}>Annuler</Button>
                </Form>
            ) : (
                <p>Chargement des données du membre...</p>
            )}
        </Container>
    );
};

export default EditMember;