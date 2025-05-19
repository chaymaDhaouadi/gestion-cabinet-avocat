import { Component, OnInit } from "@angular/core";
import { DossierService } from "../../services/dossier-service.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DocumentService } from "../../services/document.service";

@Component({
  selector: 'app-dossier-list',
  standalone: true,
  imports: [CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule // utile pour `ActivatedRoute`
  ],
  templateUrl: './dossier-list-component.component.html',
  styleUrls: ['./dossier-list-component.component.css']
})
export class DossierListComponentComponent implements OnInit {
  dossiers: any[] = [];
  filteredDossiers: any[] = [];
  searchTerm: string = '';
  selectedDossierId: string = '';
  documents: any[] = [];

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDossiers();
  }

  loadDossiers(): void {
    this.http.get<any[]>('http://localhost:3000/api/dossiers').subscribe({
      next: (data: any[]) => {
        this.dossiers = data;
        this.filteredDossiers = this.dossiers; // Initialiser la liste filtrée
        console.log('Dossiers chargés :', this.dossiers);
      },
      error: (err: any[]) => {
        console.error('Erreur chargement des dossiers', err);
      }
    });
  }
  onDossierSelected(dossierId: string) {
    this.selectedDossierId = dossierId;
    this.loadDocumentsByDossier(dossierId);
  }

  loadDocumentsByDossier(dossierId: string) {
    this.documentService.getDocumentsByDossier(dossierId).subscribe({
      next: (data) => this.documents = data,
      error: (err) => console.error('Erreur de chargement des documents', err)
    });
  }

  ajouterDocument() {
    if (!this.selectedDossierId) {
      alert("Veuillez sélectionner un dossier.");
      return;
    }

    this.router.navigate(['/document/add'], { queryParams: { dossier_id: this.selectedDossierId } });
  }
  filterDossiers(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredDossiers = this.dossiers.filter(dossier =>
      dossier.numero_affaire?.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredDossiers = this.dossiers; // Réinitialiser la liste filtrée
  }

  voirDetailsDossier(dossierId: string): void {
    this.router.navigate(['/dossiers/details', dossierId]);
  }

  onDelete(id: string) {
    const confirmation = confirm("Es-tu sûre de vouloir supprimer ce dossier ?");
    if (confirmation) {
      this.http.delete(`http://localhost:3000/api/dossiers/${id}`).subscribe({
        next: () => {
          alert('Dossier supprimé avec succès');
          this.loadDossiers(); // recharge la liste
        },
        error: err => {
          console.error('Erreur suppression', err);
          alert("Erreur lors de la suppression");
        }
      });
    }
  }


  onEdit(id: string): void {
    this.router.navigate(['/modifier-dossier', id]);
  }


}
