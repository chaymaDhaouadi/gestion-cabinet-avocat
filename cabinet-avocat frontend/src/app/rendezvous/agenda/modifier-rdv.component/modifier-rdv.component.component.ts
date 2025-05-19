import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { RendezVousService } from '../../../services/rendezvous.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../../services/client.service';
@Component({
  selector: 'app-modifier-rdv.component',
  standalone: true,
  imports: [RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,],
  templateUrl: './modifier-rdv.component.component.html',
  styleUrls: ['./modifier-rdv.component.component.css']
})
export class ModifierRdvComponentComponent {

  form: FormGroup;
  clients: any[] = [];

  constructor(
    private fb: FormBuilder,
    private rendezVousService: RendezVousService,
    private clientService: ClientService, // ✅ Service Client pour obtenir la liste des clients

    private dialogRef: MatDialogRef<ModifierRdvComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      clientId: [this.data.clientId._id, Validators.required], // ✅ Champ client modifiable

      titre: [data.titre, Validators.required],
      date: [data.date, Validators.required],
      heure: [data.heure, Validators.required],
      lieu: [data.lieu],
      notes: [data.notes],

      statut: [data.statut || 'prévu']
    });
    this.loadClients();
  }
  loadClients() {
    this.clientService.getClients().subscribe(
      (clients) => {
        this.clients = clients;
      },
      (error) => {
        console.error('Erreur lors du chargement des clients :', error);
      }
    );
  }
  save() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const updatedRdv = {
        titre: formValue.titre,
        heure: formValue.heure,

        lieu: formValue.lieu,
        notes: formValue.notes,
        statut: formValue.statut,
        clientId: formValue.clientId,
        date: this.data.date, // ✅ Garde la même date

      };

      console.log("✅ Données envoyées pour modification :", updatedRdv);

      this.rendezVousService.updateRendezVous(this.data._id, updatedRdv).subscribe(
        (response) => {
          Swal.fire('Succès', 'Le rendez-vous a été modifié avec succès !', 'success');
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Erreur lors de la modification du rendez-vous :', error);
          Swal.fire('Erreur', 'Impossible de modifier le rendez-vous.', 'error');
        }
      );
    }
  }


  close() {
    this.dialogRef.close();
  }

}
