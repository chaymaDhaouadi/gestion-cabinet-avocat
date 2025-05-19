import { Component, OnInit } from '@angular/core';
import { TribunalService } from '../../services/tribunal.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tribunal-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tribunal-list.component.html',
  styleUrls: ['./tribunal-list.component.css']
})
export class TribunalListComponent implements OnInit {
  tribunaux: any[] = [];
  searchText: string = '';

  constructor(private tribunalService: TribunalService, private router: Router) { }

  ngOnInit() {
    this.loadTribunaux();
  }

  loadTribunaux() {
    this.tribunalService.getTribunaux().subscribe((data: any[]) => {
      this.tribunaux = data;
    });
  }

  filteredTribunaux() {
    return this.tribunaux.filter((tribunal) =>
      tribunal.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
      tribunal.categorie.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  deleteTribunal(id: string) {
    if (confirm("هل أنت متأكد من حذف هذا المحكمة؟")) {
      this.tribunalService.deleteTribunal(id).subscribe(() => {
        this.loadTribunaux();
      });
    }
  }

  navigateToAdd() {
    this.router.navigate(['/tribunaux/add']);
  }

  navigateToEdit(id: string) {
    this.router.navigate(['/tribunal/edit', id]);
  }
}
