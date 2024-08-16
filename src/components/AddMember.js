import React, { useState, useEffect } from 'react';
import { Alert, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import { useFamily } from '../context/FamilyContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMember = () => {
    const { familyData } = useFamily();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [pereName, setPereName] = useState();
    const [mereName, setMereName] = useState();
    const [isMarried, setIsMarried] = useState('');
    const [gender, setGender] = useState('');
    const [religion, setReligion] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [electrophoresis, setElectrophoresis] = useState('');
    const [signFa, setSignFA] = useState('');
    const [conjointName, setConjointName] = useState();
    const [metier, setMetier] = useState('');
    const [members, setMembers] = useState([]);
    const [linkTypes, setLinkTypes] = useState([]);
    const [selectedLinkType, setSelectedLinkType] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    
    const navigate = useNavigate(); 


    useEffect(() => {
        const fetchLinkTypes = async () => {
            try {
                const response = await axiosInstance.get('/utils/typesDeLien');
                setLinkTypes(response.data);
            } catch (error) {
                console.log('Erreur lors de la récupération des types de liens:', error);
            }
        };
    
        fetchLinkTypes();
    }, []);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axiosInstance.get('/user/member/tous');
                setMembers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des membres', error);
            }
        };
        fetchMembers();
    }, []);

    const checkIfMemberExists = async (firstName, dateNaissance) => {
        try {
          const response = await axiosInstance.get('/user/member/tous', {
            params: { prenom: firstName, date_de_naissance: dateNaissance, sexe: gender }
          });
          return response.data.exists; // Supposons que la réponse contient un champ 'exists'
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'existence du membre:', error);
          return false;
        }
    };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
    
        // Vérifier si le membre existe déjà
        const memberExists = await checkIfMemberExists(firstName, dateNaissance, gender);
        if (memberExists) {
            setMessage('Un membre avec ces informations existe déjà.');
            toast.error('Un membre avec ces informations existe déjà.');
            setLoading(false);
            setTimeout(() => navigate('/home'), 3000); // Redirection vers la page d'accueil après 3 secondes
            return;
        }
    
        try {
            const response = await axiosInstance.post('admin/member/ajouter', {
                token: token,
                nom: lastName,
                prenom: firstName,
                date_de_naissance: dateNaissance,
                sexe: gender,
                id_pere: pereName,
                id_mere: mereName,
                type_de_lien: selectedLinkType,
                statut_matrimonial: isMarried,
                id_conjoint: conjointName,
                religion,
                profession: metier,
                groupe_sanguin: bloodGroup,
                electrophorese: electrophoresis,
                signe_du_fa: signFa,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            // Handle response if needed
            console.log('Réponse du serveur:', response);
    
            setMessage('Ajout réussie! Membre ajouté avec succès.');
            toast.success('Ajout réussi! Membre ajouté avec succès.');
            resetForm();
            setTimeout(() => navigate('/home'), 3000); // Rediriger après l'ajout réussi
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
            setMessage(errorMessage);
            toast.error(errorMessage);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler ? Toutes les modifications non enregistrées seront perdues.')) {
            resetForm();
            navigate('/home'); // Vous pourriez vouloir naviguer vers une autre route si nécessaire
        }
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setDateNaissance('');
        setPereName();
        setMereName();
        setIsMarried('');
        setGender('');
        setReligion('');
        setBloodGroup('');
        setElectrophoresis('');
        setSignFA('');
        setConjointName();
        setSelectedLinkType('');
        setMetier('');
        setMessage('');
    };

   // Assumer que l'admin est toujours connecté
   const isAdmin = true; // Cette valeur devrait être définie en fonction de la logique d'authentification réelle

    return (
        <div className="register-member-container"> 
            <h2>Ajouter un membre</h2>
            {message && <p>{message}</p>}
            {isAdmin && (
                <Alert variant="success">
                    Vous êtes connecté en tant qu'Administrateur.
                </Alert>
            )}
            {loading && <Spinner animation="border" />}
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Informations générales</legend>
                    <div>
                        <label>Nom :</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Prénom :</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Sexe :</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner...</option>
                            <option value="Masculin">Masculin</option>
                            <option value="Feminin">Féminin</option>
                        </select>
                    </div>
                    <div>
                        <label>Date de naissance :</label>
                        <input
                            type="date"
                            value={dateNaissance}
                            onChange={(e) => setDateNaissance(e.target.value)}
                            required
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Informations des parents :</legend>
                    <div>
                        <label>Père:</label>
                        <select
                            value={pereName}
                            onChange={(e) => setPereName(e.target.value)}
                        >
                            <option value="">Sélectionner un membre...</option>
                            {members?.map((member) => (
                                <option key={member._id} value={member._id}>
                                    {member.prenom} {member.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Mère:</label>
                        <select
                            value={mereName}
                            onChange={(e) => setMereName(e.target.value)}
                        >
                            <option value="">Sélectionner un membre...</option>
                            {members?.map((member) => (
                                <option key={member._id} value={member._id}>
                                    {member.prenom} {member.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Autres informations</legend>
  
                    <Form.Group>
                        <Form.Label>Type de lien :</Form.Label>
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
                    <div>
                        <label>État matrimonial :</label>
                        <select
                            value={isMarried}
                            onChange={(e) => setIsMarried(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner...</option>
                            <option value="Marie(e)">Marie(e)</option>
                            <option value="Celibataire">Celibataire</option>
                            <option value="Divorce(e)">Divorce(e)</option>
                            <option value="Veuf(ve)">Veuf(ve)</option>
                        </select>
                    </div>
                    {isMarried === 'Marie(e)' && (
                        <div>
                            <label>Nom du conjoint :</label>
                            <select
                                value={conjointName}
                                onChange={(e) => setConjointName(e.target.value)}
                            >
                                <option value="">Sélectionner un membre...</option>
                            {members?.map((member) => (
                                <option key={member._id} value={member._id}>
                                    {member.prenom} {member.nom}
                                </option>
                            ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label>Profession :</label>
                        <input
                            type="text"
                            value={metier}
                            onChange={(e) => setMetier(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Religion :</label>
                        <select
                            value={religion}
                            onChange={(e) => setReligion(e.target.value)}
                        >
                            <option value="">Sélectionner...</option>
                            <option value="Christianisme">Christianisme</option>
                            <option value="Islam">Islam</option>
                            <option value="Hindouisme">Hindouisme</option>
                            <option value="Bouddhisme">Bouddhisme</option>
                            <option value="Judaisme">Judaïsme</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                    <div>
                        <label>Groupe sanguin :</label>
                        <select
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
                        </select>
                    </div>
                    <div>
                        <label>Signe du Fâ :</label>
                        <input
                            type="text"
                            value={signFa}
                            onChange={(e) => setSignFA(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Électrophorèse :</label>
                        <input
                            type="text"
                            value={electrophoresis}
                            onChange={(e) => setElectrophoresis(e.target.value)}
                        />
                    </div>
                </fieldset>
                <div className="form-buttons">
                <button type="submit">Ajouter</button>
                <button type="button" onClick={handleCancel}>Annuler</button>
            </div>
        </form>
        <ToastContainer />
    </div>
);
};

export default AddMember;
