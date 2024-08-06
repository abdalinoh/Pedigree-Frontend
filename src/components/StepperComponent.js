import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography } from '@mui/material';
import FamilyRegistration from './FamilyRegistration';
import Register from './register'; // Assurez-vous que le nom du fichier est correct
import Login from './Login';

const steps = ['Enregistrement de la Famille', 'Inscription', 'Connexion'];

const StepperComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isFamilyRegistered, setIsFamilyRegistered] = useState(false);
  const [isMemberRegistered, setIsMemberRegistered] = useState(false);
  const [familyName, setFamilyName] = useState(''); // État pour stocker le nom de famille
  const [newFamille, setnewFamille] = useState(); // État pour stocker le nom de famille

  const handleNext = () => {
    if (activeStep === 0 && isFamilyRegistered) {
      setActiveStep((prevStep) => prevStep + 1);
    } else if (activeStep === 1 && isMemberRegistered) {
      setActiveStep((prevStep) => prevStep + 1);
    } else if (activeStep === 2) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setIsFamilyRegistered(false);
    setIsMemberRegistered(false);
    setFamilyName(''); // Réinitialiser le nom de famille
  };

  return (
    <Box sx={{ width: '100%', padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3 }}>
        {activeStep === 0 && (
          <FamilyRegistration 
            onRegister={(success) => {
              if (success) {
                setIsFamilyRegistered(true);
                handleNext(); // Passe à l'étape suivante si l'enregistrement est réussi ou la famille existe déjà
              } else {
                setIsFamilyRegistered(false);
              }
            }} 
            onFamilyName={(name) => setFamilyName(name)} // Conserver le nom de famille
            setnewFamille={setnewFamille}
          />
        )}
        {activeStep === 1 && (
          <Register familyName={familyName} newFamille={newFamille} onRegister={() => setIsMemberRegistered(true)} />
        )}
        {activeStep === 2 && <Login onLogin={() => setIsMemberRegistered(true)} />}
        {activeStep === steps.length && (
          <div>
            <Typography variant="h6">Toutes les étapes sont complètes</Typography>
            <Button onClick={handleReset} variant="contained" color="primary" sx={{ mt: 3 }}>
              Réinitialiser
            </Button>
          </div>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          {activeStep > 0 && (
            <Button 
              onClick={handleBack} 
              sx={{ 
                mt: 1, 
                mr: 1,
                color: 'text.primary', // Couleur du texte
                backgroundColor: 'background.paper', // Couleur de fond
                '&:hover': {
                  backgroundColor: 'grey.300', // Couleur de fond au survol
                  color: 'text.secondary', // Couleur du texte au survol
                }
              }}
            >
              Précédent
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ mt: 1 }}
            disabled={(activeStep === 0 && !isFamilyRegistered) || (activeStep === 1 && !isMemberRegistered)}
          >
            {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StepperComponent;