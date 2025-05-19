// src/app/services/client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  _id?: string;
  cin: number;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:3000/api/clients';

  constructor(private http: HttpClient) { }
  addClient(client: Client): Observable<Client> {
    console.log('➡️ Données envoyées :', client);
    return this.http.post<Client>(this.apiUrl, client);
  }


  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  // Vérifier l'unicité du CIN
  getClientByCIN(cin: number) {
    return this.http.get<Client>(`${this.apiUrl}/cin/${cin}`);
  }


  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateClient(id: string, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }
}
