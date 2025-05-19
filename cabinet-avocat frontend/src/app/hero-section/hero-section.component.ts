import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
selector: 'app-hero-section',
standalone: true,
imports:[CommonModule],
templateUrl: './hero-section.component.html',
styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent {
slides = [
{ text: 'Maître Mouadh Jaballah' , subtext: 'Votre partenaire juridique de confiance en Tunisie'},
{ text: 'Quand tout le monde te tourne le dos,<br>seul ton avocat sera à tes côtés !' }
];

currentSlide = 0;

nextSlide() {
this.currentSlide = (this.currentSlide + 1) % this.slides.length;
}

prevSlide() {
this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
}
}
