// models/rendezvous.model.ts
export interface Client {
    _id: string;
    nom: string;
    email?: string;
    telephone?: string;
}

export interface RendezVous {
    _id?: string;
    titre: string;
    date: string;
    heure: string;
    lieu?: string;
    notes?: string;
    statut?: string;
    clientId?: Client; // Utilise 'Client' comme type pour client_id
}
export interface RdvCheckResponse {
  error?: string;  // Si l'heure ou la date est déjà prise
  success?: boolean; // Ou un champ de succès
}

