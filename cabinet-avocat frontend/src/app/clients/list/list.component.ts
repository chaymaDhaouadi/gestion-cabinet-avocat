import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClientService, Client } from '../../services/client.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  clients: Client[] = [];
  searchQuery: string = '';

  constructor(private clientService: ClientService, private router: Router) { }
  ngOnInit(): void {
    console.log('ListComponent init');
    this.clientService.getClients().subscribe((clients: Client[]) => {
      console.log('Clients récupérés :', clients); // 👈 ajoute ça
      this.clients = clients;
    });
  }
  editClient(id: string) {
    this.router.navigate(['/clients/edit', id]);
  }

  // Méthode pour filtrer les clients (par NCIN ou Nom)
  filteredClients(): Client[] {
    if (!this.searchQuery.trim()) return this.clients;

    return this.clients.filter(client =>
      client.cin.toString().includes(this.searchQuery.trim()) ||
      client.nom.toLowerCase().includes(this.searchQuery.trim().toLowerCase())
    );
  }

  // Réinitialiser la recherche
  resetSearch() {
    this.searchQuery = '';
  }
  deleteClient(id: string) {
    if (confirm('Supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe(() => {
        this.clients = this.clients.filter(c => c._id !== id);
      });
    }
  }
}
