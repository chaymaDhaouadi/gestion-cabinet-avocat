import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TribunalService {
  private apiUrl = 'http://localhost:3000/api/tribunaux';

  constructor(private http: HttpClient) { }

  addTribunal(tribunal: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tribunal);
  }
  getTribunaux(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteTribunal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getTribunalById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  updateTribunal(id: string, tribunal: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tribunal);
  }
}
