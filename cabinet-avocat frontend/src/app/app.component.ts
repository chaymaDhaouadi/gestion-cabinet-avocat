import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { FooterComponent } from './footer/footer.component';
import { ServicesComponent } from './services/services.component'; // ici

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterModule,
    HeroSectionComponent,
    ServicesComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'cabinet-avocat';
  constructor(public router: Router) { }

}



