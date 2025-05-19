import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { DossierService } from '../../services/dossier-service.service';

@Component({
  selector: 'app-modifier-dossier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './modifier-dossier.component.html'
})
export class ModifierDossierComponent implements OnInit {
  dossierForm: FormGroup;
  clients: any[] = [];
  dossierId: string = '';
  tribunaux: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private clientService: ClientService,
    private dossierService: DossierService
  ) {
    this.dossierForm = this.fb.group({
      numero_affaire: ['', Validators.required],
      titre_dossier: ['', Validators.required],
      description: [''],
      type_dossier: ['', Validators.required],
      date_ouverture: ['', Validators.required],
      statut: ['', Validators.required],
      client_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.dossierId = this.route.snapshot.paramMap.get('id')!;
    this.loadClients();
    this.loadDossier();
    this.loadTribunaux();

  }
  loadTribunaux() {
    this.dossierService.getTribunaux().subscribe((data) => {
      this.tribunaux = data;
    });
  }
  loadClients() {
    this.clientService.getClients().subscribe({
      next: (res: any[]) => {
        this.clients = res;
      },
      error: (err) => {
        console.error('Erreur chargement clients', err);
      }
    });
  }

  loadDossier() {
    this.http.get<any>(`http://localhost:3000/api/dossiers/${this.dossierId}`).subscribe({
      next: (dossier) => {
        this.dossierForm.patchValue({
          numero_affaire: dossier.numero_affaire,
          titre_dossier: dossier.titre_dossier,
          description: dossier.description,
          type_dossier: dossier.type_dossier,
          date_ouverture: dossier.date_ouverture?.substring(0, 10),
          statut: dossier.statut,
          client_id: dossier.client_id?._id || ''  // Sécurité si jamais null
        });
      },
      error: (err) => {
        console.error('Erreur chargement dossier', err);
        alert('Impossible de charger le dossier');
      }
    });
  }

  onSubmit(): void {
    if (this.dossierForm.valid) {
      this.http.put(`http://localhost:3000/api/dossiers/${this.dossierId}`, this.dossierForm.value).subscribe({
        next: () => {
          alert('Dossier modifié avec succès');
          this.router.navigate(['/dossiers/list']);
        },
        error: (err) => {
          console.error('Erreur modification dossier', err);
          alert('Erreur lors de la modification');
        }
      });
    } else {
      alert('Formulaire invalide');
    }
  }
}
