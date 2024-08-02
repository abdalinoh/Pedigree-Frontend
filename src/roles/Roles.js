// src/roles/Roles.js

const Roles = [
    {
      role: { id: "ADMIN", name: 'Role Administrateur' },
      permissions: [
        { id: 'add_members', name: 'Ajouter un membre' },
        { id: 'death_declaration', name: 'Déclaration de décès' },
        { id: 'update_info', name: 'Modifier les informations des membres' },
        { id: 'overview', name: 'Consulter les informations des membres' }
      ]
    },
    {
      role: { id: "USER", name: 'Role Utilisateur' },
      permissions: [
        { id: 'add_members', name: 'Ajouter un membre' },
        { id: 'view_profile', name: 'Consulter son profil' },
        { id: 'view_common_info', name: 'Voir certains détails des membres' },
        { id: 'modify_myinfo', name: 'Modifier ses informations' }
      ]
    }
  ];
  
  export default Roles;