// src/app/components/agenda/agenda.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { RendezVousService } from '../../services/rendezvous.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RendezVous } from '../../models/rendezvous.model';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ListRdvDateComponentComponent } from './list-rdv-date-component/list-rdv-date-component.component';
// ✅ Assure-toi d'importer comme ça :
import { loadGapiInsideDOM } from 'gapi-script';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FullCalendarModule,
    MatDialogModule,
  ],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    selectable: true,
    editable: true,
    events: [],
    dateClick: this.handleDateClick.bind(this),
  };

  constructor(private dialog: MatDialog, private rendezVousService: RendezVousService) { }

  ngOnInit(): void {
    this.loadEvents();

  }


  handleDateClick(arg: any) {
    this.openRdvList(arg.dateStr);
  }

  loadEvents() {
    this.rendezVousService.getAll().subscribe((rdvs: RendezVous[]) => {
      this.calendarOptions.events = rdvs.map((rdv) => ({
        title: `${rdv.clientId?.nom || 'Client inconnu'} - ${rdv.titre}`,
        start: `${rdv.date}T${rdv.heure}`,
        extendedProps: rdv,
      }));
    });
  }

  // ✅ Méthode pour ouvrir la liste des rendez-vous pour la date sélectionnée
  openRdvList(date: string) {
    this.dialog.open(ListRdvDateComponentComponent, {
      width: '500px',
      data: { date }
    });
  }
}
