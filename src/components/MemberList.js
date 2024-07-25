import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import DataTable from 'react-data-table-component';
import moment from 'moment';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook pour la navigation

  const columns = [
    {
      name: 'Nom',
      selector: row => row.nom,
    },
    {
      name: 'Prénom',
      selector: row => row.prenom,
    },
    {
      name: 'Date de Naissance',
      selector: row => moment(row.date_de_naissance).format("DD/MM/YYYY"),
    },
    {
      name: 'Profession',
      selector: row => row.profession,
    },
    {
      name: 'Religion',
      selector: row => row.religion,
    },
    {
      name: 'Conjoint',
      selector: row => row.conjoint,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button
            onClick={() => handleEdit(row)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              margin: '0 5px',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            Modifier
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              margin: '0 5px',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get('/membres/tous');
        if (response.data.length === 0) {
          setError('Aucun membre n\'est encore ajouté.');
        } else {
          setMembers(response.data);
        }
      } catch (error) {
        setError('Erreur lors de la récupération des membres.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleGoHome = () => {
    navigate('/home'); // Redirige vers la page d'accueil
  };

  const handleEdit = (membre) => {
    navigate(`/modifier/${membre._id}`); // Redirige vers la page de modification
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      try {
        await axiosInstance.delete(`/membres/${id}`);
        setMembers(members.filter(member => member._id !== id));
        alert('Membre supprimé avec succès.');
      } catch (error) {
        alert('Erreur lors de la suppression du membre.');
      }
    }
  };

  if (loading) {
    return <p>Chargement des membres...</p>;
  }

  return (
    <div className="member-list-container">
      <h2>Liste des Membres</h2>
      <button onClick={handleGoHome}>Retour à l'accueil</button> {/* Bouton de retour */}
      {error && <p>{error}</p>}
      <DataTable
        columns={columns}
        data={members}
        noDataComponent={<div>Aucun membre trouvé</div>}
      />
    </div>
  );
};

export default MemberList;