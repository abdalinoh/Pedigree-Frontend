// src/context/FamilyContext.js
import React, { createContext, useState, useContext } from 'react';

// Créer le contexte
const FamilyContext = createContext();

// Créer le provider
export const FamilyProvider = ({ children }) => {
  const [familyData, setFamilyData] = useState({
    family_name: '',
    idFamille: null,
    fam_exist: null,
    // Ajoutez d'autres données de famille ici si nécessaire
  });

  return (
    <FamilyContext.Provider value={{ familyData, setFamilyData }}>
      {children}
    </FamilyContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useFamily = () => {
  return useContext(FamilyContext);
};