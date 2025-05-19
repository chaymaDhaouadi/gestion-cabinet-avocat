// audience.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AudienceService {
  constructor(private http: HttpClient) {}

  getAudiencesByDossier(dossierId: string) {
    return this.http.get<any[]>(`http://localhost:3000/api/audiences/dossier/${dossierId}`);
  }
  addAudience(audienceData: any) {
    return this.http.post(`http://localhost:3000/api/audiences`, audienceData);
  }
  
}
