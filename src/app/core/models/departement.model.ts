type DbId = string;
export interface IDepartement {
  id?: DbId;
  nom: string;
  description?: string;
  chefDepartementId?: DbId; // Lien optionnel vers un Utilisateur ou Superviseur (ID)
}
