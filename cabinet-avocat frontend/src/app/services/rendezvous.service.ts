import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// src/app/services/rendezvous.service.ts
import { RendezVous } from '../models/rendezvous.model';
import { RdvCheckResponse } from '../models/rendezvous.model'; // Importe l'interface



@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private apiUrl = 'http://localhost:3000/api/rendezvous';

  constructor(private http: HttpClient) { }
  // src/app/services/rendezvous.service.ts
  addGoogleCalendarEvent(rdv: any) {
    return this.http.post('http://localhost:3000/api/google/create-event', rdv);
  }

  // Vérification des rendez-vous avant envoi
  checkRdvAvailability(date: string, heure: string): Observable<RdvCheckResponse> {
    return this.http.get<RdvCheckResponse>(`${this.apiUrl}/check?date=${date}&heure=${heure}`);
  }

  addRendezVous(rdv: any) {
    return this.http.post(this.apiUrl, rdv);
  }


  updateRendezVous(id: string, rdvData: any) {
    return this.http.put<RendezVous>(`http://localhost:3000/api/rendezvous/${id}`, rdvData);
  }


  getAll(): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(this.apiUrl);
  }
  deleteRendezVous(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


}
