import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientService, Client } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  client: Client = {
    cin: 0,
    nom: '',
    email: '',
    telephone: '',
    adresse: ''
  };
  formSubmitted: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("🆔 ID reçu depuis l'URL :", id); // 🔍 Ajoute ceci
  
    if (id) {
      this.clientService.getClientById(id).subscribe({
        next: (data) => {
          console.log("📦 Données récupérées :", data); // 🔍 Et ceci
          this.client = data;
        },
        error: (err) => console.error('❌ Erreur lors de la récupération du client', err)
      });
    }
  }
  

  onSubmit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientService.updateClient(id, this.client).subscribe({
        next: () => {
          console.log('Client modifié avec succès');
          this.router.navigate(['/clients/list']);
        },
        error: err => console.error('Erreur modification client', err)
      });
    }
  }
}
