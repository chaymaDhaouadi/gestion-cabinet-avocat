import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatExpansionModule, MatButtonModule],
  templateUrl: './document-list.component.html'
})
export class DocumentListComponent implements OnInit {
  documents: any[] = [];
  dossierId: string | null = null;
  documentStates: boolean[] = []; // Pour gérer l'état (ouvert/fermé) de chaque document

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.dossierId = params.get('dossierId');
      console.log("Dossier ID récupéré:", this.dossierId);
      this.loadDocuments();
    });
  }


  // Charger les documents selon le dossier (ou tous si pas de dossier spécifié)
  loadDocuments() {
    if (this.dossierId) {
      this.documentService.getDocumentsByDossier(this.dossierId!).subscribe({
        next: (data) => {
          console.log("Documents récupérés:", data); // ✅ Ajouté pour voir les documents

          this.documents = data;
          this.documentStates = new Array(this.documents.length).fill(false);

          // Charger les informations du dossier (nom et numéro)
          this.documentService.getDossierDetails(this.dossierId!).subscribe({
            next: (dossier: any) => {
              console.log("Dossier récupéré:", dossier); // ✅ Ajouté pour voir le dossier

              this.documents.forEach(doc => {
                doc.nom_dossier = dossier.titre_dossier;
                doc.numero_dossier = dossier.numero_affaire;
              });
            },
            error: (err: any) => console.error('Erreur de chargement des détails du dossier', err)
          });
        },
        error: (err: any) => console.error('Erreur de chargement des documents', err)
      });
    } else {
      this.documentService.getAllDocuments().subscribe({
        next: (data) => {
          this.documents = data;
          this.documentStates = new Array(this.documents.length).fill(false);
        },
        error: (err: any) => console.error('Erreur de chargement des documents', err)
      });
    }
  }

  // Afficher ou cacher les détails d'un document
  toggleDocument(index: number) {
    this.documentStates[index] = !this.documentStates[index];
  }

  // Télécharger un document
  telechargerDocument(fichierUrl: string) {
    const url = fichierUrl.startsWith('http') ? fichierUrl : `http://localhost:3000/${fichierUrl}`;
    window.open(url, '_blank');
  }
  voirDetailsDossier(dossierId: string) {
    if (dossierId) {
      this.router.navigate(['/dossiers/details', dossierId]);
    } else {
      console.error("Aucun ID de dossier trouvé");
    }
  }



  // Modifier un document
  modifierDocument(id: string) {
    this.router.navigate(['/document/edit', id]);
  }

  // Supprimer un document
  supprimerDocument(documentId: string) {
    if (confirm('❗ Voulez-vous vraiment supprimer ce document ?')) {
      this.documentService.deleteDocument(documentId).subscribe({
        next: () => {
          this.documents = this.documents.filter(doc => doc._id !== documentId);
          alert("✅ Document supprimé avec succès !");
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          alert("❌ Erreur lors de la suppression du document.");
        }
      });
    }
  }
}
