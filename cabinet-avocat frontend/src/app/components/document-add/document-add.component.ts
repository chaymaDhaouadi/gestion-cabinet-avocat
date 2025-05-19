import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-document-add',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    HttpClientModule,],
  templateUrl: './document-add.component.html',
  styleUrls: ['./document-add.component.css']
})
export class DocumentAddComponent {
  form: FormGroup;
  file: File | null = null;
  dossiers: any[] = [];
  factures: any[] = [];
  selectedFacture: any = null; // Facture sélectionnée par l'utilisateur

  constructor(private fb: FormBuilder, private http: HttpClient,
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nom_fichier: ['', Validators.required],
      type: ['', Validators.required],
      dossier_id: ['', Validators.required],
      facture_id: ['', Validators.required],  // Ajout du champ pour la facture
    });

    this.loadDossiers();
    this.loadFactures();  // Charger les factures
  }

  loadDossiers() {
    this.http.get<any[]>('http://localhost:3000/api/dossiers').subscribe(data => {
      this.dossiers = data;
    });
  }

  loadFactures() {
    this.http.get<any[]>('http://localhost:3000/api/factures').subscribe(data => {
      this.factures = data;
    });
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.file = event.dataTransfer.files[0];
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFactureSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const factureId = selectElement.value;

    this.selectedFacture = this.factures.find(f => f._id === factureId) || null;
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params['dossierId']) {
        this.form.patchValue({ dossier_id: params['dossierId'] });
      }
    });
  }

  Submit() {
    if (!this.form.valid || !this.file) {
      alert('Veuillez remplir tous les champs et sélectionner un fichier');
      return;
    }

    const formData = new FormData();
    formData.append('nom_fichier', this.form.value.nom_fichier);
    formData.append('type', this.form.value.type);
    formData.append('dossier_id', this.form.value.dossier_id);
    if (this.form.value.facture_id) {
      formData.append('facture_id', this.form.value.facture_id);
    }
    formData.append('file', this.file);

    this.documentService.uploadDocument(formData).subscribe({
      next: () => {
        alert('Document ajouté avec succès');
        // Redirection vers la liste des documents liés au dossier
        setTimeout(() => {
          this.router.navigate(['/document/list']);
        },)
      },
      error: (err: any[]) => {
        console.error('Erreur ajout document:', err);
        alert('Erreur lors de l’ajout');
      }
    });
  }
}