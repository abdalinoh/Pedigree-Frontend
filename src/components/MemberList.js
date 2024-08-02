import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { Box, MenuItem, FormControl, Select, InputLabel, Typography, CircularProgress } from '@mui/material';
import Roles from '../roles/Roles'; // Importer le fichier des rôles

const MemberList = () => {
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSex, setSelectedSex] = useState('');
  const [role, setRole] = useState(null); // Rôle de l'utilisateur
  const navigate = useNavigate();

  // Obtenir le rôle de l'utilisateur et définir les permissions
  const getRolePermissions = (roleId) => {
    const roleConfig = Roles.find(role => role.role.id === roleId);
    return roleConfig ? roleConfig.permissions : [];
  };

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
          {role && getRolePermissions(role.id).some(permission => permission.id === 'overview') && (
            <button
              onClick={() => handleDetail(row._id)}
              className="btn btn-info"
            >
              Détail
            </button>
          )}
          {role && getRolePermissions(role.id).some(permission => permission.id === 'update_info') && (
            <button
              onClick={() => handleEdit(row)}
              className="btn btn-primary"
            >
              Modifier
            </button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/recuperer/${selectedSex}`);
        if (response.data.length === 0) {
          setError('Aucun membre trouvé.');
        } else {
          setFilteredMembers(response.data);
        }
      } catch (error) {
        setError('Erreur lors de la récupération des membres.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [selectedSex]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get('/All-Permision'); // Endpoint pour obtenir le rôle de l'utilisateur
        setRole(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle', error);
      }
    };

    fetchUserRole();
  }, []);

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleEdit = (membre) => {
    navigate(`/modifier/${membre._id}`);
  };

  const handleDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  const handleSexChange = (event) => {
    setSelectedSex(event.target.value);
  };

  return (
    <div className="member-list-container">
      <Typography variant="h6">Liste des Membres</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {error && <p>{error}</p>}
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sexe</InputLabel>
              <Select
                value={selectedSex}
                onChange={handleSexChange}
                label="Sexe"
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Masculin">Masculin</MenuItem>
                <MenuItem value="Féminin">Féminin</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <DataTable
            columns={columns}
            data={filteredMembers}
            noDataComponent={<div>Aucun membre trouvé</div>}
          />
        </>
      )}
      <button 
        className="btn btn-secondary btn-go-home"
        onClick={handleGoHome}
      >
        Retour à l'accueil
      </button>
    </div>
  );
};

export default MemberList;