import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Champs de recherche
  cinRecherche: string = '';
  clientTrouve: any = null;
  showToast = false;
  constructor(private http: HttpClient) {}

  // Recherche d'un client par CIN
  rechercherClientParCIN() {
    this.http.get(`http://localhost:3000/api/clients/cin/${this.cinRecherche}`).subscribe({
      next: (client: any) => {
        this.clientTrouve = client;
        Swal.fire({
          icon: 'success',
          title: '✅ Client trouvé',
          html: `
            <b>Nom :</b> ${client.nom}<br>
            <b>Email :</b> ${client.email}<br>
            <b>Téléphone :</b> ${client.telephone}<br>
            <b>Adresse :</b> ${client.adresse}
          `,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      },
      error: () => {
        this.clientTrouve = null;
        Swal.fire({
          icon: 'error',
          title: '❌ Client non trouvé',
          text: 'Vérifie le CIN et réessaye.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Fermer'
        });
      }
    });
  }
  
  

  // Données utilisateur
  userName = 'Maitre';
  userImageUrl = 'https://randomuser.me/api/portraits/men/32.jpg';

  // Affichage de la barre de recherche
  showSearch = false;

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  closeSearch() {
    this.showSearch = false;
  }
}
