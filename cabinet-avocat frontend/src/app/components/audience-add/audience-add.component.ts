import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AudienceService } from '../../services/audience.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-audience-add',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule // ✅ pour que `formGroup` fonctionne
  ],
  templateUrl: './audience-add.component.html'
})
export class AudienceAddComponent {
  audienceForm: FormGroup;

  dossiers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private audienceService: AudienceService,
    private http: HttpClient // ✅ ici c’est bon maintenant
  ) {
    this.audienceForm = this.fb.group({
      dossier_id: ['', Validators.nullValidator], // Pas de validation obligatoire
      date_audience: ['', Validators.required],
      lieu: ['', Validators.required],
      resume: ['', Validators.required],
      resultat: ['']
    });
    this.loadDossiers();
  }
    loadDossiers() {
      this.http.get<any[]>('http://localhost:3000/api/dossiers').subscribe({
        next: data => this.dossiers = data,
        error: err => console.error('Erreur chargement dossiers', err)
      });
      
    }
    onSubmit() {
      console.log('Formulaire soumis', this.audienceForm.value); // Log des données du formulaire
      const formData = this.audienceForm.value;

      if (formData.dossier_id === '') {
        formData.dossier_id = null;
      }
      
      if (this.audienceForm.valid) {
        this.audienceService.addAudience(this.audienceForm.value).subscribe({
          next: res => {
            alert('Audience ajoutée avec succès !');
            console.log('Réponse du serveur:', res); // Log de la réponse du serveur
            this.audienceForm.reset();
          },
          error: err => {
            alert('Erreur lors de l’ajout');
            console.error('Erreur serveur:', err); // Log de l'erreur
          }
        });
      } else {
        alert('Le formulaire n\'est pas valide');
        console.log('Formulaire invalide', this.audienceForm.errors); // Log des erreurs du formulaire
      }
    }
    
  }
  
