type DbId = string;

export interface IStage {
  id?: DbId;
  stagiaireId: DbId; // Lien vers le Stagiaire (ID)
  departementId: DbId; // Lien vers le Département (ID)
  superviseurId: DbId; // Lien vers le Superviseur (ID)
  dateDebut: string; // Date au format string (ex: 'YYYY-MM-DD') ou type Date
  dateFin: string; // Date au format string (ex: 'YYYY-MM-DD') ou type Date
  typeStageId: DbId; // Lien vers la collection de lookup TypeStage (ID)
  statutStageId: DbId; // Lien vers la collection de lookup StatutStage (ID)
  objectifs?: string;
  descriptionTaches?: string;
  remuneration?: number; // Montant ou 0 si non rémunéré
  // Si besoin de stocker les IDs des documents/évaluations directement ici (moins courant pour beaucoup d'éléments)
  // documentIds?: DbId[];
  // evaluationIds?: DbId[];
}
