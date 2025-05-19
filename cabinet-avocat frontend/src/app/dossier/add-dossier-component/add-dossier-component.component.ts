import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DossierService } from '../../services/dossier-service.service';

@Component({
  selector: 'app-dossier-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './add-dossier-component.component.html'
})
export class DossierAddComponent implements OnInit {
  dossierForm: FormGroup;
  clients: any[] = [];
  tribunaux: any[] = [];
  numeroExiste: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private dossierService: DossierService
  ) {
    this.dossierForm = this.fb.group({
      numero_affaire: ['', Validators.required],
      titre_dossier: ['', Validators.required],
      description: [''],
      type_dossier: ['', Validators.required],
      date_ouverture: ['', Validators.required],
      statut: ['', Validators.required],
      client_id: ['', Validators.required],
      tribunal_id: ['', Validators.required] // Ajout du champ tribunal_id
    });
  }

  ngOnInit() {
    this.loadClients();
    this.loadTribunaux();
  }

  loadClients() {
    this.http.get<any[]>('http://localhost:3000/api/clients').subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Erreur chargement clients', err)
    });
  }

  loadTribunaux() {
    this.dossierService.getTribunaux().subscribe({
      next: (data) => this.tribunaux = data,
      error: (err) => console.error('Erreur chargement tribunaux', err)
    });
  }
  checkNumeroAffaire() {
    const numeroAffaire = this.dossierForm.get('numero_affaire')?.value;

    if (numeroAffaire) {
      this.http.get<boolean>(`http://localhost:3000/api/dossiers/check-numero/${numeroAffaire}`)
        .subscribe({
          next: (exists) => {
            this.numeroExiste = exists;
          },
          error: (err) => {
            console.error("Erreur lors de la vérification du numéro d'affaire:", err);
            this.numeroExiste = false;
          }
        });
    } else {
      this.numeroExiste = false; // Si le champ est vide, aucun message
    }
  }
  onSubmit() {
    if (this.dossierForm.valid) {
      if (this.numeroExiste) {
        alert("❌ Le numéro d'affaire existe déjà. Veuillez en choisir un autre.");
        return;
      }

      this.http.post('http://localhost:3000/api/dossiers', this.dossierForm.value).subscribe({
        next: () => {
          alert('✅ Dossier ajouté avec succès');
          this.router.navigate(['/dossiers/list']);
        },
        error: (err) => {
          if (err.status === 400 && err.error.message.includes("existe déjà")) {
            alert("❌ Ce numéro d'affaire existe déjà. Veuillez en choisir un autre.");
          } else {
            alert("❌ Erreur lors de l'ajout du dossier.");
          }
        }
      });
    } else {
      alert('❌ Formulaire invalide');
    }
  }

}
