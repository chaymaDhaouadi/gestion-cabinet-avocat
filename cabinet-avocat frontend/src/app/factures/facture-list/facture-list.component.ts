import { Component, OnInit } from '@angular/core';
import { FactureService } from '../../services/facture.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-facture-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    FormsModule,

  ],
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.css']
})
export class FactureListComponent implements OnInit {
  factures: any[] = [];  // Tableau des factures
  filteredFactures: any[] = []; // Factures filtrées par recherche
  searchText: string = ''; // Te
  constructor(private factureService: FactureService) { }
  imprimerFacture(facture: any) {
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>Facture ${facture.numeroFacture}</h1>
        <p><strong>Client:</strong> ${facture.clientId?.nom}</p>
        <p><strong>Montant:</strong> ${facture.montant} Dinars</p>
        <p><strong>Date:</strong> ${new Date(facture.date).toLocaleDateString()}</p>
        <p><strong>Statut:</strong> ${facture.statut}</p>
        <p><strong>Description:</strong> ${facture.description}</p>
      </div>
    `;

    const newWindow = window.open('', '', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(printContent);
      newWindow.document.close();
      newWindow.print();
    }
  }

  ngOnInit(): void {
    // Récupération des factures depuis le service
    this.factureService.getFactures().subscribe(
      (data) => {
        this.factures = data;  // Stockage des factures dans la variable factures
        this.filteredFactures = data; // Initialiser les factures filtrées

      },
      (error) => {
        console.error('Erreur lors de la récupération des factures', error);
      }
    );
  }
  // Méthode de recherche par numéro de facture
  onSearch(): void {
    const searchTerm = this.searchText.toLowerCase().trim();
    this.filteredFactures = this.factures.filter(facture =>
      facture.numeroFacture.toLowerCase().includes(searchTerm)
    );
  }
  // Méthode pour supprimer une facture
  onDelete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      this.factureService.deleteFacture(id).subscribe({
        next: () => {
          this.factures = this.factures.filter(facture => facture._id !== id);
          alert('Facture supprimée avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la facture', error);
          alert('Erreur lors de la suppression de la facture');
        }
      });
    }
  }

}