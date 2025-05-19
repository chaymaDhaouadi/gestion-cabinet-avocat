import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RendezVousService } from '../../../services/rendezvous.service';
import { RendezVous } from '../../../models/rendezvous.model';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AjoutRdvDialogComponent } from '../ajout-rdv-dialog/ajout-rdv-dialog.component';
import { ModifierRdvComponentComponent } from '../modifier-rdv.component/modifier-rdv.component.component';

@Component({
  selector: 'app-list-rdv-date',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-rdv-date-component.component.html',
  styleUrls: ['./list-rdv-date-component.component.css']
})
export class ListRdvDateComponentComponent implements OnInit {
  rdvs: RendezVous[] = [];
  maxRdvPerDay = 5;
  errorMessage: string = ''; // ✅ Variable pour le message d'erreur
  date: any;

  constructor(
    private dialogRef: MatDialogRef<ListRdvDateComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // ✅ Changer en 'data' au lieu de 'date'
    private rendezVousService: RendezVousService,
    private dialog: MatDialog
  ) {
    this.date = typeof this.data.date === 'string' ? this.data.date : '';
  }

  ngOnInit(): void {
    this.loadRendezVous();
  }

  loadRendezVous() {
    if (!this.date || !this.isValidDate(this.date)) {
      console.error('❌ Date sélectionnée non définie ou incorrecte. Date reçue :', this.date);
      this.rdvs = [];
      this.errorMessage = '❌ Date sélectionnée non définie ou incorrecte. Veuillez sélectionner une date valide.';
      return;
    }

    const dateSelected = new Date(this.date).toISOString().split('T')[0];
    this.errorMessage = ''; // ✅ Réinitialiser le message d'erreur si la date est correcte

    this.rendezVousService.getAll().subscribe((res) => {
      this.rdvs = res.filter(rdv => {
        if (!rdv.date) {
          console.error('❌ Date de rendez-vous incorrecte :', rdv.date);
          return false;
        }

        const rdvDate = new Date(rdv.date).toISOString().split('T')[0];
        return rdvDate === dateSelected;
      }).map(rdv => ({
        ...rdv,
        clientName: rdv.clientId ? rdv.clientId.nom : 'Client inconnu',
        clientPhone: rdv.clientId ? rdv.clientId.telephone : 'Non disponible'
      }));

      console.log('✅ Liste des rendez-vous chargés pour cette date :', this.rdvs);
    });
  }

  // ✅ Méthode utilitaire pour vérifier la validité de la date
  isValidDate(dateString: string): boolean {
    return !isNaN(Date.parse(dateString));
  }




  addRdv() {
    if (this.rdvs.length >= this.maxRdvPerDay) {
      Swal.fire('Limite atteinte', 'Vous avez atteint la limite de 5 rendez-vous pour cette date.', 'warning');
      return;
    }

    const dialogRef = this.dialog.open(AjoutRdvDialogComponent, {
      data: { date: this.date },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((rdv) => {
      if (rdv) {
        // ✅ Si un rendez-vous a été ajouté, on recharge la liste
        this.rdvs.push(rdv); // Ajoute le nouveau rendez-vous directement
        this.rdvs = [...this.rdvs]; // Met à jour la liste pour Angular
      }
    });
  }


  modifyRdv(rdv: RendezVous) {
    if (!rdv._id) {
      Swal.fire('Erreur', 'Identifiant de rendez-vous manquant.', 'error');
      return;
    }

    const dialogRef = this.dialog.open(ModifierRdvComponentComponent, {
      data: { ...rdv },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((updatedRdv) => {
      if (updatedRdv) {
        // Mise à jour locale de la liste des rendez-vous
        const index = this.rdvs.findIndex(item => item._id === updatedRdv._id);
        if (index !== -1) {
          this.rdvs[index] = updatedRdv;
          this.rdvs = [...this.rdvs]; // Forcer l'actualisation
        }
      }
    });
  }


  deleteRdv(id?: string) {
    if (!id) {
      Swal.fire('Erreur', 'Identifiant de rendez-vous manquant.', 'error');
      return;
    }

    Swal.fire({
      title: 'Confirmer la suppression ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rendezVousService.deleteRendezVous(id).subscribe(() => {
          this.loadRendezVous();
          Swal.fire('Supprimé !', 'Le rendez-vous a été supprimé.', 'success');
        });
      }
    });
  }


  close() {
    this.dialogRef.close();
  }
}