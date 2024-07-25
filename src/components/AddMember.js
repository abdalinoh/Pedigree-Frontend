import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup'; // Importer l'instance axios configurée

const AddMember = () => {
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
    const [message, setMessage] = useState('');
    const [conjointName, setConjointName] = useState('');
    const [metier, setMetier] = useState('');
    const [members, setMembers] = useState([]);
    const [linkTypes, setLinkTypes] = useState([]);
    const [selectedLinkType, setSelectedLinkType] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchLinkTypes = async () => {
            try {
                const response = await axiosInstance.get('/liens/types');
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
                const response = await axiosInstance.get('/membres/tous');
                setMembers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des membres', error);
            }
        };
        fetchMembers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Récupérer l'ID de l'utilisateur connecté

        try {
            const response = await axiosInstance.post('/membres/ajouter', {
                prenom: firstName,
                token: token, // Utiliser l'ID de l'utilisateur connecté
                nom: lastName,
                date_de_naissance: dateNaissance,
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

            console.log('Réponse du serveur:', response);

            alert('Ajout réussie!');
            setMessage('Ajout réussie! Vous avez maintenant un nouveau membre.');
            resetForm();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
            setMessage(errorMessage);
            console.log(error);
        }
    };

    const handleCancel = () => {
        resetForm();
        // Rediriger vers une autre page, par exemple la page d'accueil
        navigate('/home');
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setDateNaissance('');
        setPereName('');
        setMereName('');
        setIsMarried('');
        setGender('');
        setReligion('');
        setBloodGroup('');
        setElectrophoresis('');
        setSignFA('');
        setConjointName('');
        setSelectedLinkType('');
        setMetier('');
        setMessage('');
    };

    return (
        <div className="register-member-container">
            <h2>Ajouter un membre</h2>
            {message && <p>{message}</p>}
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
                            <option value="Feminin">Feminin</option>
                            <option value="Autre">Autre</option>
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
                            {members.map((member) => (
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
                            {members.map((member) => (
                                <option key={member._id} value={member._id}>
                                    {member.prenom} {member.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Autres informations</legend>
                    <div>
                        <label>Type de lien :</label>
                        <select
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
                        </select>
                    </div>
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
                            <input
                                type="text"
                                value={conjointName}
                                onChange={(e) => setConjointName(e.target.value)}
                                required
                            />
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
        </div>
    );
};

export default AddMember;
