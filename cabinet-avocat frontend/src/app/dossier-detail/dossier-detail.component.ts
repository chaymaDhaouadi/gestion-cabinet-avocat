import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DossierService } from '../services/dossier-service.service';

@Component({
  selector: 'app-dossier-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dossier-detail.component.html',
  styleUrls: ['./dossier-detail.component.css']
})
export class DossierDetailComponent implements OnInit {
  dossier: any;
  documents: any[] = [];
  factures: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private dossierService: DossierService
  ) { }

  ngOnInit(): void {
    const dossierId = this.route.snapshot.paramMap.get('id');
    if (dossierId) {
      this.chargerDossier(dossierId);
      this.chargerDocuments(dossierId);
    }
  }

  // ✅ Charger les détails du dossier avec les informations client
  chargerDossier(dossierId: string) {
    this.http.get<any>(`http://localhost:3000/api/dossiers/${dossierId}`).subscribe({
      next: (data) => {
        this.dossier = data;
        if (this.dossier.client_id) {
          this.chargerFacturesClient(this.dossier.client_id._id);
        }
        if (this.dossier.tribunal_id) {
          this.chargerTribunal(this.dossier.tribunal_id);
        }
      },
      error: (err) => console.error('Erreur de chargement du dossier', err)
    });
  }

  // ✅ Charger les informations du tribunal
  chargerTribunal(tribunalId: string) {
    this.http.get<any>(`http://localhost:3000/api/tribunaux/${tribunalId}`).subscribe({
      next: (tribunal) => this.dossier.tribunal_id = tribunal,
      error: (err) => console.error('Erreur de chargement du tribunal', err)
    });
  }

  // ✅ Charger les documents du dossier
  chargerDocuments(dossierId: string) {
    this.http.get<any[]>(`http://localhost:3000/api/documents/dossier/${dossierId}`).subscribe({
      next: (data) => this.documents = data,
      error: (err) => console.error('Erreur de chargement des documents', err)
    });
  }

  // ✅ Charger les factures liées au client du dossier
  chargerFacturesClient(clientId: string) {
    this.http.get<any[]>(`http://localhost:3000/api/factures/client/${clientId}`).subscribe({
      next: (data) => this.factures = data,
      error: (err) => console.error('Erreur de chargement des factures', err)
    });
  }
}
