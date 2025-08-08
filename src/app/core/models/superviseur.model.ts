type DbId = string;
export interface ISuperviseur {
  id?: DbId;
  nom: string;
  prenom: string;
  emailProfessionnel: string;
  telephoneProfessionnel?: string;
  titrePoste?: string;
  departementId: DbId; // Lien vers le Département (ID)
  userId?: DbId; // Lien optionnel vers un compte Utilisateur si la gestion des logins est séparée
}
