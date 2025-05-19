import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = 'http://localhost:3000/api/documents';
  private dossierApiUrl = 'http://localhost:3000/api/dossiers';

  constructor(private http: HttpClient) { }

  getAllDossiers(): Observable<any[]> {
    return this.http.get<any[]>(this.dossierApiUrl);
  }

  getDocumentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateDocument(id: string, documentData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, documentData);
  }

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getDocumentsByDossier(dossierId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dossier/${dossierId}`);
  }

  deleteDocument(documentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${documentId}`);
  }

  getAllDocuments(): Observable<any[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }
  getDossierDetails(dossierId: string) {
    return this.http.get<any>(`http://localhost:3000/api/dossiers/${dossierId}`);
  }

}
