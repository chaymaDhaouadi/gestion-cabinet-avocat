import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
export interface Tribunal {
  _id: string;
  nom: string;
  categorie: string; // محاكم قضائية, المحاكم الابتدائية, محاكم الاستئناف
  adresse: string;
  contact: {
    telephone: string;
    email: string;
  };
}
@Injectable({
  providedIn: 'root'
})
export class DossierService {
  private apiUrl = 'http://localhost:3000/api/dossiers';

  constructor(private http: HttpClient) { }
  getAllDossiers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  // Ajouter un dossier
  addDossier(dossier: any) {
    return this.http.post(this.apiUrl, dossier);
  }

  // Obtenir les dossiers d'un client
  // dossier-service.service.ts
  getDossiers(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/dossiers/client/${clientId}`);
  }
  // dossier.service.ts
  getTribunaux(): Observable<Tribunal[]> {
    return this.http.get<Tribunal[]>('http://localhost:3000/api/tribunaux');
  }
  getDossierWithFactures(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
