import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { Client, ClientService } from '../../../services/client.service';
import Swal from 'sweetalert2';
import { RendezVousService } from '../../../services/rendezvous.service';
import { RdvCheckResponse } from '../../../models/rendezvous.model'; // Importe l'interface

@Component({
  selector: 'app-ajout-rdv-dialog',
  standalone: true,
  imports: [RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './ajout-rdv-dialog.component.html',
  styleUrls: ['./ajout-rdv-dialog.component.css']
})
export class AjoutRdvDialogComponent {
  form: FormGroup;
  clients: Client[] = [];
  rdvData: any = {
    clientId: '',
    titre: '',
    date: '',
    heure: '',
    lieu: '',
    notes: '',
    statut: ''
  };

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: RouterModule,
    private rendezVousService: RendezVousService, // ✅ Ajoute ici

    public dialogRef: MatDialogRef<AjoutRdvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      date: [data.date || '', Validators.required],
      heure: ['', Validators.required],
      lieu: [''],
      notes: [''],
      clientId: ['', Validators.required],
      statut: ['prévu']  // ✅ Ajoute bien cette ligne

    });
  }
  ngOnInit() {
    this.clientService.getClients().subscribe((res) => {
      this.clients = res;
    });
  }
  save() {
    if (this.form.valid) {
      const formData = this.form.value;
      const rdvToSend = {
        titre: formData.titre,
        date: formData.date,
        heure: formData.heure,
        lieu: formData.lieu,
        notes: formData.notes,
        clientId: formData.clientId,
        statut: formData.statut,
      };
      this.rendezVousService.addGoogleCalendarEvent(rdvToSend).subscribe(
        (response) => {
          Swal.fire({
            title: 'Rendez-vous créé avec succès !',
            text: `Le rendez-vous a été ajouté à votre Google Calendar.`,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.dialogRef.close(response);
        },
        (error) => {
          Swal.fire('Erreur', 'Impossible de créer le rendez-vous dans Google Calendar.', 'error');
        }
      );

      this.rendezVousService.addRendezVous(rdvToSend).subscribe(
        (response) => {
          Swal.fire({
            title: 'Rendez-vous créé avec succès !',
            text: `Le rendez-vous a été ajouté.`,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.dialogRef.close(response);
          });
        },
        (error) => {
          console.error('❌ Erreur lors de l\'enregistrement du rendez-vous :', error);
          if (error.status === 400 && error.error.error) {
            this.showCustomAlert(
              '⏰ Conflit horaire',
              error.error.error,
              'warning'
            );
          } else {
            this.showCustomAlert(
              'Erreur',
              'Impossible de créer le rendez-vous.',
              'error'
            );
          }
        }
      );
    } else {
      this.showCustomAlert(
        'Erreur',
        'Veuillez remplir tous les champs obligatoires.',
        'error'
      );
    }
  }

  // ✅ Méthode pour afficher une alerte personnalisée
  showCustomAlert(title: string, text: string, icon: any) {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK'
    });
  }


  close() {
    this.dialogRef.close();
  }
}
