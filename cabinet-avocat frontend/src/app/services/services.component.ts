import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})

export class ServicesComponent {
  private rendezvousList = new BehaviorSubject<any[]>([]); // Flux d'événements
  rendezvousList$ = this.rendezvousList.asObservable(); // Observateur

  constructor() { }

  getRendezvous() {
    return this.rendezvousList$;
  }

  addRendezvous(rendezvous: any) {
    const currentList = this.rendezvousList.value;
    this.rendezvousList.next([...currentList, rendezvous]); // Ajout dans le flux
  }
}
