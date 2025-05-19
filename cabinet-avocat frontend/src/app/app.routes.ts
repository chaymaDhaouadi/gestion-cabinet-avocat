import { Routes } from '@angular/router';
import { ListComponent } from './clients/list/list.component';
import { ClientsComponent } from './clients/clients.compnent';
import { EditComponent } from './clients/edit/edit.component';
import { AudienceListComponent } from './components/audience-list/audience-list.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DossierAddComponent } from './dossier/add-dossier-component/add-dossier-component.component';
import { DocumentAddComponent } from './components/document-add/document-add.component';

import { FactureAddComponent } from './factures/facture-add/facture-add.component';
import { FactureListComponent } from './factures/facture-list/facture-list.component';
import { DocumentEditComponent } from './components/document-edit/document-edit.component';
import { DossierListComponentComponent } from './dossier/dossier-list-component/dossier-list-component.component';
import { AgendaComponent } from './rendezvous/agenda/agenda.component';
import { ListRdvDateComponentComponent } from './rendezvous/agenda/list-rdv-date-component/list-rdv-date-component.component';
import { AddTribunalComponent } from './tribunaux/add-tribunal/add-tribunal.component';
import { TribunalListComponent } from './tribunaux/tribunal-list/tribunal-list.component';
import { EditTribunalComponent } from './tribunaux/edit-tribunal/edit-tribunal.component';
import { DossierDetailComponent } from './dossier-detail/dossier-detail.component';

export const routes: Routes = [
  {
    path: 'facture-list',
    loadComponent: () => import('./factures/facture-list/facture-list.component').then(m => m.FactureListComponent)
  },
  {
    path: 'facture-add',
    loadComponent: () => import('./factures/facture-add/facture-add.component').then(m => m.FactureAddComponent)
  },

  {
    path: 'clients',
    component: ClientsComponent,
    children: [
      { path: 'list', component: ListComponent },
      {
        path: 'add',
        loadComponent: () => import('./clients/add/add.component').then(m => m.AddComponent)
      },
      {
        path: 'edit/:id',
        component: EditComponent
      }
    ]
  },
  {
    path: 'audiences',
    children: [
      {
        path: 'add',
        loadComponent: () => import('./components/audience-add/audience-add.component').then(m => m.AudienceAddComponent)
      },
      {
        path: ':dossierId',
        component: AudienceListComponent
      }
    ]
  },
  { path: 'dossiers/add', component: DossierAddComponent },
  { path: 'dossiers/list', component: DossierListComponentComponent },
  {
    path: 'modifier-dossier/:id',
    loadComponent: () => import('./dossier/modifier-dossier/modifier-dossier.component').then(m => m.ModifierDossierComponent)
  },

  { path: 'document/add', component: DocumentAddComponent },
  { path: 'document/list', component: DocumentListComponent },
  {
    path: 'document/edit/:id',
    component: DocumentEditComponent // ou loadComponent si standalone
  },

  { path: 'agenda', component: AgendaComponent },
  { path: 'agenda/list', component: ListRdvDateComponentComponent },
  { path: 'tribunaux', component: TribunalListComponent },
  { path: 'tribunal/edit/:id', component: EditTribunalComponent },

  {
    path: 'tribunaux/add',
    loadComponent: () => import('./tribunaux/add-tribunal/add-tribunal.component').then(m => m.AddTribunalComponent)
  },
  { path: 'dossiers/details/:id', component: DossierDetailComponent },
  {
    path: 'documents/:dossierId',
    component: DocumentListComponent
  },
  { path: 'document/list/:dossierId', component: DocumentListComponent }





];
