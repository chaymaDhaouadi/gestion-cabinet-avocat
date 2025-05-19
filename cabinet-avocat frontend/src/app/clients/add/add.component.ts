import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService, Client } from '../../services/client.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  client: Client = {
    cin: 0,
    nom: '',
    email: '',
    telephone: '',
    adresse: ''
  };

  formSubmitted: boolean = false;
  toastMessage: string | null = null;
  toastType: 'success' | 'warning' | 'error' = 'success';
  cinError: string | null = null;

  constructor(private router: Router, private clientService: ClientService) { }
  showToast(message: string, type: 'success' | 'warning' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;

    setTimeout(() => {
      this.toastMessage = null;
    }, 3000); // disparaît après 3 secondes
  }
  checkCIN() {
    const cinStr = this.client.cin.toString();

    // Vérification du format du CIN
    if (cinStr.length !== 8 || !/^(14|06)\d{6}$/.test(cinStr)) {
      this.cinError = "❌ Le CIN doit contenir 8 chiffres et commencer par 14 ou 06.";
      return;
    } else {
      this.cinError = null; // ✅ Réinitialiser l'erreur si format correct
    }
    // Vérification d'unicité du CIN
    this.clientService.getClientByCIN(this.client.cin).subscribe({
      next: (existingClient) => {
        if (existingClient) {
          this.cinError = "⚠️ Ce CIN est déjà utilisé par un autre client.";
        } else {
          this.cinError = null;
        }
      },
      error: () => {
        this.cinError = null; // Pas de client trouvé avec ce CIN
      }
    });
  }

  onSubmit() {
    this.clientService.addClient(this.client).subscribe({
      next: () => {
        this.showToast('✅ Client ajouté avec succès !', 'success');
        setTimeout(() => {
          this.router.navigate(['/clients/list']);
        }, 1000); // attend 1 seconde pour voir le toast
      },

      error: (err) => {
        if (err.status === 400 && err.error.message.includes('CIN')) {
          this.showToast('⚠️ CIN déjà utilisé !', 'warning');
        } else {
          this.showToast('❌ Erreur lors de l\'ajout du client', 'error');
        }
      }
    });
  }

}
