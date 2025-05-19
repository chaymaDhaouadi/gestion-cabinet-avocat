import { Component, OnInit } from '@angular/core';
import { TribunalService } from '../../services/tribunal.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-tribunal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-tribunal.component.html',
  styleUrls: ['./edit-tribunal.component.css']
})
export class EditTribunalComponent implements OnInit {
  tribunal: any = {
    nom: '',
    categorie: '',
    adresse: '',
    contact: {
      telephone: '',
      email: ''
    }
  };
  categories = ['محاكم قضائية', 'المحاكم الابتدائية', 'محاكم الاستئناف'];

  constructor(
    private tribunalService: TribunalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTribunal(id);
    }
  }

  loadTribunal(id: string) {
    this.tribunalService.getTribunalById(id).subscribe((data) => {
      this.tribunal = data;
    });
  }

  updateTribunal() {
    if (!this.tribunal.categorie) {
      alert("Veuillez sélectionner une catégorie.");
      return;
    }

    this.tribunalService.updateTribunal(this.tribunal._id, this.tribunal).subscribe(() => {
      this.toastr.success("Tribunal modifié avec succès !");
      this.router.navigate(['/tribunaux']);
    }, (error) => {
      this.toastr.error("Erreur lors de la modification du tribunal.");
    });
  }
}