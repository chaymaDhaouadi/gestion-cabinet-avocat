import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../../services/client.service';
import { FactureService } from '../../services/facture.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { sharedImports } from '../../shared/shared.module'; // <-- Ici tu importes sharedImports
import { DossierService } from '../../services/dossier-service.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facture-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './facture-add.component.html',
  styleUrls: ['./facture-add.component.css']
})
export class FactureAddComponent implements OnInit {
  factureForm!: FormGroup;
  clients: any[] = [];
  dossiers: any[] = []; // -- Nouveau tableau pour les dossiers

  facture = {
    clientId: '',
    dossierId: '',
    montant: null,
    description: ''
  };

  constructor(
    private fb: FormBuilder,
    private factureService: FactureService,
    private toastr: ToastrService,
    private clientService: ClientService,
    private router: Router,
    private dossierService: DossierService,
    private http: HttpClient,
    private route: ActivatedRoute  // <-- ajouté

  ) { }

  showSuccess() {
    this.toastr.success('Facture ajoutée avec succès!', 'Succès');
  }

  showError() {
    this.toastr.error('Erreur lors de l’ajout de la facture', 'Erreur');
  }

  ngOnInit(): void {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });
    this.http.get<any[]>('http://localhost:3000/api/dossiers').subscribe(data => {
      this.dossiers = data;
    })
    this.factureForm = this.fb.group({
      numeroFacture: [
        '',
        [
          Validators.required,
          Validators.pattern(/^FAC-\d{5}$/) // Vérifier que le numéro commence par FAC- et a 5 chiffres
        ]
      ],
      clientId: ['', Validators.required],
      dossierId: ['', Validators.required], // <-- Ajoute dossierId avec Validators.required

      montant: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      statut: ['', Validators.required],
      description: ['']
    });

    this.route.queryParams.subscribe(params => {
      if (params['dossierId'] && params['clientId']) {
        this.factureForm.patchValue({
          dossierId: params['dossierId'],
          clientId: params['clientId']
        });
      }
    });
  }
  receiptFile: File | null = null;

  onReceiptSelected(event: any) {
    this.receiptFile = event.target.files[0];
  }

  onSubmit() {
    if (this.factureForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur de validation',
        text: 'Veuillez vérifier le formulaire.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('numeroFacture', this.factureForm.value.numeroFacture);
    formData.append('clientId', this.factureForm.value.clientId);
    formData.append('dossierId', this.factureForm.value.dossierId);
    formData.append('montant', this.factureForm.value.montant);
    formData.append('description', this.factureForm.value.description);
    formData.append('date', this.factureForm.value.date);
    formData.append('statut', this.factureForm.value.statut);

    if (this.receiptFile) {
      formData.append('receipt', this.receiptFile);
    }

    this.http.post('http://localhost:3000/api/factures', formData).subscribe({
      next: res => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Facture ajoutée avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
        this.factureForm.reset();
        this.receiptFile = null;
        setTimeout(() => {
          this.router.navigate(['/facture-list']);
        }, 1500);
      },
      error: err => {
        if (err.status === 400 && err.error.message.includes("Le numéro de facture doit être unique")) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Le numéro de facture existe déjà.',
          });
        } else if (err.error.message) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: err.error.message,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de l’ajout de la facture.',
          });
        }
      }
    });
  }
}