import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AudienceService } from '../../services/audience.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audience-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule], // ajoute ici tous les imports Angular nécessaires si c'est standalone
  templateUrl: './audience-list.component.html',
  providers: [AudienceService] // <- ajoute ça si besoin aussi
})
export class AudienceListComponent {
  audiences: any[] = [];
  private route = inject(ActivatedRoute);
  private audienceService = inject(AudienceService);

  ngOnInit(): void {
    const dossierId = this.route.snapshot.paramMap.get('dossierId');
    if (dossierId) {
      this.audienceService.getAudiencesByDossier(dossierId).subscribe((data: any[]) => {
        this.audiences = data;
      });
    }
  }
}
