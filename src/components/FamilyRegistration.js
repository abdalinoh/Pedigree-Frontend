import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, MenuItem, CircularProgress, Link } from '@mui/material';
import countries from '../data/countries.json';
import { useFamily } from '../context/FamilyContext';

const FamilyRegistration = ({ onRegister, onFamilyName, setnewFamille}) => {
  const [family_name, setFamilyName] = useState('');
  const [country, setCountry] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [village, setVillage] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // État pour suivre si le bouton a été cliqué
  const [showLoginLink, setShowLoginLink] = useState(false); // État pour afficher le lien de connexion
  const { setFamilyData } = useFamily();

  const HOST = "http://192.168.86.129:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsClicked(true); // Marquer le bouton comme cliqué

    try {
      // Vérifiez si la famille existe déjà
      const response = await axios.post(`${HOST}/api/Familly/create`, {
        family_name,
        country,
        ethnicity,
        village
      });

      const { fam_exist, idFamille } = response.data;

      if (fam_exist) {
        // La famille existe déjà
        setMessage('La famille existe déjà ! Vous pouvez maintenant vous inscrire.');
        setMessageType('error');
        setCountry('');
        setEthnicity('');
        setVillage('');
        onFamilyName(family_name);
        setFamilyData({ family_name, idFamille, fam_exist });
        setShowLoginLink(true); // Afficher le lien de connexion
        if (onRegister) {
          onRegister(true); // Passer à l'étape suivante
        }
      } else {
        // La famille n'existe pas, enregistrer la nouvelle famille
        setMessage('Famille enregistrée avec succès ! Vous pouvez maintenant vous inscrire.');
        setMessageType('success');
        if (onRegister) {
          onRegister(true); // Passer à l'étape suivante après enregistrement
        }
        setFamilyData({ family_name, idFamille, fam_exist });
        setnewFamille(response.data.newFamille);
        onFamilyName(family_name); // Conserver le nom de famille
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'enregistrement de la famille.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', margin: 'auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Enregistrement de la Famille
      </Typography>
      {message && (
        <Typography variant="body1" color={messageType === 'success' ? 'green' : 'red'} gutterBottom>
          {message}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom de la famille"
          value={family_name}
          onChange={(e) => setFamilyName(e.target.value)}
          required
          fullWidth
          margin="normal"
          disabled={isSubmitting}
        />
        <TextField
          select
          label="Pays"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          fullWidth
          margin="normal"
          disabled={isSubmitting}
        >
          {countries.map((country) => (
            <MenuItem key={country.name} value={country.name}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Ethnicité"
          value={ethnicity}
          onChange={(e) => setEthnicity(e.target.value)}
          required
          fullWidth
          margin="normal"
          disabled={isSubmitting}
        />
        <TextField
          label="Village"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          required
          fullWidth
          margin="normal"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={isSubmitting || isClicked} // Désactiver le bouton si soumis ou déjà cliqué
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {isSubmitting ? <CircularProgress size={24} sx={{ mr: 1 }} /> : 'Enregistrer la famille'}
        </Button>
      </form>
      {showLoginLink && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Vous avez déjà un compte ? <Link href="/login">Se connecter</Link>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FamilyRegistration;