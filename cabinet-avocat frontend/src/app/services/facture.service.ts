import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {


  private apiUrl = 'http://localhost:3000/api/factures';
  constructor(private http: HttpClient) { }

  // Créer une facture

  addFacture(facture: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, facture);
  }

  getFactures(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteFacture(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
