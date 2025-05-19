import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TribunalService } from '../../services/tribunal.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { routes } from '../../app.routes';
import { ToastrService } from 'ngx-toastr'; // Ajouter Toastr

@Component({
  selector: 'app-add-edit-tribunal',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './add-tribunal.component.html',
  styleUrls: ['./add-tribunal.component.css']
})
export class AddTribunalComponent {
  tribunal = {
    nom: '',
    categorie: '',
    adresse: '',
    contact: {
      telephone: '',
      email: ''
    }
  };
  categories = ['محاكم قضائية', 'المحاكم الابتدائية', 'محاكم الاستئناف'];

  constructor(private tribunalService: TribunalService, private router: Router,
    private toastr: ToastrService // Ajouter Toastr

  ) { }

  saveTribunal() {
    console.log(this.tribunal); // Pour vérifier les données avant envoi

    if (!this.tribunal.categorie) {
      alert("Veuillez sélectionner une catégorie.");
      return;
    }

    this.tribunalService.addTribunal(this.tribunal).subscribe(() => {
      this.toastr.success('محكمة أُضيفت بنجاح!'); // Toast de succès
    }, (error) => {
      this.toastr.error('خطأ في إضافة المحكمة.'); // Toast d'erreur
    });
  }
}

