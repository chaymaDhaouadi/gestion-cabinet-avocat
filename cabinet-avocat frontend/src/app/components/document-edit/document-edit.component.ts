import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';
import { DossierService } from '../../services/dossier-service.service';
import { FactureService } from '../../services/facture.service';

@Component({
  selector: 'app-document-edit',
  standalone: true,
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class DocumentEditComponent implements OnInit {
  form!: FormGroup;
  documentId!: string;
  dossiers: any[] = [];
  factures: any[] = [];
  selectedFacture: any = null;
  selectedDossier: any = null;
  factureMontant: number | null = null;
  factureNumero: string | null = null;

  file: File | null = null;
  document: any = null; // pour afficher dans le HTML
  clientNom: string = '';
  clientCin: string = '';
  dossierTitre: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private dossierService: DossierService,
    private factureService: FactureService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.documentId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Document ID:', this.documentId); // ✅ Assure-toi que l'ID est correct

    this.form = this.fb.group({
      nom_fichier: ['', Validators.required],
      type: ['', Validators.required],
      dossier_id: [''],
      facture_id: ['']
    });

    this.loadFactures(() => {
      this.loadAllDossiers(() => {
        this.loadDocumentData();
      });
    });
  }


  loadFactures(callback?: () => void): void {
    this.factureService.getFactures().subscribe((factures: any[]) => {
      this.factures = factures;
      if (callback) callback();
    });
  }

  loadAllDossiers(callback?: () => void): void {
    this.dossierService.getAllDossiers().subscribe((dossiers: any[]) => {
      this.dossiers = dossiers;
      if (callback) callback();
    });
  }

  loadDocumentData(): void {
    this.documentService.getDocumentById(this.documentId).subscribe((document: any) => {
      console.log('Document chargé :', document); // ✅ Vérifie si les données sont bien reçues
      this.document = document;

      // Remplir le formulaire avec les valeurs récupérées
      this.form.patchValue({
        nom_fichier: document.nom_fichier || '',
        type: document.type || '',
        dossier_id: document.dossier_id?._id || '',
        facture_id: typeof document.facture_id === 'string'
          ? document.facture_id
          : document.facture_id?._id || ''
      });

      console.log('Formulaire patché :', this.form.value); // ✅ Vérifie les valeurs patchées
    });
  }


  onFactureSelected(event: any): void {
    const selectedId = event.target.value;
    const selectedFacture = this.factures.find(f => f._id === selectedId);

    if (selectedFacture) {
      this.factureMontant = selectedFacture.montant;
      this.factureNumero = selectedFacture.numeroFacture;
    } else {
      this.factureMontant = null;
      this.factureNumero = null;
    }
  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.file = file;
    }
  }

  onDragOver(event: Event): void {
    event.preventDefault();
  }

  updateDocument(): void {
    if (this.form.invalid) {
      console.warn('Formulaire invalide');
      return;
    }

    const formData = this.form.value;

    const payload = new FormData();
    payload.append('nom_fichier', formData.nom_fichier);
    payload.append('type', formData.type);
    payload.append('dossier_id', formData.dossier_id);
    payload.append('facture_id', formData.facture_id);
    if (this.file) {
      payload.append('file', this.file);
    }

    this.documentService.updateDocument(this.documentId, payload).subscribe({
      next: (res) => {
        console.log('Document mis à jour', res);
        setTimeout(() => {
          this.router.navigate(['/document/list']);
        });
      },
      error: (err) => {
        console.error('Erreur de mise à jour', err);
      }
    });
  }
}
