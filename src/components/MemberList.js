import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosSetup';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { Box, MenuItem, FormControl, Select, InputLabel, Typography, CircularProgress, Button } from '@mui/material';
import Roles from '../roles/Roles'; // Importer le fichier des rôles
import { useFamily } from '../context/FamilyContext'; // Importer le contexte de famille

const MemberList = () => {
  const { familyData } = useFamily(); // Utilisation du contexte Family
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
      selector: row => row.familyData.family_name,
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
            <Button
              onClick={() => handleDetail(row._id)}
              variant="contained"
              color="info"
              size="small"
              sx={{ mr: 1 }}
            >
              Détail
            </Button>
          )}
          {role && getRolePermissions(role.id).some(permission => permission.id === 'update_info') && (
            <Button
              onClick={() => handleEdit(row)}
              variant="contained"
              color="primary"
              size="small"
            >
              Modifier
            </Button>
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
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Liste des Membres de la famille {familyData.family_name || 'Non spécifiée'}
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {error && <Typography color="error">{error}</Typography>}
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
            noDataComponent={<Typography>Aucun membre trouvé</Typography>}
          />
        </>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleGoHome}
        sx={{ mt: 2 }}
      >
        Retour à l'accueil
      </Button>
    </Box>
  );
};

export default MemberList;